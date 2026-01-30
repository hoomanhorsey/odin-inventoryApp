const pool = require("./pool");

// async function getIndex() {
//   console.log("getIndex called");
//   const { rows } = await pool.query("SELECT * FROM books");
//   return rows;
// }

async function getIndex() {
  const { rows } = await pool.query(`
    SELECT 
      books.book_id,
      books.title,
      books.pages,
      books.year_published,
      publishers.publisher_id,
      publishers.name AS publisher_name,
      publishers.country AS publisher_country
    FROM books
    INNER JOIN publishers ON books.publisher_id = publishers.publisher_id
  `);
  return rows;
}

async function getAllUsernames() {
  console.log("get all usernames called");
  const { rows } = await pool.query("SELECT * FROM usernames");
  return rows;
}

async function insertUsername(username) {
  await pool.query("INSERT INTO usernames (username) VALUES ($1)", [username]);
}

module.exports = {
  getIndex,
  getAllUsernames,
  insertUsername,
};
