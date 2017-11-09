const db = require("../config/connection.js"),
  axios = require("axios");

module.exports = (app) => {

  app.get('/api/all', (req,res) => {
      const hotspots = [];
      db.get().then( data => {
      //fetch everything from db, format it and place in array 
      data.forEach(doc => {
          hotspots.push({id: doc.id, keywords: doc.data().keywords, locations: doc.data().locations});
      });
      res.json(hotspots);
        //console.log(hotspots);		
      });
  })//get api/all

  //global vars for post route
  let keywords = "";
  let responses = [];

  app.post("/api", (req, res)=>{
    keywords = req.body.newKeywords;
    axios.get('https://api.indeed.com/ads/apisearch', {
      params: {
        publisher: '1211867702868069',
        v: '2',
        format: 'json',
        l: 'USA',
        q: keywords,
        limit: '24',
        start: 1
      }
    })
    .then((response) => {
      const data = response.data,               //get the job results
        totalResults = data.totalResults;       //number of results
      let maxResults = Math.ceil(totalResults/24);//number of api calls to make
      let counter = 0;                          //counter to ensure end of all results
      //push the locations to the array 
      let found;
      for (result of data.results) {
        found = responses.find((o, i) => {
          if (o.place === result.formattedLocation) {
            responses[i] = {'place':o.place, 'count':(o.count+1)}
            return true
          } 
        });
        if (!found) {
            responses.push({'place':result.formattedLocation, 'count':1})         
        }
      }
      for (i = 1; i < maxResults; i++){
        getIndeedJobs(i, maxResults, responses, keywords, res);      
      }      
      });
    //call the model function to insert query	
    // db.add({
    // 	keywords: req.body.newKeywords,
    // 	locations: [{place: req.body.newPlace, count: req.body.newCount}]
    // });
//    res.redirect("/");	
  });
  
  const getIndeedJobs = (i, maxResults, responses, keywords, res) => {
    axios.get('https://api.indeed.com/ads/apisearch', {
      params: {
        publisher: '1211867702868069',
        v: '2',
        format: 'json',
        l: 'USA',
        q: keywords,
        limit: '24',
        start: i*24
      }
    })
    .then((response) => {
      //push the locations to the array 
      let found;
      for (result of response.data.results) {
        found = responses.find((o, i) => {
          if (o.place === result.formattedLocation) {
            responses[i] = {'place':o.place, 'count':(o.count+1)}
            return true
          } 
        });
        if (!found) {
            responses.push({'place':result.formattedLocation, 'count':1})         
        }
      }
      if (i >= maxResults-1){
        console.log(responses);
        db.add({
          keywords: keywords,
          locations: responses
        });
        res.json(responses)
        
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }
}
