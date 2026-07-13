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
    const usersCollection = db.collection("users");

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

    app.put("/skills/:id", async (req, res) => {
      const result = await skillsCollection.updateOne(
        { _id: new ObjectId(req.params.id) },
        {
          $set: {
            name: req.body.name,
          },
        }
      );

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
      const certificates =
        await certificatesCollection.find().toArray();

      res.json(certificates);
    });

    app.post("/certificates", async (req, res) => {
      const result =
        await certificatesCollection.insertOne(req.body);

      res.json(result);
    });

    app.put("/certificates/:id", async (req, res) => {
      const result = await certificatesCollection.updateOne(
        { _id: new ObjectId(req.params.id) },
        {
          $set: {
            name: req.body.name,
            provider: req.body.provider,
          },
        }
      );

      res.json(result);
    });

    app.delete("/certificates/:id", async (req, res) => {
      const result =
        await certificatesCollection.deleteOne({
          _id: new ObjectId(req.params.id),
        });

      res.json(result);
    });

    app.get("/hello", (req, res) => {
  res.send("HELLO PROJECT ROUTE");
});

// =========================
// USERS
// =========================

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await usersCollection.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const result = await usersCollection.insertOne({
      name,
      email,
      password,
    });

    res.status(201).json({
      message: "User registered successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await usersCollection.findOne({
      email,
      password,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    res.json({
      message: "Login successful",
      user,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

app.get("/users", async (req, res) => {
  const users = await usersCollection.find().toArray();
  res.json(users);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`);
});

  } catch (error) {
    console.log("ERROR:");
    console.log(error);
  }
}

startServer();