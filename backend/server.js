const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

const dataFile = path.join(__dirname, "local-db.json");

const defaultData = {
  users: [
    {
      _id: "user-1",
      name: "Hania Alilat",
      email: "hania@test.com",
      password: "123456",
      role: "admin"
    }
  ],
  skills: [
    { _id: "skill-1", name: "Vue.js", category: "Frontend" },
    { _id: "skill-2", name: "JavaScript", category: "Programming" }
  ],
  projects: [
    {
      _id: "project-1",
      title: "CareerBridge",
      description: "Student career platform",
      github: "https://github.com/Raniaelsayed12/CareerBridge",
      status: "In Progress"
    }
  ],
  certificates: [
    {
      _id: "certificate-1",
      name: "Vue Basics",
      provider: "University Project",
      date: "2026-07-25",
      link: ""
    }
  ]
};

function loadData() {
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify(defaultData, null, 2));
  }

  const data = JSON.parse(fs.readFileSync(dataFile, "utf-8"));

  data.users = data.users || [];
  data.skills = data.skills || [];
  data.projects = data.projects || [];
  data.certificates = data.certificates || [];

  return data;
}

function saveData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

let db = loadData();

app.get("/", (req, res) => {
  res.json({
    message: "CareerBridge backend is running",
    database: "local JSON"
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "CareerBridge backend is running",
    database: "local JSON",
    time: new Date().toISOString()
  });
});

/* USERS */
app.get("/users", (req, res) => {
  res.json(db.users);
});

app.post("/users", (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required." });
  }

  const existingUser = db.users.find((user) => user.email === email);

  if (existingUser) {
    return res.status(400).json({ message: "Email already exists." });
  }

  const user = {
    _id: createId("user"),
    name,
    email,
    password,
    role: role || "user"
  };

  db.users.push(user);
  saveData(db);

  res.status(201).json(user);
});

app.delete("/users/:id", (req, res) => {
  const user = db.users.find((item) => item._id === req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  db.users = db.users.filter((item) => item._id !== req.params.id);
  saveData(db);

  res.json({ message: "User deleted successfully." });
});

/* AUTH */
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const existingUser = db.users.find((user) => user.email === email);

  if (existingUser) {
    return res.status(400).json({ message: "Email already exists." });
  }

  const user = {
    _id: createId("user"),
    name,
    email,
    password,
    role: "user"
  };

  db.users.push(user);
  saveData(db);

  res.status(201).json({
    message: "User registered successfully.",
    user
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = db.users.find(
    (item) => item.email === email && item.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  res.json({
    message: "Login successful",
    user
  });
});

/* SKILLS */
app.get("/skills", (req, res) => {
  res.json(db.skills);
});

app.post("/skills", (req, res) => {
  const { name, category } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Skill name is required." });
  }

  const skill = {
    _id: createId("skill"),
    name: name.trim(),
    category: category || "General"
  };

  db.skills.push(skill);
  saveData(db);

  res.status(201).json(skill);
});

app.put("/skills/:id", (req, res) => {
  const skill = db.skills.find((item) => item._id === req.params.id);

  if (!skill) {
    return res.status(404).json({ message: "Skill not found." });
  }

  skill.name = req.body.name || skill.name;
  skill.category = req.body.category || skill.category;

  saveData(db);

  res.json(skill);
});

app.delete("/skills/:id", (req, res) => {
  const skill = db.skills.find((item) => item._id === req.params.id);

  if (!skill) {
    return res.status(404).json({ message: "Skill not found." });
  }

  db.skills = db.skills.filter((item) => item._id !== req.params.id);
  saveData(db);

  res.json({ message: "Skill deleted successfully." });
});

/* PROJECTS */
app.get("/projects", (req, res) => {
  res.json(db.projects);
});

app.post("/projects", (req, res) => {
  const { title, description, github, status } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ message: "Project title is required." });
  }

  const project = {
    _id: createId("project"),
    title: title.trim(),
    description: description || "",
    github: github || "",
    status: status || "Planned"
  };

  db.projects.push(project);
  saveData(db);

  res.status(201).json(project);
});

app.put("/projects/:id", (req, res) => {
  const project = db.projects.find((item) => item._id === req.params.id);

  if (!project) {
    return res.status(404).json({ message: "Project not found." });
  }

  project.title = req.body.title || project.title;
  project.description = req.body.description || project.description;
  project.github = req.body.github || project.github;
  project.status = req.body.status || project.status;

  saveData(db);

  res.json(project);
});

app.delete("/projects/:id", (req, res) => {
  const project = db.projects.find((item) => item._id === req.params.id);

  if (!project) {
    return res.status(404).json({ message: "Project not found." });
  }

  db.projects = db.projects.filter((item) => item._id !== req.params.id);
  saveData(db);

  res.json({ message: "Project deleted successfully." });
});

/* CERTIFICATES */
app.get("/certificates", (req, res) => {
  res.json(db.certificates);
});

app.post("/certificates", (req, res) => {
  const { name, provider, date, link } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Certificate name is required." });
  }

  const certificate = {
    _id: createId("certificate"),
    name: name.trim(),
    provider: provider || "",
    date: date || "",
    link: link || ""
  };

  db.certificates.push(certificate);
  saveData(db);

  res.status(201).json(certificate);
});

app.put("/certificates/:id", (req, res) => {
  const certificate = db.certificates.find(
    (item) => item._id === req.params.id
  );

  if (!certificate) {
    return res.status(404).json({ message: "Certificate not found." });
  }

  certificate.name = req.body.name || certificate.name;
  certificate.provider = req.body.provider || certificate.provider;
  certificate.date = req.body.date || certificate.date;
  certificate.link = req.body.link || certificate.link;

  saveData(db);

  res.json(certificate);
});

app.delete("/certificates/:id", (req, res) => {
  const certificate = db.certificates.find(
    (item) => item._id === req.params.id
  );

  if (!certificate) {
    return res.status(404).json({ message: "Certificate not found." });
  }

  db.certificates = db.certificates.filter(
    (item) => item._id !== req.params.id
  );

  saveData(db);

  res.json({ message: "Certificate deleted successfully." });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`CareerBridge local backend running on port ${PORT}`);
});
