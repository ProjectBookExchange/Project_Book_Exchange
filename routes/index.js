const express = require('express');
const User = require('../models/User');
const Book = require('../models/Book');
const uploadCloud = require('../config/cloudinary.js');
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

router.post('/myBooks', uploadCloud.single('image_path'), (req, res) => {
  const { title, owner } = req.body
  const image_name = req.file ? req.file.originalname : "bookDefault.jpg"
  const image_path = req.file ? req.file.path : "/images/bookDefault.jpg"

  Book.create({ title, image_name, image_path, owner })
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
