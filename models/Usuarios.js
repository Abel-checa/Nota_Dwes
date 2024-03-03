const {Schema,model} = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken'); 
const bd = require('../connection.js')
const { token } = require('morgan')

const UserSchema = new Schema({
    nombre: String,
    password: String,
    cargo: String,
    email: String,
    token:String,
    favoritos: Array
})


const User = model('Usuarios',UserSchema)
// const admin = async ()=>{
    
//     const secure = await bcrypt.hash("admin",8)
//     const token = jwt.sign({
//         nombre: "admin",
//         rol: "admin"
//     },process.env.SECRET)
//     const admin = new User({
//         nombre: "admin",
//         password: secure,
//         email: "admin@admin.com",
//         token: token
//     })
//     await admin.save()
// }
// admin()

module.exports = {User: User}