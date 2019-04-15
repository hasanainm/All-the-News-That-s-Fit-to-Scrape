const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let ArticleSchema = new Schema({
  image: {
      type: String
  },
    title: {
        type: String
    },
    link: {
        type: String
    },
    description: {
        type: String
    },
    favorited: {
        type: Boolean,
        default: false
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }
})

let Article = mongoose.model("Article", ArticleSchema)

module.exports = Article;