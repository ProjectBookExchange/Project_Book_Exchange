const express = require('express');
const User = require('../models/User');
const Book = require('../models/Book');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.send('Home')
});

// router.post('/leidos', (req, res)=>{
//   User.findByIdAndUpdate(req.body.userID, {$push: {leidos: req.body.mangaID}})
//   .then((result)=>{
//     console.log(result)
//   })
//   .catch((err)=>{
//     console.log(err)
//   })
// })

// router.post('/leyendo', (req, res)=>{
//   User.findByIdAndUpdate(req.body.userID, {$push: {leyendo: req.body.mangaID}})
//   .then((result)=>{
//     console.log(result)
//   })
//   .catch((err)=>{
//     console.log(err)
//   })
// })

// router.post('/porLeer', (req, res)=>{
//   User.findByIdAndUpdate(req.body.userID, {$push: {porLeer: req.body.mangaID}})
//   .then((result)=>{
//     console.log(result)
//   })
//   .catch((err)=>{
//     console.log(err)
//   })
// })

router.get('/getUser/:id', (req, res)=>{

  User.findById(req.params.id)
  .then((result)=>{
    res.send(result)
  })
  .catch((err)=>{
    console.log(err)
  })
})

// router.get('/myBooks', (req, res) => {
//   const userId = req.user._id
//   const user = req.user

//   User.findOne({_id: userId})
//     .populate('myBooks')
//     .then((result)=>{
//       res.render('auth/myList', {boardgame_id: result.boardgame_id, user})
//     })
//     .catch((err)=>console.log(err))
// })

router.post('/myBooks', (req, res) => {
  const {title, image, owner} = req.body

  Book.create({title, image, owner})
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
  .then((result)=>{
    res.send(result)
  })
  .catch((err)=>console.log(err))
})

module.exports = router;
