import mysql from "mysql";
import dotenv from "dotenv";
dotenv.config();

// console.log(
//   process.env.DB_HOST,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   process.env.DB_DATABASE,
//   "vinay"
// );
export const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

export const working = () => {
  console.log("vinay");
};
