const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const databasePath = process.env.DB_PATH || path.join(__dirname, "internships.db");
const db = new sqlite3.Database(databasePath);

const ready = new Promise((resolve, reject) => {
  db.exec(
    `
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS internships (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      location TEXT NOT NULL,
      mode TEXT NOT NULL,
      stipend TEXT NOT NULL,
      skills TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      internship_id INTEGER NOT NULL,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      resume_link TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (internship_id) REFERENCES internships(id)
    );
    `,
    (schemaError) => {
      if (schemaError) return reject(schemaError);

      db.get("SELECT COUNT(*) AS count FROM internships", (countError, row) => {
        if (countError) return reject(countError);

        if (row.count > 0) return resolve();

        const seedSql = `
          INSERT INTO internships (title, company, location, mode, stipend, skills)
          VALUES
            ('Cloud Computing Intern', 'Tech Solutions', 'Coimbatore', 'Remote', '₹8,000/month', 'Linux, AWS, Docker'),
            ('Java Developer Intern', 'Code Technologies', 'Chennai', 'Hybrid', '₹5,000/month', 'Java, SQL, OOP'),
            ('Web Development Intern', 'Digital Works', 'Bangalore', 'Remote', '₹10,000/month', 'HTML, CSS, JavaScript');
        `;

        db.exec(seedSql, (seedError) => {
          if (seedError) return reject(seedError);
          resolve();
        });
      });
    }
  );
});

module.exports = { db, ready };
