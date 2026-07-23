const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

const dataFile = path.join(__dirname, "local-db.json");

const defaultData = {
  skills: [
    { _id: "skill-1", name: "Vue.js" },
    { _id: "skill-2", name: "JavaScript" },
    { _id: "skill-3", name: "Git & GitHub" }
  ],

  projects: [
    {
      _id: "project-1",
      title: "CareerBridge",
      description: "A platform for students to organize skills, projects and certificates.",
      github: "https://github.com/Raniaelsayed12/CareerBridge"
    }
  ],

  certificates: [
    {
      _id: "certificate-1",
      name: "Vue Basics",
      provider: "University Project"
    }
  ],

  users: [
    {
      _id: "user-1",
      name: "Hania Alilat",
      email: "hania.alilat@studmail.w-hs.de",
      password: "123456"
    }
  ]
};

function loadData() {
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify(defaultData, null, 2));
  }

  return JSON.parse(fs.readFileSync(dataFile, "utf-8"));
}

function saveData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

let db = loadData();

app.get("/", (req, res) => {
  res.send("CareerBridge Local Backend Working");
});

app.get("/test-db", (req, res) => {
  res.json({
    message: "Local JSON database is working",
    collections: Object.keys(db)
  });
});

// SKILLS
app.get("/skills", (req, res) => {
  res.json(db.skills);
});

app.post("/skills", (req, res) => {
  const newSkill = {
    _id: createId("skill"),
    name: req.body.name
  };

  db.skills.push(newSkill);
  saveData(db);

  res.json(newSkill);
});

app.put("/skills/:id", (req, res) => {
  const skill = db.skills.find((item) => item._id === req.params.id);

  if (!skill) {
    return res.status(404).json({ message: "Skill not found" });
  }

  skill.name = req.body.name;
  saveData(db);

  res.json(skill);
});

app.delete("/skills/:id", (req, res) => {
  db.skills = db.skills.filter((item) => item._id !== req.params.id);
  saveData(db);

  res.json({ message: "Skill deleted" });
});

// PROJECTS
app.get("/projects", (req, res) => {
  res.json(db.projects);
});

app.post("/projects", (req, res) => {
  const newProject = {
    _id: createId("project"),
    title: req.body.title,
    description: req.body.description,
    github: req.body.github
  };

  db.projects.push(newProject);
  saveData(db);

  res.json(newProject);
});

app.put("/projects/:id", (req, res) => {
  const project = db.projects.find((item) => item._id === req.params.id);

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  project.title = req.body.title;
  project.description = req.body.description;
  project.github = req.body.github;
  saveData(db);

  res.json(project);
});

app.delete("/projects/:id", (req, res) => {
  db.projects = db.projects.filter((item) => item._id !== req.params.id);
  saveData(db);

  res.json({ message: "Project deleted" });
});

// CERTIFICATES
app.get("/certificates", (req, res) => {
  res.json(db.certificates);
});

app.post("/certificates", (req, res) => {
  const newCertificate = {
    _id: createId("certificate"),
    name: req.body.name,
    provider: req.body.provider
  };

  db.certificates.push(newCertificate);
  saveData(db);

  res.json(newCertificate);
});

app.put("/certificates/:id", (req, res) => {
  const certificate = db.certificates.find((item) => item._id === req.params.id);

  if (!certificate) {
    return res.status(404).json({ message: "Certificate not found" });
  }

  certificate.name = req.body.name;
  certificate.provider = req.body.provider;
  saveData(db);

  res.json(certificate);
});

app.delete("/certificates/:id", (req, res) => {
  db.certificates = db.certificates.filter((item) => item._id !== req.params.id);
  saveData(db);

  res.json({ message: "Certificate deleted" });
});

// USERS
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingUser = db.users.find((user) => user.email === email);

  if (existingUser) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const newUser = {
    _id: createId("user"),
    name,
    email,
    password
  };

  db.users.push(newUser);
  saveData(db);

  res.status(201).json({ message: "User registered successfully" });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = db.users.find(
    (item) => item.email === email && item.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.json({
    message: "Login successful",
    user
  });
});

app.get("/users", (req, res) => {
  res.json(db.users);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`CareerBridge local backend running on port ${PORT}`);
});
