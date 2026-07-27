const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

// CAREERBRIDGE DOCS ROUTES START
const DOCS_DIR = path.join(__dirname, "..", "documentation", "Docs");

app.get("/docs", (req, res) => {
  try {
    if (!fs.existsSync(DOCS_DIR)) {
      return res.json([]);
    }

    const files = fs
      .readdirSync(DOCS_DIR)
      .filter((file) => file.endsWith(".md"))
      .sort();

    res.json(files);
  } catch (error) {
    res.status(500).json({ message: "Documentation could not be loaded." });
  }
});

app.get("/docs/:filename", (req, res) => {
  try {
    const filename = path.basename(req.params.filename);
    const filePath = path.join(DOCS_DIR, filename);

    if (!filename.endsWith(".md") || !fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Documentation file not found." });
    }

    res.type("text/plain").send(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    res.status(500).json({ message: "Documentation file could not be loaded." });
  }
});
// CAREERBRIDGE DOCS ROUTES END

app.use(cors());
app.use(express.json());

const dataFile = path.join(__dirname, "local-db.json");

const defaultData = {
  users: [
    {
      _id: "user-admin",
      name: "System Admin",
      email: "admin@test.de",
      password: "Admin2026!Test",
      role: "admin"
    },
    {
      _id: "user-hania",
      name: "Hania Alilat",
      email: "hania@test.com",
      password: "Hania2026!Test",
      role: "user"
    },
    {
      _id: "user-rania",
      name: "Rania Abdelaal",
      email: "rania@test.com",
      password: "Rania2026!Test",
      role: "user"
    },
    {
      _id: "user-aly",
      name: "Aly Elatrby",
      email: "aly@test.com",
      password: "Aly2026!Test",
      role: "user"
    }
  ],
  skills: [
    { _id: "skill-1", userId: "user-hania", name: "Vue.js", category: "Frontend" },
    { _id: "skill-2", userId: "user-rania", name: "Git & GitHub", category: "Tools" }
  ],
  projects: [
    {
      _id: "project-1",
      userId: "user-hania",
      title: "CareerBridge",
      description: "Student career platform for skills, projects, certificates and resume management.",
      github: "https://github.com/Raniaelsayed12/CareerBridge",
      status: "In Progress"
    },
    {
      _id: "project-2",
      userId: "user-aly",
      title: "Personal Portfolio",
      description: "Portfolio page for student projects and skills.",
      github: "https://github.com/haniaalo",
      status: "Planned"
    }
  ],
  certificates: [
    {
      _id: "certificate-1",
      userId: "user-hania",
      name: "Vue Basics",
      provider: "Westfälische Hochschule",
      date: "2026-07-25",
      link: ""
    },
    {
      _id: "certificate-2",
      userId: "user-rania",
      name: "GitHub Workflow",
      provider: "GitHub Skills",
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
  data.applications = data.applications || [];
  data.goals = data.goals || [];

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
  res.json({ message: "CareerBridge backend is running", database: "local JSON" });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "CareerBridge backend is running" });
});

/* AUTH */
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = db.users.find(
    (item) =>
      item.email.toLowerCase() === String(email).toLowerCase().trim() &&
      item.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  res.json({ message: "Login successful", user });
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const exists = db.users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );

  if (exists) {
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

  res.status(201).json({ message: "User registered successfully.", user });
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

  const exists = db.users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );

  if (exists) {
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

app.put("/users/:id", (req, res) => {
  const user = db.users.find((item) => item._id === req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;

  if (req.body.role) {
    user.role = req.body.role;
  }

  user.city = req.body.city ?? user.city ?? "";
  user.professionalRole = req.body.professionalRole ?? user.professionalRole ?? "";
  user.university = req.body.university ?? user.university ?? "";
  user.bio = req.body.bio ?? user.bio ?? "";
  user.github = req.body.github ?? user.github ?? "";

  if (req.body.password) {
    user.password = req.body.password;
  }

  saveData(db);
  res.json(user);
});

app.delete("/users/:id", (req, res) => {
  const user = db.users.find((item) => item._id === req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  if (user.email === "admin@test.de") {
    return res.status(400).json({ message: "Admin account cannot be deleted." });
  }

  db.users = db.users.filter((item) => item._id !== req.params.id);
  db.skills = db.skills.filter((item) => item.userId !== req.params.id);
  db.projects = db.projects.filter((item) => item.userId !== req.params.id);
  db.certificates = db.certificates.filter((item) => item.userId !== req.params.id);

  saveData(db);
  res.json({ message: "User and related data deleted successfully." });
});

/* SKILLS */
app.get("/skills", (req, res) => {
  const { userId } = req.query;
  res.json(userId ? db.skills.filter((item) => item.userId === userId) : db.skills);
});

app.post("/skills", (req, res) => {
  const { userId, name, category } = req.body;

  if (!userId || !name) {
    return res.status(400).json({ message: "User and skill name are required." });
  }

  const skill = {
    _id: createId("skill"),
    userId,
    name,
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

  skill.userId = req.body.userId || skill.userId;
  skill.name = req.body.name || skill.name;
  skill.category = req.body.category || skill.category;

  saveData(db);
  res.json(skill);
});

app.delete("/skills/:id", (req, res) => {
  db.skills = db.skills.filter((item) => item._id !== req.params.id);
  saveData(db);
  res.json({ message: "Skill deleted successfully." });
});

/* PROJECTS */
app.get("/projects", (req, res) => {
  const { userId } = req.query;
  res.json(userId ? db.projects.filter((item) => item.userId === userId) : db.projects);
});

app.post("/projects", (req, res) => {
  const { userId, title, description, github, status } = req.body;

  if (!userId || !title) {
    return res.status(400).json({ message: "User and project title are required." });
  }

  const project = {
    _id: createId("project"),
    userId,
    title,
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

  project.userId = req.body.userId || project.userId;
  project.title = req.body.title || project.title;
  project.description = req.body.description || project.description;
  project.github = req.body.github || project.github;
  project.status = req.body.status || project.status;

  saveData(db);
  res.json(project);
});

app.delete("/projects/:id", (req, res) => {
  db.projects = db.projects.filter((item) => item._id !== req.params.id);
  saveData(db);
  res.json({ message: "Project deleted successfully." });
});

/* CERTIFICATES */
app.get("/certificates", (req, res) => {
  const { userId } = req.query;
  res.json(userId ? db.certificates.filter((item) => item.userId === userId) : db.certificates);
});

app.post("/certificates", (req, res) => {
  const { userId, name, provider, date, link } = req.body;

  if (!userId || !name) {
    return res.status(400).json({ message: "User and certificate name are required." });
  }

  const certificate = {
    _id: createId("certificate"),
    userId,
    name,
    provider: provider || "",
    date: date || "",
    link: link || ""
  };

  db.certificates.push(certificate);
  saveData(db);

  res.status(201).json(certificate);
});

app.put("/certificates/:id", (req, res) => {
  const certificate = db.certificates.find((item) => item._id === req.params.id);

  if (!certificate) {
    return res.status(404).json({ message: "Certificate not found." });
  }

  certificate.userId = req.body.userId || certificate.userId;
  certificate.name = req.body.name || certificate.name;
  certificate.provider = req.body.provider || certificate.provider;
  certificate.date = req.body.date || certificate.date;
  certificate.link = req.body.link || certificate.link;

  saveData(db);
  res.json(certificate);
});

app.delete("/certificates/:id", (req, res) => {
  db.certificates = db.certificates.filter((item) => item._id !== req.params.id);
  saveData(db);
  res.json({ message: "Certificate deleted successfully." });
});


/* APPLICATIONS */
app.get("/applications", (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.json(db.applications || []);
  }

  res.json((db.applications || []).filter((item) => item.userId === userId));
});

app.post("/applications", (req, res) => {
  const { userId, company, position, status, date, link, notes } = req.body;

  if (!userId || !company || !position) {
    return res.status(400).json({ message: "User, company and position are required." });
  }

  const application = {
    _id: createId("application"),
    userId,
    company,
    position,
    status: status || "Applied",
    date: date || "",
    link: link || "",
    notes: notes || ""
  };

  db.applications = db.applications || [];
  db.applications.push(application);
  saveData(db);

  res.status(201).json(application);
});

app.put("/applications/:id", (req, res) => {
  db.applications = db.applications || [];

  const application = db.applications.find((item) => item._id === req.params.id);

  if (!application) {
    return res.status(404).json({ message: "Application not found." });
  }

  application.company = req.body.company ?? application.company;
  application.position = req.body.position ?? application.position;
  application.status = req.body.status ?? application.status;
  application.date = req.body.date ?? application.date;
  application.link = req.body.link ?? application.link;
  application.notes = req.body.notes ?? application.notes;

  saveData(db);
  res.json(application);
});

app.delete("/applications/:id", (req, res) => {
  db.applications = db.applications || [];

  const before = db.applications.length;
  db.applications = db.applications.filter((item) => item._id !== req.params.id);

  if (db.applications.length === before) {
    return res.status(404).json({ message: "Application not found." });
  }

  saveData(db);
  res.json({ message: "Application deleted successfully." });
});



/* GOALS */
app.get("/goals", (req, res) => {
  const { userId } = req.query;
  const items = db.goals || [];
  res.json(userId ? items.filter((item) => item.userId === userId) : items);
});

app.post("/goals", (req, res) => {
  const { userId, title, description, deadline, status } = req.body;

  if (!userId || !title) {
    return res.status(400).json({ message: "User and title are required." });
  }

  const goal = {
    _id: createId("goal"),
    userId,
    title,
    description: description || "",
    deadline: deadline || "",
    status: status || "Planned"
  };

  db.goals = db.goals || [];
  db.goals.push(goal);
  saveData(db);

  res.status(201).json(goal);
});

app.put("/goals/:id", (req, res) => {
  db.goals = db.goals || [];
  const goal = db.goals.find((item) => item._id === req.params.id);

  if (!goal) {
    return res.status(404).json({ message: "Goal not found." });
  }

  goal.title = req.body.title ?? goal.title;
  goal.description = req.body.description ?? goal.description;
  goal.deadline = req.body.deadline ?? goal.deadline;
  goal.status = req.body.status ?? goal.status;

  saveData(db);
  res.json(goal);
});

app.delete("/goals/:id", (req, res) => {
  db.goals = db.goals || [];
  const before = db.goals.length;
  db.goals = db.goals.filter((item) => item._id !== req.params.id);

  if (db.goals.length === before) {
    return res.status(404).json({ message: "Goal not found." });
  }

  saveData(db);
  res.json({ message: "Goal deleted successfully." });
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`CareerBridge local backend running on port ${PORT}`);
});
