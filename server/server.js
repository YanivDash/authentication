import express from "express";
import mysql from "mysql";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";

const salt = 10;

/* to create an instance of an Express application */
const app = express();

// parses the JSON data from the request body and exposes it as a JavaScript object on the req.body
app.use(express.json());

// used to enable Cross-Origin Resource Sharing (CORS),
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET"],
    credentials: true,
  })
);

// used to parse cookies sent by the client's browser and make them available in the req.cookies object
app.use(cookieParser());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "authtest1",
});

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    console.log(req);
    return res.json({ Error: "user not authorized", token });
  } else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) {
        return res.json({ Error: "Token is not verified" });
      } else {
        req.name = decoded.name;
        next();
      }
    });
  }
};

app.get("/", verifyUser, (req, res) => {
  return res.json({ Status: "success", name: req.name });
});

app.post("/register", (req, res) => {
  const checkSql = `SELECT email FROM register WHERE email = ?`;

  db.query(checkSql, req.body.email.toString(), (err, response) => {
    if (err) return res.json({ Error: "Error while cross checking email" });

    if (response.length > 0) {
      return res.json({ duplicate: true });
    }

    const sql = `INSERT INTO register (name,email,password) VALUES (?)`;

    bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
      if (err) return res.json({ Error: "Error for hasing password" });
      const values = [req.body.name, req.body.email, hash];

      db.query(sql, [values], (err, result) => {
        if (err) return res.json({ Error: "Error while inserting in db" });
        return res.json({ Status: "success" });
      });
    });
  });
});

app.post("/login", (req, res) => {
  const sql = `SELECT * FROM register WHERE email = ?`;

  db.query(sql, req.body.email.toString(), (err, data) => {
    if (err) return res.json({ Error: "Login error in server" });

    if (data.length > 0) {
      bcrypt.compare(
        req.body.password.toString(),
        data[0].password,
        (err, response) => {
          if (err) return res.json({ Error: "password compare error" });
          if (response) {
            const name = data[0].name;
            const token = jwt.sign({ name }, "jwt-secret-key", {
              expiresIn: "1d",
            });
            res.cookie("token", token);
            return res.json({ Status: "success" });
          } else {
            return res.json({ Error: "password not matched" });
          }
        }
      );
    } else {
      return res.json({ Error: "email does not exist" });
    }
  });
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: "success" });
});

app.listen(4000, () => {
  console.log("listening on port 4000");
});
