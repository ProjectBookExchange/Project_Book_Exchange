const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Book = require('../models/Book');

const uploader = require('../configs/cloudinary-setup');


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

router.post('/uploadFile', uploader.single("imageUrl"), (req, res, next) => {

  if (!req.file) {
    next(new Error('No file uploaded!'));
    return;
  }
  res.json({ secure_url: req.file.path})
})

router.post('/myBooks', (req, res, next) => {
  const {title, imageUrl, owner} = req.body

  Book.create({ title, imageUrl, owner })
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
