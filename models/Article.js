var mongoose = require("mongoose");
// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

//Using the Schema constructor to create a new ArticleSchema object


var ArticleSchema = new Schema({
  // 'name' must be of a type of string
  // 'name ' must be unique, the deafault mongoose error message is thrown if a dubplicate value is given
  title: {
    unique: true,
    type: String,
    required: true
  },
  link: {
    unique: true,
    type: String,
    required: true
  },
  description: {
    unique: true,
    type: String,
  },
  image: {
    unique: true,
    type: String,
  },
  favorited: {
    type: String,
    default: false
  },
  //'comment' is an object that stores ObjectIDS
  //The ref property links these ObjectIDs to the Comment model
  //This allows us to populate the Article with an associated Comment
  comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }
})
// This creates our model from the above schema, using the mongoose's model method.

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;



