const express = require("express");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { db, ready } = require("./database");

const app = express();

app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false }));

app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { error: "Too many requests. Please try again later." }
  })
);

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", async (req, res) => {
  try {
    await ready;
    res.json({ status: "ok" });
  } catch (error) {
    res.status(500).json({ error: "Database is not available." });
  }
});

app.get("/api/internships", async (req, res) => {
  try {
    await ready;
    db.all(
      "SELECT id, title, company, location, mode, stipend, skills FROM internships ORDER BY id ASC",
      [],
      (error, rows) => {
        if (error) return res.status(500).json({ error: "Unable to load internships." });
        res.json(rows);
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Database is not available." });
  }
});

function validateApplication(body) {
  const internshipId = Number(body.internship_id);
  const fullName = typeof body.full_name === "string" ? body.full_name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const resumeLink = typeof body.resume_link === "string" ? body.resume_link.trim() : "";

  if (!Number.isSafeInteger(internshipId) || internshipId <= 0) {
    return { error: "Please select a valid internship." };
  }
  if (fullName.length < 2 || fullName.length > 80 || !/^[\p{L}\p{M} .'-]+$/u.test(fullName)) {
    return { error: "Enter a valid name (2–80 characters)." };
  }
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Enter a valid email address." };
  }
  if (!/^\d{10}$/.test(phone)) {
    return { error: "Phone number must contain exactly 10 digits." };
  }
  if (resumeLink.length > 2048) {
    return { error: "Resume link is too long." };
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(resumeLink);
  } catch {
    return { error: "Enter a valid resume URL." };
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol) || parsedUrl.username || parsedUrl.password) {
    return { error: "Resume link must be a valid HTTP or HTTPS URL." };
  }

  return { value: { internshipId, fullName, email, phone, resumeLink } };
}

app.post("/api/applications", async (req, res) => {
  try {
    await ready;
    const validation = validateApplication(req.body || {});
    if (validation.error) return res.status(400).json({ error: validation.error });

    const { internshipId, fullName, email, phone, resumeLink } = validation.value;

    db.get("SELECT id FROM internships WHERE id = ?", [internshipId], (lookupError, internship) => {
      if (lookupError) return res.status(500).json({ error: "Unable to verify internship." });
      if (!internship) return res.status(404).json({ error: "The selected internship does not exist." });

      db.run(
        `INSERT INTO applications (internship_id, full_name, email, phone, resume_link)
         VALUES (?, ?, ?, ?, ?)`,
        [internshipId, fullName, email, phone, resumeLink],
        function (insertError) {
          if (insertError) return res.status(500).json({ error: "Unable to submit your application." });
          res.status(201).json({
            message: "Application submitted successfully!",
            applicationId: this.lastID
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: "Database is not available." });
  }
});

if (require.main === module) {
  const port = Number(process.env.PORT) || 3000;
  ready
    .then(() => app.listen(port, () => console.log(`Server running at http://localhost:${port}`)))
    .catch((error) => {
      console.error("Database initialization failed:", error);
      process.exit(1);
    });
}

module.exports = app;
