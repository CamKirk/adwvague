const request = require("request");

module.exports = (app) => {
  app.get('/', (req, response) => {
    request('http://' + req.get('host') + '/api/all', (err, res, body)=>{
      //send data to be rendered via index view
        response.render("index", {hotspots : JSON.parse(body)});
    }); //api get
  });   //html get

  app.post('/', (req, response) => {

    request.post({url:'http://' + req.get('host') + '/api', 
      form: {'newKeywords' : req.body.newKeywords}},
      (err, res, body) => {
        response.json(JSON.parse(body));
      });

    // request('http://' + req.get('host') + '/api', (err, res, body)=>{
    //   //send data to be rendered via index view
    //     response.render("index", {hotspots : JSON.parse(body)});
    // }); //api get

  });   //html get

};      //exports
