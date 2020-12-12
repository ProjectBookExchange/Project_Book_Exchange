const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Book = require('../models/Book');
const Exchange = require('../models/Exchange');

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
  res.json({ secure_url: req.file.path })
})

router.post('/myBooks', (req, res, next) => {
  const { title, imageUrl, owner, author, owner_name, owner_city } = req.body

  Book.create({ title, imageUrl, owner, author, owner_name, owner_city, borrowedUser: '' })
    .then((createdBook) => {
      User.findByIdAndUpdate(owner, { $push: { myBooks: createdBook._id } })
        .then((result) => res.send(result))
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

router.post('/showSearchedBooks', (req, res, next) => {
  const { city, title } = req.body

  if (title && city) {
    Book.find({ $and: [{ owner_city: city }, { title: title }] })
      .then((result) => {
        res.send(result)
      })
      .catch((err) => console.log(err))
  }

  else if (!city && title) {
    Book.find({ title: title })
      .then((result) => {
        res.send(result)
      })
      .catch((err) => console.log(err))
  }

  else if (!title && city) {
    Book.find({ owner_city: city })
      .then((result) => {
        res.send(result)
      })
      .catch((err) => console.log(err))
  } else {
    Book.find()
      .then((result) => {
        res.send(result)
      })
      .catch((err) => console.log(err))
  }
})

router.post('/publicProfile/:id', (req, res) => {
  const userID = req.params.id

  User.findById(userID)
    .populate('myBooks')
    .populate('wishList')
    .then((result) => {
      res.send(result)
    })
    .catch((err) => console.log(err))
})

router.post('/addWish', (req, res) => {
  const interestedUserID = req.body.userID
  const interestedUserName = req.body.userName
  const bookToAdd = req.body.book

User.findById(interestedUserID)
.then((userData)=> {
  if (userData.wishList.includes(req.body.book._id)){
    res.json({ message: `it's already on your list!`})
  } else {
    User.findByIdAndUpdate({ _id: interestedUserID }, { $push: { wishList: bookToAdd._id } })
    .then(() => {
      Book.findByIdAndUpdate({ _id: bookToAdd._id }, { $push: { interestedUsers: { interestedUserName: interestedUserName, interestedUserID: interestedUserID } } })
        .then((result) => {
          res.send(result)
        })
    })
    
  }
})
.catch((err) => console.log(err))

})

router.post('/viewWishes', (req, res) => {
  const userID = req.body.userID
  User.findById(userID)
    .populate('wishList')
    .then((result) => {
      res.send(result.wishList)
    })
    .catch((err) => console.log(err))

})

router.post('/moveBorrowed', (req, res) => {

  const exchangedBook = req.body.book
  const clientID = req.body.profile._id
  const clientUsername = req.body.profile.username
  const ownerID = req.body.book.owner
  const ownerName = req.body.book.owner_name

  Book.findByIdAndUpdate({ _id: req.body.book._id }, { borrowedUser: clientID })
    .then(() => {
      Exchange.create({ userPartner: clientUsername, borrowed: exchangedBook })
        .then((createdBorrowExchange) => {
          User.findByIdAndUpdate({ _id: ownerID }, { $push: { myExchanges: createdBorrowExchange._id } })
            .then(() => {
              Exchange.create({ userPartner: ownerName, acquired: exchangedBook })
                .then((createdAcquiredExchange) => {
                  User.findByIdAndUpdate({ _id: clientID }, { $push: { myExchanges: createdAcquiredExchange._id } }, {$pull: {wishList: req.body.book._id}})
                    .then((result) => result)
                })
            })
        })
    })

    .catch((err) => {
      console.log(err)
    })
})

router.post('/viewExchanges', (req, res) => {
  const userID = req.body.userID
  console.log(req.body)
  User.findById(userID)
    .populate('myExchanges')
    .then((result) => {
      res.send(result)
    })
    .catch((err) => console.log(err))

})

router.post('/removeMyBook', (req, res) => {
  const bookID = req.body.book._id

  Book.deleteOne({ _id: bookID })
    .then((result) => res.send(result))
    .catch((err) => console.log(err))
})

router.post('/removeMyWishBook', (req, res) => {
  const bookID = req.body.book._id
  const userID = req.body.userID

  Book.findById(bookID)
    .then((result) => {
      const newArr = []
      result.interestedUsers.forEach((user) => {
        if (user.interestedUserID != userID) {
          return newArr.push(user)
        }
      })

      Book.findByIdAndUpdate(bookID, { interestedUsers: newArr })
        .then(() => {

          User.findByIdAndUpdate(userID, { $pull: { wishList: bookID } })
            .then((result) => {
              res.send(result)
            })
        })
    })
    .catch((err) => console.log(err))
})


module.exports = router;
