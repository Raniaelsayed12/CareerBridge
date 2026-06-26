console.log("HELLO");

const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

console.log("URI =", process.env.MONGO_URI);
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
    const projectsCollection = db.collection("projects");
    const certificatesCollection = db.collection("certificates");

    app.get("/", (req, res) => {
      res.send("CareerBridge Backend Working");
    });

    app.get("/test-db", async (req, res) => {
      const collections = await db.listCollections().toArray();
      res.json(collections);
    });

    // =========================
    // SKILLS
    // =========================

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

    // =========================
    // PROJECTS
    // =========================

    app.get("/projects", async (req, res) => {
      const projects = await projectsCollection.find().toArray();
      res.json(projects);
    });

    app.post("/projects", async (req, res) => {
      const result = await projectsCollection.insertOne(req.body);
      res.json(result);
    });

    app.delete("/projects/:id", async (req, res) => {
      const result = await projectsCollection.deleteOne({
        _id: new ObjectId(req.params.id),
      });

      res.json(result);
    });



// =========================
// CERTIFICATES
// =========================

app.get("/certificates", async (req, res) => {
  const certificates = await certificatesCollection.find().toArray();
  res.json(certificates);
});

app.post("/certificates", async (req, res) => {
  const result = await certificatesCollection.insertOne(req.body);
  res.json(result);
});


app.put("/projects/:id", async (req, res) => {
  const result = await projectsCollection.updateOne(
    { _id: new ObjectId(req.params.id) },
    {
      $set: {
        title: req.body.title,
        description: req.body.description,
        github: req.body.github,
      },
    }
  );

  res.json(result);
});







app.delete("/certificates/:id", async (req, res) => {
  const result = await certificatesCollection.deleteOne({
    _id: new ObjectId(req.params.id),
  });

  res.json(result);
});

app.get("/hello", (req, res) => {
  res.send("HELLO PROJECT ROUTE");
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