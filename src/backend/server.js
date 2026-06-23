
console.log("HELLO");

const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

console.log("URI =", process.env.MONGO_URI);

const app = express();

app.use(cors());
app.use(express.json());

console.log("Trying MongoDB...");

const client = new MongoClient(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
});

async function startServer() {
  try {
    await client.connect();

    console.log("MongoDB Connected");

    const db = client.db("careerbridge");

    const skillsCollection = db.collection("skills");

    app.get("/", (req, res) => {
      res.send("CareerBridge Backend Working");
    });

    app.get("/test-db", async (req, res) => {
      const collections = await db.listCollections().toArray();
      res.json(collections);
    });

    app.get("/skills", async (req, res) => {
      const skills = await skillsCollection.find().toArray();
      res.json(skills);
    });

    app.post("/skills", async (req, res) => {
      const result = await skillsCollection.insertOne(req.body);
      res.json(result);
    });

    app.delete("/skills/:id", async (req, res) => {
      const result = await skillsCollection.deleteOne({
        _id: new ObjectId(req.params.id),
      });

      res.json(result);
    });

    app.listen(3000, () => {
      console.log("Server Running On Port 3000");
    });

  } catch (error) {
    console.log("ERROR:");
    console.log(error);
  }
}

startServer();