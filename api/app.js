const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();


let usuario = "";
let usuarioid = "";
let usuarios = [];
let usuarionuevo=""
let id = 0;


const middlewares = require('./middlewares');  

const app = express();

app.use(morgan('dev'));      
app.use(helmet());           
app.use(cors());             
app.use(express.json());     


const uri = "mongodb+srv://Admin:Abc123.@cluster0.4ruo4.mongodb.net/";
const client = new MongoClient(uri);

async function run(tipo,usuarionuevo) {
    try {
        await client.connect();
        const db = client.db('express');
        const collection = db.collection('usuarios');
        
        if (tipo === "user1") {
            const datos = await collection.findOne();
            return usuario = datos;
        }
        
        if (tipo === "usuarios") {
            const result = await collection.find().toArray();
            return usuarios = result;
        }
        
        if (tipo === "id") {
            const datos = await collection.find({ id: id }).toArray();
            for (let i = 0; i < datos.length; i++) {
                if (datos[i].id == id) {
                    usuarioid = datos[i];
                }
            }
        }
        if (tipo === "agregar") {
          
          await collection.insertOne(usuarionuevo);
      }
    } catch (err) {
        console.log("Error al interactuar con la base de datos:", err);
    }
}

app.get("/", (req, res) => {
    res.json({
        message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
    });
});

app.get("/api/users/user1", async (req, res) => {
    await run("user1");
    res.json(usuario);
});

app.get("/api/users", async (req, res) => {
    await run("usuarios");
    res.json(usuarios);
});

app.get("/api/users/:id", async (req, res) => {
    id = req.params.id;
    await run("id");
    res.json(usuarioid);
});

app.post("/api/users", async (req, res) => {
  usuarionuevo = req.body;
  try {
      await run("agregar");  // Agregar a la base de datos
      res.status(201).json({ message: "Nuevo usuario a agregar:", usuarionuevo });
  } catch (err) {
      console.error("Error al agregar el usuario:", err);
      res.status(500).json({ message: "Error al agregar el usuario", error: err });
  }
});


app.use(middlewares.notFound);
app.use(middlewares.errorHandler);


module.exports = app;
