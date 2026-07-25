const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

/*
  CORS AND MIDDLEWARE
*/

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

app.use(
    cors({
      origin: allowedOrigins,
      methods: [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "OPTIONS",
      ],
      allowedHeaders: [
        "Content-Type",
        "Accept",
        "X-User-Id",
      ],
      optionsSuccessStatus: 204,
    })
);

app.use(
    express.json({
      limit: "1mb",
    })
);

/*
  LOCAL DATABASE
*/

const dataFile = path.join(
    __dirname,
    "local-db.json"
);

const defaultData = {
  users: [
    {
      _id: "user-1",
      name: "Hania Alilat",
      email:
          "hania.alilat@studmail.w-hs.de",
      password: "123456",
      city:
          "Bochum / Gelsenkirchen, Germany",
      role: "Master Informatik Student",
      university:
          "Westfälische Hochschule",
      bio:
          "Master student working on CareerBridge with Vue, Vite, Pinia and GitHub.",
      github:
          "https://github.com/haniaalo",
    },
  ],

  skills: [
    {
      _id: "skill-1",
      userId: "user-1",
      name: "Vue.js",
    },
    {
      _id: "skill-2",
      userId: "user-1",
      name: "JavaScript",
    },
    {
      _id: "skill-3",
      userId: "user-1",
      name: "Git & GitHub",
    },
  ],

  projects: [
    {
      _id: "project-1",
      userId: "user-1",
      title: "CareerBridge",
      description:
          "A platform for students to organize skills, projects and certificates.",
      github:
          "https://github.com/Raniaelsayed12/CareerBridge",
    },
  ],

  certificates: [
    {
      _id: "certificate-1",
      userId: "user-1",
      name: "Vue Basics",
      provider: "University Project",
    },
  ],
};

/*
  DATABASE HELPERS
*/

function saveData(data) {
  fs.writeFileSync(
      dataFile,
      JSON.stringify(data, null, 2),
      "utf-8"
  );
}

function loadData() {
  try {
    /*
      Create local-db.json when it does
      not exist yet.
    */

    if (!fs.existsSync(dataFile)) {
      saveData(defaultData);

      return structuredClone(defaultData);
    }

    const fileContent = fs.readFileSync(
        dataFile,
        "utf-8"
    );

    const parsedData =
        JSON.parse(fileContent);

    const users = Array.isArray(
        parsedData.users
    )
        ? parsedData.users
        : [];

    /*
      Old project versions did not have
      userId inside skills, projects and
      certificates.

      Existing old data is assigned to the
      first user in the database.
    */

    const firstUserId =
        users[0]?._id || "";

    const skills = Array.isArray(
        parsedData.skills
    )
        ? parsedData.skills.map(
            (skill) => ({
              ...skill,
              userId:
                  skill.userId ||
                  firstUserId,
            })
        )
        : [];

    const projects = Array.isArray(
        parsedData.projects
    )
        ? parsedData.projects.map(
            (project) => ({
              ...project,
              userId:
                  project.userId ||
                  firstUserId,
            })
        )
        : [];

    const certificates = Array.isArray(
        parsedData.certificates
    )
        ? parsedData.certificates.map(
            (certificate) => ({
              ...certificate,
              userId:
                  certificate.userId ||
                  firstUserId,
            })
        )
        : [];

    const migratedData = {
      users,
      skills,
      projects,
      certificates,
    };

    /*
      Save the migrated structure so the
      old data receives userId permanently.
    */

    saveData(migratedData);

    return migratedData;
  } catch (error) {
    console.error(
        "Could not load local database:",
        error
    );

    return {
      users: [],
      skills: [],
      projects: [],
      certificates: [],
    };
  }
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random()
      .toString(16)
      .slice(2)}`;
}

function createSafeUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    city: user.city || "",
    role: user.role || "",
    university:
        user.university || "",
    bio: user.bio || "",
    github: user.github || "",
  };
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email
  );
}

function isValidGitHubUrl(url) {
  if (!url) {
    return true;
  }

  return /^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_.-]+(?:\/[A-Za-z0-9_.-]+)?\/?$/.test(
      url
  );
}

/*
  This supports both frontend versions:

  1. X-User-Id request header
  2. userId query parameter
  3. userId inside the request body
*/

function getRequestUserId(req) {
  const headerUserId =
      req.get("X-User-Id");

  const queryUserId =
      typeof req.query.userId ===
      "string"
          ? req.query.userId
          : "";

  const bodyUserId =
      typeof req.body?.userId ===
      "string"
          ? req.body.userId
          : "";

  return (
      headerUserId ||
      queryUserId ||
      bodyUserId ||
      ""
  ).trim();
}

let db = loadData();

/*
  AUTHENTICATION MIDDLEWARE
*/

function requireUser(
    req,
    res,
    next
) {
  const userId =
      getRequestUserId(req);

  if (!userId) {
    return res.status(401).json({
      message:
          "User ID is missing. Please log out and sign in again.",
    });
  }

  const user = db.users.find(
      (item) => item._id === userId
  );

  if (!user) {
    return res.status(401).json({
      message:
          "User account was not found. Please sign in again.",
    });
  }

  req.currentUser = user;

  return next();
}

/*
  GENERAL ROUTES
*/

app.get("/", (req, res) => {
  return res.send(
      "CareerBridge Local Backend Working"
  );
});

app.get("/test-db", (req, res) => {
  return res.json({
    message:
        "Local JSON database is working",

    counts: {
      users: db.users.length,
      skills: db.skills.length,
      projects: db.projects.length,
      certificates:
      db.certificates.length,
    },
  });
});

/*
  REGISTRATION
*/

app.post("/register", (req, res) => {
  const name =
      req.body.name?.trim();

  const email =
      req.body.email
          ?.trim()
          .toLowerCase();

  const password =
      req.body.password;

  if (!name || !email || !password) {
    return res.status(400).json({
      message:
          "All fields are required.",
    });
  }

  if (name.length < 2) {
    return res.status(400).json({
      message:
          "Name must contain at least 2 characters.",
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({
      message:
          "Please enter a valid email address.",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message:
          "Password must contain at least 6 characters.",
    });
  }

  const existingUser =
      db.users.find(
          (user) =>
              user.email.toLowerCase() ===
              email
      );

  if (existingUser) {
    return res.status(409).json({
      message:
          "An account with this email already exists.",
    });
  }

  const newUser = {
    _id: createId("user"),
    name,
    email,
    password,
    city: "",
    role: "",
    university: "",
    bio: "",
    github: "",
  };

  db.users.push(newUser);

  try {
    saveData(db);

    return res.status(201).json({
      message:
          "User registered successfully.",

      user:
          createSafeUser(newUser),
    });
  } catch (error) {
    console.error(
        "Could not register user:",
        error
    );

    return res.status(500).json({
      message:
          "User could not be registered.",
    });
  }
});

/*
  LOGIN
*/

app.post("/login", (req, res) => {
  const email =
      req.body.email
          ?.trim()
          .toLowerCase();

  const password =
      req.body.password;

  if (!email || !password) {
    return res.status(400).json({
      message:
          "Email and password are required.",
    });
  }

  const user = db.users.find(
      (item) =>
          item.email.toLowerCase() ===
          email &&
          item.password === password
  );

  if (!user) {
    return res.status(401).json({
      message:
          "Invalid email or password.",
    });
  }

  return res.json({
    message: "Login successful.",

    user: createSafeUser(user),
  });
});

/*
  UPDATE USER PROFILE
*/

app.put(
    "/users/:id",
    requireUser,
    (req, res) => {
      if (
          req.currentUser._id !==
          req.params.id
      ) {
        return res.status(403).json({
          message:
              "You cannot update another user's profile.",
        });
      }

      const name =
          req.body.name?.trim();

      const email =
          req.body.email
              ?.trim()
              .toLowerCase();

      const city =
          req.body.city?.trim() || "";

      const role =
          req.body.role?.trim() || "";

      const university =
          req.body.university?.trim() ||
          "";

      const bio =
          req.body.bio?.trim() || "";

      const github =
          req.body.github?.trim() || "";

      if (!name || !email) {
        return res.status(400).json({
          message:
              "Name and email are required.",
        });
      }

      if (name.length < 2) {
        return res.status(400).json({
          message:
              "Name must contain at least 2 characters.",
        });
      }

      if (!isValidEmail(email)) {
        return res.status(400).json({
          message:
              "Please enter a valid email address.",
        });
      }

      if (
          !isValidGitHubUrl(github)
      ) {
        return res.status(400).json({
          message:
              "Please enter a valid GitHub profile URL.",
        });
      }

      const emailAlreadyExists =
          db.users.some(
              (item) =>
                  item._id !==
                  req.currentUser._id &&
                  item.email.toLowerCase() ===
                  email
          );

      if (emailAlreadyExists) {
        return res.status(409).json({
          message:
              "This email is already used by another account.",
        });
      }

      Object.assign(
          req.currentUser,
          {
            name,
            email,
            city,
            role,
            university,
            bio,
            github,
          }
      );

      try {
        saveData(db);

        return res.json({
          message:
              "Profile updated successfully.",

          user:
              createSafeUser(
                  req.currentUser
              ),
        });
      } catch (error) {
        console.error(
            "Could not update profile:",
            error
        );

        return res.status(500).json({
          message:
              "Profile could not be saved.",
        });
      }
    }
);

/*
  CURRENT USER

  The response remains an array so it
  stays compatible with the old frontend.
*/

app.get(
    "/users",
    requireUser,
    (req, res) => {
      return res.json([
        createSafeUser(
            req.currentUser
        ),
      ]);
    }
);

/*
  SKILLS
*/

app.get(
    "/skills",
    requireUser,
    (req, res) => {
      const skills =
          db.skills.filter(
              (skill) =>
                  skill.userId ===
                  req.currentUser._id
          );

      return res.json(skills);
    }
);

app.post(
    "/skills",
    requireUser,
    (req, res) => {
      const name =
          req.body.name?.trim();

      if (!name) {
        return res.status(400).json({
          message:
              "Skill name is required.",
        });
      }

      const duplicateSkill =
          db.skills.some(
              (skill) =>
                  skill.userId ===
                  req.currentUser._id &&
                  skill.name.toLowerCase() ===
                  name.toLowerCase()
          );

      if (duplicateSkill) {
        return res.status(409).json({
          message:
              "This skill already exists in your profile.",
        });
      }

      const newSkill = {
        _id: createId("skill"),
        userId:
        req.currentUser._id,
        name,
      };

      db.skills.push(newSkill);

      try {
        saveData(db);

        return res
            .status(201)
            .json(newSkill);
      } catch (error) {
        console.error(
            "Could not save skill:",
            error
        );

        return res.status(500).json({
          message:
              "Skill could not be saved.",
        });
      }
    }
);

app.put(
    "/skills/:id",
    requireUser,
    (req, res) => {
      const name =
          req.body.name?.trim();

      if (!name) {
        return res.status(400).json({
          message:
              "Skill name is required.",
        });
      }

      const skill = db.skills.find(
          (item) =>
              item._id === req.params.id &&
              item.userId ===
              req.currentUser._id
      );

      if (!skill) {
        return res.status(404).json({
          message:
              "Skill not found.",
        });
      }

      const duplicateSkill =
          db.skills.some(
              (item) =>
                  item._id !== skill._id &&
                  item.userId ===
                  req.currentUser._id &&
                  item.name.toLowerCase() ===
                  name.toLowerCase()
          );

      if (duplicateSkill) {
        return res.status(409).json({
          message:
              "This skill already exists in your profile.",
        });
      }

      skill.name = name;

      try {
        saveData(db);

        return res.json(skill);
      } catch (error) {
        console.error(
            "Could not update skill:",
            error
        );

        return res.status(500).json({
          message:
              "Skill could not be updated.",
        });
      }
    }
);

app.delete(
    "/skills/:id",
    requireUser,
    (req, res) => {
      const skill = db.skills.find(
          (item) =>
              item._id === req.params.id &&
              item.userId ===
              req.currentUser._id
      );

      if (!skill) {
        return res.status(404).json({
          message:
              "Skill not found.",
        });
      }

      db.skills =
          db.skills.filter(
              (item) =>
                  item._id !== skill._id
          );

      try {
        saveData(db);

        return res.json({
          message:
              "Skill deleted successfully.",
        });
      } catch (error) {
        console.error(
            "Could not delete skill:",
            error
        );

        return res.status(500).json({
          message:
              "Skill could not be deleted.",
        });
      }
    }
);

/*
  PROJECTS
*/

app.get(
    "/projects",
    requireUser,
    (req, res) => {
      const projects =
          db.projects.filter(
              (project) =>
                  project.userId ===
                  req.currentUser._id
          );

      return res.json(projects);
    }
);

app.post(
    "/projects",
    requireUser,
    (req, res) => {
      const title =
          req.body.title?.trim();

      const description =
          req.body.description?.trim() ||
          "";

      const github =
          req.body.github?.trim() || "";

      if (!title) {
        return res.status(400).json({
          message:
              "Project title is required.",
        });
      }

      if (
          !isValidGitHubUrl(github)
      ) {
        return res.status(400).json({
          message:
              "Please enter a valid GitHub repository URL.",
        });
      }

      const duplicateProject =
          db.projects.some(
              (project) =>
                  project.userId ===
                  req.currentUser._id &&
                  project.title.toLowerCase() ===
                  title.toLowerCase()
          );

      if (duplicateProject) {
        return res.status(409).json({
          message:
              "A project with this title already exists in your profile.",
        });
      }

      const newProject = {
        _id: createId("project"),
        userId:
        req.currentUser._id,
        title,
        description,
        github,
      };

      db.projects.push(newProject);

      try {
        saveData(db);

        return res
            .status(201)
            .json(newProject);
      } catch (error) {
        console.error(
            "Could not save project:",
            error
        );

        return res.status(500).json({
          message:
              "Project could not be saved.",
        });
      }
    }
);

app.put(
    "/projects/:id",
    requireUser,
    (req, res) => {
      const title =
          req.body.title?.trim();

      const description =
          req.body.description?.trim() ||
          "";

      const github =
          req.body.github?.trim() || "";

      if (!title) {
        return res.status(400).json({
          message:
              "Project title is required.",
        });
      }

      if (
          !isValidGitHubUrl(github)
      ) {
        return res.status(400).json({
          message:
              "Please enter a valid GitHub repository URL.",
        });
      }

      const project =
          db.projects.find(
              (item) =>
                  item._id ===
                  req.params.id &&
                  item.userId ===
                  req.currentUser._id
          );

      if (!project) {
        return res.status(404).json({
          message:
              "Project not found.",
        });
      }

      const duplicateProject =
          db.projects.some(
              (item) =>
                  item._id !==
                  project._id &&
                  item.userId ===
                  req.currentUser._id &&
                  item.title.toLowerCase() ===
                  title.toLowerCase()
          );

      if (duplicateProject) {
        return res.status(409).json({
          message:
              "A project with this title already exists in your profile.",
        });
      }

      Object.assign(project, {
        title,
        description,
        github,
      });

      try {
        saveData(db);

        return res.json(project);
      } catch (error) {
        console.error(
            "Could not update project:",
            error
        );

        return res.status(500).json({
          message:
              "Project could not be updated.",
        });
      }
    }
);

app.delete(
    "/projects/:id",
    requireUser,
    (req, res) => {
      const project =
          db.projects.find(
              (item) =>
                  item._id ===
                  req.params.id &&
                  item.userId ===
                  req.currentUser._id
          );

      if (!project) {
        return res.status(404).json({
          message:
              "Project not found.",
        });
      }

      db.projects =
          db.projects.filter(
              (item) =>
                  item._id !== project._id
          );

      try {
        saveData(db);

        return res.json({
          message:
              "Project deleted successfully.",
        });
      } catch (error) {
        console.error(
            "Could not delete project:",
            error
        );

        return res.status(500).json({
          message:
              "Project could not be deleted.",
        });
      }
    }
);

/*
  CERTIFICATES
*/

app.get(
    "/certificates",
    requireUser,
    (req, res) => {
      const certificates =
          db.certificates.filter(
              (certificate) =>
                  certificate.userId ===
                  req.currentUser._id
          );

      return res.json(
          certificates
      );
    }
);

app.post(
    "/certificates",
    requireUser,
    (req, res) => {
      const name =
          req.body.name?.trim();

      const provider =
          req.body.provider?.trim();

      if (!name || !provider) {
        return res.status(400).json({
          message:
              "Certificate name and provider are required.",
        });
      }

      const duplicateCertificate =
          db.certificates.some(
              (certificate) =>
                  certificate.userId ===
                  req.currentUser._id &&
                  certificate.name.toLowerCase() ===
                  name.toLowerCase() &&
                  certificate.provider.toLowerCase() ===
                  provider.toLowerCase()
          );

      if (duplicateCertificate) {
        return res.status(409).json({
          message:
              "This certificate already exists in your profile.",
        });
      }

      const newCertificate = {
        _id:
            createId("certificate"),
        userId:
        req.currentUser._id,
        name,
        provider,
      };

      db.certificates.push(
          newCertificate
      );

      try {
        saveData(db);

        return res
            .status(201)
            .json(newCertificate);
      } catch (error) {
        console.error(
            "Could not save certificate:",
            error
        );

        return res.status(500).json({
          message:
              "Certificate could not be saved.",
        });
      }
    }
);

app.put(
    "/certificates/:id",
    requireUser,
    (req, res) => {
      const name =
          req.body.name?.trim();

      const provider =
          req.body.provider?.trim();

      if (!name || !provider) {
        return res.status(400).json({
          message:
              "Certificate name and provider are required.",
        });
      }

      const certificate =
          db.certificates.find(
              (item) =>
                  item._id ===
                  req.params.id &&
                  item.userId ===
                  req.currentUser._id
          );

      if (!certificate) {
        return res.status(404).json({
          message:
              "Certificate not found.",
        });
      }

      const duplicateCertificate =
          db.certificates.some(
              (item) =>
                  item._id !==
                  certificate._id &&
                  item.userId ===
                  req.currentUser._id &&
                  item.name.toLowerCase() ===
                  name.toLowerCase() &&
                  item.provider.toLowerCase() ===
                  provider.toLowerCase()
          );

      if (duplicateCertificate) {
        return res.status(409).json({
          message:
              "This certificate already exists in your profile.",
        });
      }

      Object.assign(
          certificate,
          {
            name,
            provider,
          }
      );

      try {
        saveData(db);

        return res.json(
            certificate
        );
      } catch (error) {
        console.error(
            "Could not update certificate:",
            error
        );

        return res.status(500).json({
          message:
              "Certificate could not be updated.",
        });
      }
    }
);

app.delete(
    "/certificates/:id",
    requireUser,
    (req, res) => {
      const certificate =
          db.certificates.find(
              (item) =>
                  item._id ===
                  req.params.id &&
                  item.userId ===
                  req.currentUser._id
          );

      if (!certificate) {
        return res.status(404).json({
          message:
              "Certificate not found.",
        });
      }

      db.certificates =
          db.certificates.filter(
              (item) =>
                  item._id !==
                  certificate._id
          );

      try {
        saveData(db);

        return res.json({
          message:
              "Certificate deleted successfully.",
        });
      } catch (error) {
        console.error(
            "Could not delete certificate:",
            error
        );

        return res.status(500).json({
          message:
              "Certificate could not be deleted.",
        });
      }
    }
);

/*
  UNKNOWN ROUTES
*/

app.use((req, res) => {
  return res.status(404).json({
    message: "Route not found.",
  });
});

/*
  UNEXPECTED ERRORS
*/

app.use(
    (error, req, res, next) => {
      console.error(
          "Unhandled server error:",
          error
      );

      if (res.headersSent) {
        return next(error);
      }

      return res.status(500).json({
        message:
            "An unexpected server error occurred.",
      });
    }
);

/*
  START SERVER
*/

app.listen(PORT, () => {
  console.log(
      `CareerBridge local backend running on port ${PORT}`
  );
});