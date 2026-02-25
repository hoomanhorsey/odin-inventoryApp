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
      publishers.country AS publisher_country,
      
      ARRAY_AGG(DISTINCT CONCAT(authors.first_name, ' ', authors.last_name)) 
      AS authors,

      ARRAY_AGG(DISTINCT genres.name) AS genres

    FROM books

      INNER JOIN book_author ON books.book_id = book_author.book_id
      INNER JOIN authors ON book_author.author_id = authors.author_id
      INNER JOIN publishers ON books.publisher_id = publishers.publisher_id
      INNER JOIN book_genre ON books.book_id = book_genre.book_id
      INNER JOIN genres ON book_genre.genre_id = genres.genre_id

    GROUP BY

      books.book_id,
      books.title,
      books.pages,
      books.year_published,
 
      publishers.publisher_id,
      publishers.name,
      publishers.country
      
  `);
  return rows;
}

async function getItem(bookId) {
  const { rows } = await pool.query(
    `SELECT 
     books.book_id,
      books.title,
      books.pages,
      books.year_published,
      publishers.publisher_id,
      publishers.name AS publisher_name,
      publishers.country AS publisher_country,      
      ARRAY_AGG(DISTINCT CONCAT(authors.first_name, ' ', authors.last_name)) 
      AS authors,
      ARRAY_AGG(DISTINCT genres.name) AS genres

    FROM books 
    
     INNER JOIN book_author ON books.book_id = book_author.book_id
      INNER JOIN authors ON book_author.author_id = authors.author_id
      INNER JOIN publishers ON books.publisher_id = publishers.publisher_id
      INNER JOIN book_genre ON books.book_id = book_genre.book_id
      INNER JOIN genres ON book_genre.genre_id = genres.genre_id

    WHERE books.book_id = $1

      GROUP BY
      books.book_id,
      books.title,
      books.pages,
      books.year_published,
 
      publishers.publisher_id,
      publishers.name,
      publishers.country`,
    [bookId],
  );
  return rows[0];
}

// async function getItem(bookId) {
//   const { rows } = await pool.query(`SELECT * FROM books WHERE book_id = $1`, [
//     bookId,
//   ]);
//   return rows[0];
// }

async function getBooksByGenre(genre) {
  console.log(genre);
  const { rows } = await pool.query(
    "SELECT books.* FROM books JOIN book_genre ON books.book_id = book_genre.book_id JOIN genres ON book_genre.genre_id = genres.genre_id WHERE genres.name = $1; ",
    [genre],
  );
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
  getItem,
  getBooksByGenre,
  getAllUsernames,
  insertUsername,
};
