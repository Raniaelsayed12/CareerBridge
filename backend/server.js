require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

const DOCS_DIR = path.join(__dirname, "..", "documentation", "Docs");

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/* SCHEMAS */
const userSchema = new mongoose.Schema({
  _id: String,
  name: String,
  email: String,
  password: String,
  role: { type: String, default: "user" },
  city: { type: String, default: "" },
  professionalRole: { type: String, default: "" },
  university: { type: String, default: "" },
  bio: { type: String, default: "" },
  github: { type: String, default: "" }
}, { versionKey: false });

const skillSchema = new mongoose.Schema({
  _id: String,
  userId: String,
  name: String,
  category: String
}, { versionKey: false });

const projectSchema = new mongoose.Schema({
  _id: String,
  userId: String,
  title: String,
  description: String,
  github: String,
  status: String
}, { versionKey: false });

const certificateSchema = new mongoose.Schema({
  _id: String,
  userId: String,
  name: String,
  provider: String,
  date: String,
  link: String
}, { versionKey: false });

const applicationSchema = new mongoose.Schema({
  _id: String,
  userId: String,
  company: String,
  position: String,
  status: String,
  date: String,
  link: String,
  notes: String
}, { versionKey: false });

const goalSchema = new mongoose.Schema({
  _id: String,
  userId: String,
  title: String,
  description: String,
  deadline: String,
  status: String
}, { versionKey: false });

const User = mongoose.model("User", userSchema);
const Skill = mongoose.model("Skill", skillSchema);
const Project = mongoose.model("Project", projectSchema);
const Certificate = mongoose.model("Certificate", certificateSchema);
const Application = mongoose.model("Application", applicationSchema);
const Goal = mongoose.model("Goal", goalSchema);

/* SEED DATA */
async function seedDatabase() {
  const count = await User.countDocuments();
  if (count > 0) return;

  await User.insertMany([
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
      role: "user",
      city: "Gelsenkirchen",
      professionalRole: "Master Informatik Studentin",
      university: "Westfälische Hochschule",
      bio: "Informatikstudentin mit Interesse an Webentwicklung.",
      github: "https://github.com/Raniaelsayed12/CareerBridge"
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
  ]);

  await Skill.insertMany([
    { _id: "skill-hania-1", userId: "user-hania", name: "Vue.js", category: "Frontend" },
    { _id: "skill-hania-2", userId: "user-hania", name: "Pinia", category: "State Management" },
    { _id: "skill-rania-1", userId: "user-rania", name: "Git & GitHub", category: "Tools" },
    { _id: "skill-aly-1", userId: "user-aly", name: "JavaScript", category: "Programming" }
  ]);

  await Project.insertMany([
    {
      _id: "project-hania-1",
      userId: "user-hania",
      title: "CareerBridge",
      description: "Student career platform for skills, projects, certificates and resume management.",
      github: "https://github.com/Raniaelsayed12/CareerBridge",
      status: "In Progress"
    },
    {
      _id: "project-aly-1",
      userId: "user-aly",
      title: "Personal Portfolio",
      description: "Portfolio page for student projects and skills.",
      github: "https://github.com/haniaalo",
      status: "Planned"
    }
  ]);

  await Certificate.insertMany([
    {
      _id: "certificate-hania-1",
      userId: "user-hania",
      name: "Vue Basics",
      provider: "Westfälische Hochschule",
      date: "2026-07-25",
      link: ""
    },
    {
      _id: "certificate-rania-1",
      userId: "user-rania",
      name: "GitHub Workflow",
      provider: "GitHub Skills",
      date: "2026-07-25",
      link: ""
    }
  ]);

  await Application.insertMany([
    {
      _id: "application-hania-1",
      userId: "user-hania",
      company: "Tech Solutions GmbH",
      position: "Frontend Developer Internship",
      status: "Applied",
      date: "2026-07-20",
      link: "https://example.com",
      notes: "Application sent with CareerBridge resume."
    },
    {
      _id: "application-rania-1",
      userId: "user-rania",
      company: "Digital Career Lab",
      position: "Web Developer Working Student",
      status: "Interview",
      date: "2026-07-22",
      link: "https://example.com",
      notes: "Interview preparation in progress."
    }
  ]);

  await Goal.insertMany([
    {
      _id: "goal-hania-1",
      userId: "user-hania",
      title: "Improve Vue.js skills",
      description: "Practice Vue Router, Pinia and API communication.",
      deadline: "2026-08-10",
      status: "In Progress"
    },
    {
      _id: "goal-rania-1",
      userId: "user-rania",
      title: "Prepare internship applications",
      description: "Update resume and collect project links.",
      deadline: "2026-08-15",
      status: "Planned"
    }
  ]);

  console.log("MongoDB seed data inserted.");
}

/* DOCS */
app.get("/docs", (req, res) => {
  try {
    if (!fs.existsSync(DOCS_DIR)) return res.json([]);

    const files = fs
      .readdirSync(DOCS_DIR)
      .filter((file) => file.endsWith(".md"))
      .sort();

    res.json(files);
  } catch {
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
  } catch {
    res.status(500).json({ message: "Documentation file could not be loaded." });
  }
});

/* HEALTH */
app.get("/", (req, res) => {
  res.json({ message: "CareerBridge backend is running", database: "MongoDB" });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", database: "MongoDB" });
});

/* AUTH */
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    email: String(email).toLowerCase().trim(),
    password
  }).lean();

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  res.json({ message: "Login successful", user });
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const exists = await User.findOne({ email: normalizedEmail });

  if (exists) {
    return res.status(400).json({ message: "Email already exists." });
  }

  const user = await User.create({
    _id: createId("user"),
    name,
    email: normalizedEmail,
    password,
    role: "user"
  });

  res.status(201).json({ message: "User registered successfully.", user });
});

/* USERS */
app.get("/users", async (req, res) => {
  const users = await User.find().lean();
  res.json(users);
});

app.post("/users", async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required." });
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const exists = await User.findOne({ email: normalizedEmail });

  if (exists) {
    return res.status(400).json({ message: "Email already exists." });
  }

  const user = await User.create({
    _id: createId("user"),
    name,
    email: normalizedEmail,
    password,
    role: role || "user"
  });

  res.status(201).json(user);
});

app.put("/users/:id", async (req, res) => {
  const update = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    city: req.body.city,
    professionalRole: req.body.professionalRole,
    university: req.body.university,
    bio: req.body.bio,
    github: req.body.github
  };

  if (req.body.password) update.password = req.body.password;

  Object.keys(update).forEach((key) => update[key] === undefined && delete update[key]);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $set: update },
    { new: true }
  );

  if (!user) return res.status(404).json({ message: "User not found." });

  res.json(user);
});

app.delete("/users/:id", async (req, res) => {
  const deleted = await User.findByIdAndDelete(req.params.id);

  if (!deleted) return res.status(404).json({ message: "User not found." });

  await Skill.deleteMany({ userId: req.params.id });
  await Project.deleteMany({ userId: req.params.id });
  await Certificate.deleteMany({ userId: req.params.id });
  await Application.deleteMany({ userId: req.params.id });
  await Goal.deleteMany({ userId: req.params.id });

  res.json({ message: "User deleted successfully." });
});

/* CRUD HELPER */
function crudRoutes(pathName, Model, requiredFields) {
  app.get(`/${pathName}`, async (req, res) => {
    const query = req.query.userId ? { userId: req.query.userId } : {};
    const items = await Model.find(query).lean();
    res.json(items);
  });

  app.post(`/${pathName}`, async (req, res) => {
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `${field} is required.` });
      }
    }

    const item = await Model.create({
      _id: createId(pathName.slice(0, -1)),
      ...req.body
    });

    res.status(201).json(item);
  });

  app.put(`/${pathName}/:id`, async (req, res) => {
    const item = await Model.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ message: `${pathName} item not found.` });
    }

    res.json(item);
  });

  app.delete(`/${pathName}/:id`, async (req, res) => {
    const deleted = await Model.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: `${pathName} item not found.` });
    }

    res.json({ message: `${pathName} item deleted successfully.` });
  });
}

crudRoutes("skills", Skill, ["userId", "name"]);
crudRoutes("projects", Project, ["userId", "title"]);
crudRoutes("certificates", Certificate, ["userId", "name"]);
crudRoutes("applications", Application, ["userId", "company", "position"]);
crudRoutes("goals", Goal, ["userId", "title"]);

/* START */
async function startServer() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in backend/.env");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    await seedDatabase();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`CareerBridge MongoDB backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Backend could not start:", error.message);
    process.exit(1);
  }
}

startServer();
