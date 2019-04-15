const express = require("express");
// const hb = require("express-handlebars");
const mongoose = require("mongoose");
const cheerio = require("cheerio");
const axios = require("axios");
const logger = require("morgan");

// const db = require("./models");

const port = 3000;
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
        console.log(dbArticle);
      })
      .catch(function(err){
        console.log(err)
      })
     })
    res.send("scrape is complete")
    console.log(results);
  })
})

app.get("/articles", function (req, res) {
  db.Article.find({}).then(function (dbArticle) {
    res.json(dbArticle);
  }).catch(function (err) {
    res.json(err);
  });
});

app.post("/articles/:id", function (req, res) {
  let id = req.params.id
  db.Article.updateOne({ _id: id }, { $set: { favorited: true } }, function (error, edited) {
    if (error) {
      console.log(error);
      res.send(error);
    }
    else {
      console.log(edited);
      res.send(edited);
    }
  })
})

app.get("/favorites", function (req, res) {
  db.Article.find({ favorited: true }).then(function (dbArticle) {
    res.json(dbArticle);
  }).catch(function (err) {
    res.json(err);
  });
})

app.post("/remove/:id", function (req, res) {
  let id = req.params.id
  db.Article.updateOne({ _id: id }, { $set: { favorited: false } }, function (error, edited) {
    if (error) {
      console.log(error);
      res.send(error);
    }
    else {
      console.log(edited);
      res.send(edited);
    }
  })
})

app.get("/article/:id", function (req, res) {
  let id = req.params.id
  db.Article.findOne({ _id: req.params.id })
    .populate("comment")
    .then(function (dbArticle) {
      console.log(dbArticle);
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
})

app.post("/comments/:id", function (req, res) {
  db.Comment.create(req.body)
    .then(function (dbComment) {
      db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: dbComment._id }, { new: true })
        .then(function(dbArticle) {
          res.json(dbArticle);
        })
        .catch(function(err) {
          res.json(err);
        });
    })
    .catch(function (err) {
      res.json(err);
    })
})

app.delete("/clear-all", function (req, res) {
  db.Article.deleteMany({ favorited: false }, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log(null, data);
    }
  });
})

app.listen(port, function () {
  console.log("app is listening on " + port + "!!!");
})