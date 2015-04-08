//server.js
var ejs = require("ejs");
var express = require("express");

var app = express();
app.set("view_engine", "ejs");

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
  extended: false
}));

var override = require("method-override");
app.use(override("_method"));


var counter = 0;

function Search(query) {
  this.id = counter;
  this.query = query;

  function this.access(this.query) {
    var searched = this.query.toString().trim().split(" ");
    searched.join("+");
    var this.urlSearch = ejs.render("http://api.giphy.com/v1/gifs/search?q=<%-searched%>api_key=dc6zaTOxFJmzC", {
      searched: searched
    });
    request(this.urlSearch, function(req, res) {
      console.log(body);
    });
  };
  this.image=this.access(this.query);
  counter++;
};
var sample = new Search("puppies");

var searches = {
  0: sample,
};
app.get("/", function(req, res) {
  res.redirect("/search");
});
app.get("/search", function(req, res) {
  res.render("search.ejs");
});
app.post("/search", function(req, res) {
  var newSearch = new Search(req.body.query);
  searches[newSearch.id] = newSearch;
  res.redirect("/show");
});

app.get("/search", function(req, res) {
  request("http://ron-swanson-quotes.herokuapp.com/quotes", function(err, response, body) {
    console.log(body);
    var quote = JSON.parse(body).quote;
    var data = ejs.render("show.ejs", {
      quote: quote
    });
    res.send(data);
  });
});

var port = 3000;

app.listen(port, function() {
  console.log("Server is listening on Port: " + port);
});