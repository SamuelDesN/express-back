const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();

// Configuración de variables globales
let usuario = "";
let usuarioid = "";
let usuarios = [];
let id = 0;

// Importa middlewares y routers
const middlewares = require('./middlewares');  // Asegúrate de que la ruta sea correcta

// Crea una instancia de la aplicación Express
const app = express();

// Usa los middlewares básicos
app.use(morgan('dev'));      // Logger para las solicitudes HTTP
app.use(helmet());           // Protege la aplicación con headers HTTP
app.use(cors());             // Habilita CORS (Cross-Origin Resource Sharing)
app.use(express.json());     // Permite recibir JSON en el cuerpo de la solicitud

// Conexión con MongoDB
const uri = "mongodb+srv://Admin:Abc123.@cluster0.4ruo4.mongodb.net/";
const client = new MongoClient(uri);

// Función para interactuar con la base de datos
async function run(tipo) {
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
    } catch (err) {
        console.log("Error al interactuar con la base de datos:", err);
    }
}

// Rutas
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

// Ruta para agregar un nuevo usuario (requiere body con datos del usuario)
app.post("/api/users", (req, res) => {
    const user = req.body;
    // Aquí puedes agregar lógica para guardar en MongoDB
    res.json(user);  // Retorna el usuario agregado
});

// Middlewares personalizados para manejar errores
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

// Exporta la aplicación para su uso en el archivo index.js
module.exports = app;
