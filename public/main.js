var cityMap = [
  {
     address: "Houston, TX",
     population: 2714856
   },
  {
     address: "Chicago, IL",
     population: 8405837
   },
   {
     address: "Los Angeles, CA",
     population: 3857799
   },
   {
     address: "Seattle, WA",
     population: 603502
   }
 ];

function initMap(data) {
  console.log(data)
   var myLatLng = {lat:37.697948 , lng: -97.314835};
   var map = new google.maps.Map(document.getElementById('map'), {

     zoom: 4,

     center: myLatLng
   });

   if(data){
     data.forEach(function(city){
       $("#city-list").append('<li>'+ city.place  +'</li>')
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({'address':city.place}, function(results, status) {
          console.log(city.count);
          var lat = results[0].geometry.location.lat(),
          lng = results[0].geometry.location.lng(),
          cnt = city.count;
          console.log(lat)
          if (results[0]){
            console.log("in IF")
            var cityCircle = new google.maps.Circle({
              strokeColor: '#FF0000',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: '#FF0000',
              fillOpacity: 0.35,
              map: map,
              center: {lat: lat, lng: lng},
              radius: cnt * 5000
            });
            console.log("in IF")
          }
        });
      });

   }
   // Add the circle for this city to the map.
   else{
    cityMap.forEach(function(city){
       var geocoder = new google.maps.Geocoder();
       geocoder.geocode({'address':city.place}, function(results, status) {
         var cityCircle = new google.maps.Circle({
           strokeColor: '#FF0000',
           strokeOpacity: 0.8,
           strokeWeight: 2,
           fillColor: '#FF0000',
           fillOpacity: 0.35,
           map: map,
           center: {lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng()},
           radius: Math.sqrt(city.count) * 100
         });
       });
     });
   }
 }  //init map

$("#myForm").on("click", "button", (e) => {
  e.preventDefault();
  $("#city-list").html('')  
  var searchterm = $('#newKeywords1').val() || "Javascript";
  var sendData = {
    skill: searchterm
  }
  $.ajax({
    url: "/api/",
    method: "POST",
    data:sendData
  }).done(function(data){
      initMap(data);
  });

});

 $( document ).ready(function() {
  console.log( "ready!" );
  //harvest();
});
