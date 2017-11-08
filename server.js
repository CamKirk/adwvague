var express = require("express");
var bodyParser = require("body-parser");
var port = process.env.PORT||3000;
var app = express();
var exphbs = require("express-handlebars");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var apiroutes = require("./controller/apiroutes.js");
var htmlroutes = require("./controller/htmlroutes.js");


app.listen(port, ()=> {
  console.log('listening on ' + port);
});
