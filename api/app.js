const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const { MongoClient} = require('mongodb');
require('dotenv').config();
let usuario=""
let usuarioid=""
let usuarios=[]
let id=0
const middlewares = require('./middlewares');
const api = require('.');
const { parse } = require('dotenv');
const app = express();
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());
const uri = "mongodb+srv://Admin:Abc123.@cluster0.4ruo4.mongodb.net/";
const client = new MongoClient(uri);
async function run(tipo) {
  try {
    await client.connect();
    const db = client.db('express');
    const collection = db.collection('usuarios');
    if(tipo=="user1"){
      const datos=await collection.findOne()
      return usuario=datos
    }
    if(tipo=="usuarios"){
      const result=await collection.find().toArray()
      return usuarios=result
    }
    if(tipo=="id"){
      const datos=await collection.find({id:id}).toArray()
      for(i=0;i<datos.length;i++){
        if(datos[i]["id"]==id){
          usuarioid=datos[i]
        }
      }
    }
  }
  catch(err){
    console.log("Error")
  }
}
//const users=[
//  {id:1,nombre:"Juan",apellido:"Perez",telefono:"987654321"},
//  {id:2,nombre:"Maria",apellido:"Fernandez",telefono:"9708654321"},
//  {id:3,nombre:"Pedro",apellido:"Alvarez",telefono:"987654321"},
//  {id:4,nombre:"Marcos",apellido:"Silva",telefono:"987123654"}
//  ]
app.get('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});
app.get("/api/users/user1",(req,res)=>{
  run("user1")
  res.json(usuario)
})
app.get("/api/users",(req,res)=>{
  run("usuarios")
  res.json(usuarios)
})
app.get("/api/users/:id",(req,res)=>{
  id=req.params.id
  run("id")
  res.json(usuarioid)

  //const userId= parseInt(req.params.id,10)
  //const user = users.find((u)=>u.id==userId)
  //  if(user){
  //    res.json(user)
  //  }else{
  //    res.status(404).json({error:"Usuario no encontrado"})
  //  }
  })



  app.post("api/users",(req,res)=>{
    const user= req.body
    user.id=users.length+1
    users.push(user)
    res.json(user)
  })
app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
