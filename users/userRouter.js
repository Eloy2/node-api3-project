const express = require('express');
const userdb = require("./userDb");
const postdb = require("../posts/postDb");

const router = express.Router();

router.post('/users', validateUser, (req, res) => {
  res.status(200).json(req.newUser)
});

router.post('/users/:id/posts', validatePost, (req, res) => {
  res.status(200).json(req.newpost)
});

router.get('/users', (req, res) => {  
  userdb.get()
  .then(users => {
    res.status(200).json(users)
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({ error: "Could not get list of users!"})
  })
});

router.get('/users/:id', validateUserId(), (req, res) => {
  res.status(200).json(req.user)
});

router.get('/users/:id/posts', validateUserId(), (req, res) => {
  userdb.getUserPosts(req.user.id)
    .then(posts => {
      res.status(200).json(posts)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: "Error getting posts" })
    })
});

router.delete('/users/:id', validateUserId(), (req, res) => {
  userdb.remove(req.user.id)
    .then(amountDeleted => {
      res.status(200).json({ message: `You deleted ${amountDeleted} user` })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: "Error getting User"})
    })
});

router.put('/users/:id', validateUserId(), (req, res) => {
  if (!req.body.name){
    res.status(404).json({ message: "please include name in body request"})
  } else {
    userdb.update(req.user.id, { name: req.body.name })
      .then(amountUpdated => {
        res.status(200).json({ message: `You updated ${amountUpdated} user` })
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({ error: "Error updating User"})
      })
  }
});

//custom middleware

function validateUserId() {
  return (req, res, next) => {
    userdb.getById(req.params.id)
      .then(user => {
        if (user) {
          // attach the user to the request object so we can use it in our endpoints
          req.user = user
          next()
        } else {
          res.status(400).json({ message: "invalid user id"})
        }
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({ error: "Error getting User"})
      })
  }
}

function validateUser(req, res, next) {
  if(!req.body.name){
    res.status(400).json({ message: "missing required name field in body" })
  } else {
    userdb.insert({ name: req.body.name })
      .then(user => {
        req.newUser = user
        next()
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({ error: "Error getting User"})
      })
  }
}

function validatePost(req, res, next) {
  if(!req.body.text) {
    res.status(400).json({message: "missing required text field in body"})
  } else {
    userdb.getById(req.params.id)
      .then(user => {
        postdb.insert({ text: req.body.text, user_id: req.params.id})
          .then(newpost => {
            req.newpost = newpost
            next()
          })
      })
      .catch(err => {
        console.log(err)
        res.status(404).json({ error: "User not found"})
      })
  }
}

module.exports = router;
