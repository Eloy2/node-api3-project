const express = require('express');
const postdb = require("./postDb");

const router = express.Router();

router.get('/posts', (req, res) => {
  postdb.get()
  .then(posts => {
    res.status(200).json(posts)
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({ error: "Could not get list of posts!"})
  })
});

router.get('/posts/:id', validatePostId,(req, res) => {
  res.status(200).json(req.post)
});

router.delete('/posts/:id', validatePostId,(req, res) => {
  postdb.remove(req.post.id)
    .then(amountDeleted => {
      res.status(200).json({ message: `You deleted ${amountDeleted} post`})
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: "Error deleting Post"})
    })
});

router.put('/posts/:id', validatePostId, (req, res) => {
  if(!req.body.text){
    res.status(400).json({ message: "Please include text in your request body"})
  } else {
    postdb.update(req.post.id, { text: req.body.text })
      .then(amountUpdated => {
        res.status(200).json({ message: `You updated ${amountUpdated} post`})
      })
  }
});

// custom middleware

function validatePostId(req, res, next) {
  postdb.getById(req.params.id)
    .then(post => {
      if (post) {
        req.post = post
        next()
      } else {
        res.status(400).json({ message: "invalid post id"})
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: "Error getting Post"})
    })
}

module.exports = router;
