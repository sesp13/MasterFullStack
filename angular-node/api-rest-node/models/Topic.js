'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Comment model
const CommentSchema = Schema({
  content: String,
  date: {
    type: Date,
    default: Date.now(),
  },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
});

const Comment = mongoose.model('Comment', CommentSchema);

//Topic model
const TopicSchema = Schema({
  title: String,
  content: String,
  code: String,
  lang: String,
  date: {
    type: Date,
    default: Date.now(),
  },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  comments: [CommentSchema],
});

module.exports = mongoose.model('Topic', TopicSchema);
