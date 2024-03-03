const {Schema,model} = require('mongoose')

const bd = require('../connection.js')

const ProductSchema = new Schema({
    nombre: String,
    precio: Number,
    imagen: String
}) 

const Product = model('productos',ProductSchema)
// const pre_pr = async ()=>{
//     const new_product = new Product({
//         nombre: "Alfombrilla gaming",
//         precio: 300,
//         imagen: "https://img.freepik.com/foto-gratis/teclado-azul-blanco-alto-angulo_23-2149680245.jpg?w=1380&t=st=1709494435~exp=1709495035~hmac=1ca0202ec97bef76aa9e68fa1eba4b20b660b12efbe9edcbfd8fd83c87db7b9d"
//     })
//     await new_product.save()
// } 

// pre_pr()
module.exports = {Product: Product}