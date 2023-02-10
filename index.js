const e = require("express");
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();

// localhost ou 127.0.0.1
//const DB_URL = "mongodb://127.0.0.1:27017"; //url local
const DB_URL = "mongodb+srv://admin:ohisAxDlbjhRSkHq@cluster0.rtmyudv.mongodb.net";
const DB_NAME = "ocean-bancodados-09-02-2023";

async function main() {
    // Conexão com o banco de dados
    console.log("Conectando com o banco de dados...")
    const client = await MongoClient.connect(DB_URL)
    console.log("Banco de dados conectado com sucesso!")
    const db = client.db(DB_NAME);
    const collection = db.collection("itens")

    // O que vier no body da requisução, está em JSON
    app.use(express.json());

    // Endpoint / -> Hello Word
    app.get("/", function (req, res) {
        res.send("Hello Word!!");
    });

    // Endpoint /oi -> Ola Mundo
    app.get("/oi", function (req, res) {
        res.send("Ola Mundo!!");
    });

    // Lista de informações
    const itens = ["Rick Sanches", "Morty Smith", "Summer Smith"]
    //              0               1               2

    // CRUD -> lista de informações

    //Endpoint Read All -> [GET] / item
    app.get("/item", async function (req, res) {
        // res.send(itens); // Express
        const documentos = await collection.find().toArray();
        res.send(documentos);
    });

    //Endpoint Read Single by ID -> [GET] / item/:id
    app.get("/item/:id", async function (req, res) {
        const id = req.params.id;
        //const item = itens[id - 1]; Express local
        const item = await collection.findOne({ _id: new ObjectId(id) });
        res.send(item);
    });

    //Endpoint Create -> [POST] / item/
    app.post("/item", async function (req, res) {
        //console.log(req.body);
        const item = req.body;
        //itens.push(item.nome);
        await collection.insertOne(item)
        //res.send("Item criado com sucesso");
        res.send(item);
    });

    //Endpoint Update -> [PUT] / item/:id
    app.put("/item/:id", async function (req, res) {
        const id = req.params.id;
        const body = req.body;

        //console.log(id, body);
        await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: body }
        );

        res.send(body);
    });

    app.listen(3000);
}

main();