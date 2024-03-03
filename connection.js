const mongoose = require('mongoose')
require('dotenv').config()

const bd= async ()=> {
    await mongoose.connect(process.env.URI)
}


try{
    bd()
    mongoose.connection.once('open', ()=> 
    console.log('Conexion Exitosa!!')
    )

}catch(e){
    mongoose.connection.once('error', ()=> 
    console.log('Conexion Fallida!!')
    )
}

module.exports = bd