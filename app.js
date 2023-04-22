const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require('lodash');

const homeStartingContent = "Welcome to our Daily Journal Blog";
const aboutContent = "Welcome to Daily Journal Blog, where I document my live and share my experience with the world. I believe that everyone has a story to tell, and I'm excited to share my with you. I believe that there's magic in the mundane, and strive to find it in everything we do. I started this blog as a way to connect with others and share my journey. Whether I'm writing about my travels, my struggles, or my triumphs, I hope that my stories inspire you to live your best life. Thank you for joining me on this adventure. I'm so grateful to have you here!";

const contactContent = "Thank you for visiting my Daily Journal Blog website! I always love to hear from my readers, whether you have a question, a suggestion, or just want to say hello. Please don't hesitate to get in touch. You can email me at manjotsighgulati13@gmail.com . I promise to get back to you as soon as possible.";

const app = express();

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/blogDB', {useNewUrlParser: true, useUnifiedTopology: true});

const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model('Post', postSchema);


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get('/', (req, res) => {
  Post.find({}, (err, posts) => {
  res.render('home', {
    homeContent: homeStartingContent,
    allPosts: posts
  });
 });
});

app.get('/about', (req, res) => {
  res.render('about', {aboutContent: aboutContent});
});

app.get('/contact', (req, res) => {
  res.render('contact', {contactContent: contactContent});
});


app.get('/compose', (req, res) => {
  res.render('compose');
});


app.post('/compose', (req, res) => {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save((err) => {
    if (!err){
      res.redirect('/');
    }
  });
  res.redirect('/');
});

app.get('/post/:postId', (req, res) => {
  const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, (err, post) => {
    res.render('post', {
      title: post.title,
      content: post.content
    });
  });

});

app.listen(4000, function() {
  console.log("Server started on port 4000");
});
