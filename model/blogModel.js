const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const BlogSchema = new Schema(
  {
    id: ObjectId,
    title: {
      type: String,
      required: [true, "Title cannot be blank"],
      unique: true,
    },
    description: {
      type: String,
    },

    author: {
      type: String,
    },

    state: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    read_count: {
      type: Number,
      default: 0,
    },

    reading_time: { type: String },
    tags: [
      {
        type: String,
      },
    ],

    body: {
      type: String,
      required: [true, "Body cannot be blank"],
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

BlogSchema.plugin(uniqueValidator, { message: "is already taken." }); //uniqueValidator plugin and returns friendly message if title is taken

BlogSchema.pre("save", async function (next) {
  const blog = this;
  const bodyLength = blog.body.split(" ").length;
  const wpm = 210;
  let readingTime = Math.floor(bodyLength / wpm);
  if (readingTime === 0) {
    readingTime = 1;
  }

  this.reading_time = `${readingTime} minute(s) read`;
  next();
});

const Blog = mongoose.model("Blog", BlogSchema);

module.exports = Blog;
