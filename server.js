const express = require("express");
// const hb = require("express-handlebars");
const mongoose = require("mongoose");
const cheerio = require("cheerio");
const axios = require("axios");
const logger = require("morgan");

const db = require("./models");

const PORT = process.env.PORT || 3000;
var app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

app.get("/scrape", function (req, res) {
  axios.get("https://marvelstudiosnews.com/category/movies/").then(function (response) {
    var $ = cheerio.load(response.data);

    let results = {};

    $("div.td_module_10.td_module_wrap.td-animation-stack").each(function (i, element) {

      results.image = $(element).children().find("img").attr("src");
      results.title = $(element).children().find("a").text();
      results.link = $(element).children().find("a").attr("href");
      results.description = $(element).children().find("div.td-excerpt").text().replace(/\s+/g, ' ').trim();
      results.favorited = false;

      db.Article.create(results).then(function(dbArticle){
        // console.log(dbArticle);
      })
      .catch(function(err){
        console.log(err)
      })
     })
    res.send("scrape is complete")
    console.log(results);
  })
})

app.get("/articles", function(req, res){
    db.Article.find({})
    .then(function(dbArticle){
        res.json(dbArticle);
    })
    .catch(function(err){
        res.json(err);
    })
})


app.listen(PORT, function () {
  console.log("app is listening on " + PORT + "!!!");
})