var express = require("express");
var bodyParser = require("body-parser");
var port = process.env.PORT||3001;
var app = express();
var exphbs = require("express-handlebars");
var admin = require('firebase-admin')
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

require("./controller/apiroutes.js")(app);
require("./controller/htmlroutes.js")(app);


app.listen(port, ()=> {
  console.log('listening on ' + port);
});
