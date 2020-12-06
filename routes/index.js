const express = require('express');
const User = require('../models/User');
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

/* GET: Ver todos los mangas */

/* GET: Página principal (profile page) donde podré ver los tres grupos */

/* GET: Ver mis mangas leidos */

/* GET: Ver los mangas que estoy leyendo */

/* GET: Ver mis mangas por leer */

/* GET: Página independiente de cada manga */

/* GET: Ver todos los usuarios */
router.get('/all-users', (req, res)=>{
  User.find({})
  .then((result)=>{
    res.send(result)
  })
  .catch((err)=>{
    res.send(err)
  })
})

/* POST: Añadir manga a Leidos */

/* POST: Añadir manga a Leyendo */

/* POST: Añadir manga a Por leer */

/* POST: Crear un manga nuevo */

/* PUT: Editar usuario */

/* PUT: Editar Leidos */

/* PUT: Editar Leyendo */

/* PUT: Editar Por Leer */

/* DELETE: Eliminar usuario */

/* DELETE: Eliminar manga */



module.exports = router;
