const express = require('express');
const router = express.Router();
const {Product} = require('../models/Productos.js') 
const {User} = require('../models/Usuarios.js') 

const {body,validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken'); 

require('../connection.js')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('landing')
});

router.get('/login',(req,res)=>{
  if(req.session.logged){
    res.redirect('/user/'+req.session.token)
  }else{
    res.render('login')
  }
  
})

router.post('/login',[
  body('nombre','No se ha introducido correctamente el nombre').exists().isLength({min: 3}),
  body('password','No se ha introducido una contraseña correcta').exists().isLength({min: 3})
],async (req,res)=>{
  const errors = validationResult(req)
  const valores = req.body
  if(!errors.isEmpty()){
    res.render('login',{valores:valores,errores: errors.errors})
  }else{
    const userFound = await User.findOne({nombre: req.body.nombre})
    console.log('Encontrado:',userFound);
    if(userFound){
      const verificacion = bcrypt.compare(userFound.password,req.body.password)
      if(verificacion){
        req.session.logged = true
        req.session.token = userFound.token
        req.session.user = userFound.nombre
        res.redirect('/user/'+userFound.token)
      }else{
        res.redirect('/register')
      }
    }else{
      res.redirect('/register')
    }
  }
})


router.get('/register',(req,res)=>{
  res.render('register')
})

router.post('/register',[
  body('nombre','No se ha introducido correctamente el nombre').exists().isLength({min: 3}),
  body('password','No se ha introducido una contraseña correcta').exists().isLength({min: 3}),
  body('email','No se ha introducido un email').exists().isEmail(),
],async (req,res)=>{
  const errors = validationResult(req)
  const valores = req.body
  if(!errors.isEmpty()){
    res.render('register',{valores:valores,errores: errors.errors})
  }else{
    const secure =await bcrypt.hash(req.body.password,8)
    const token = jwt.sign({
      nombre: req.body.nombre,
      rol: "cliente"
    },process.env.SECRET)

    const new_user = new User({
      nombre: req.body.nombre,
      password: secure,
      email: req.body.email,
      token: token,
      
    })

    await new_user.save()
    res.redirect('/login')
  }
  }
)

router.get('/user/:token',async (req,res)=>{
  console.log(req.session);
  if(jwt.verify(req.params.token,process.env.SECRET)){
    const {nombre,rol} = jwt.verify(req.params.token,process.env.SECRET)
    if(rol == "admin"){
      const products =await Product.find()
      const users = await User.find()
      res.render('user_inicio',{cargo: rol,nombre: nombre,productos: products, usuarios: users})
    }else{
      const userFound = await User.findOne({nombre: req.session.user})
      console.log(userFound);
      const favs = userFound.favoritos
      res.render('user_inicio',{cargo: rol,nombre: nombre,favoritos: favs,large: favs.length})
    }
   
  }else{
    res.sendStatus(403)
  }
})

router.get('/destroy',(req,res)=>{
  req.session.destroy()
  res.redirect('/')
})

router.get('/add',async (req,res)=> {
  res.render("add")
})

router.post('/add',async (req,res)=> {
  const new_product = new Product({
    nombre: req.body.nombre,
    precio:  req.body.precio,
    imagen: req.body.imagen
  })
  await new_product.save()

  const userFound = await User.findOne({nombre: req.session.user})
  const favs = userFound.favoritos
  favs.push(new_product)
  const userUpdate = await User.findOneAndUpdate({nombre: req.session.user},{favoritos: favs})
  res.redirect('/user/'+req.session.token)
})


module.exports = router;
