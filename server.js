//server.js
var ejs = require("ejs");
var express = require("express");
var request = require("request");
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

  this.access = function() {
    var searched = this.query.toString().trim().split(" ");
    searched = searched.join("+");
    console.log(searched);
    this.urlSearch = ejs.render("http://api.giphy.com/v1/gifs/search?q=<%-searched%>&api_key=dc6zaTOxFJmzC", {
      searched: searched
    });
    console.log(this.urlSearch);
    request(this.urlSearch, function(err, response, body) {
      //console.log(body);
      var parsed = JSON.parse(body).data;
      this.images = [];
      console.log(this.image);

      for (var i = 0; i < parsed.length; i++) {
        this.images.push(parsed[i].images.fixed_height.url);
      }
      console.log(this.images);
    });

  };
  counter++;
}
var sample = new Search("funny cat");
sample.access();
console.log(sample.query);

var searches = {
  0: sample,
};

app.get("/", function(req, res) {
  res.redirect("/searches");
});
app.get("/searches", function(req, res) {
  res.render("index.ejs", {
    searches: searches
  });
})
app.get("/search/new", function(req, res) {
  console.log(searches);
  res.render("search.ejs", {
    searches: searches
  });
});
app.post("/searches", function(req, res) {
  var newSearch = new Search(req.body.query);
  console.log(req.body.query);
  searches[newSearch.id] = newSearch;
  res.redirect("/search/" + newSearch.id);
});

app.get("/show/:id", function(req, res) {
  var search = searches[parseInt(req.params.id, 10)];
  console.log("params" + search);
  res.render("show.ejs", {
    search: search
  });
});

// app.get("/search", function(req, res) {
//   request("http://ron-swanson-quotes.herokuapp.com/quotes", function(err, response, body) {
//     console.log(body);
//     var quote = JSON.parse(body).quote;
//     var data = ejs.render("show.ejs", {
//       quote: quote
//     });
//     res.send(data);
//   });
// });

var port = 3000;

app.listen(port, function() {
  console.log("Server is listening on Port: " + port);
});