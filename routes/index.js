const express = require('express');
const User = require('../models/User');
const Book = require('../models/Book');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.send('Home')
});

router.get('/getUser/:id', (req, res) => {

  User.findById(req.params.id)
    .then((result) => {
      res.send(result)
    })
    .catch((err) => {
      console.log(err)
    })
})

router.post('/myBooks', (req, res) => {
  const { title, image, owner } = req.body

  Book.create({ title, image, owner })
    .then((createdBook) => {
      User.findByIdAndUpdate(owner, { $push: { myBooks: createdBook._id } })
        .then((result) => result)
    })
    .catch((err) => console.log(err))
})

router.post('/showMyBooks', (req, res) => {

  const owner = req.body.owner

  User.findById(owner)
    .populate('myBooks')
    .then((result) => {
      res.send(result)
    })
    .catch((err) => console.log(err))
})

router.post('/allBooks', (req, res) => {
  Book.find({})
  .populate('owner')
    .then((result) => {
      res.send(result)

    })
    .catch((err) => console.log(err))
})

module.exports = router;
