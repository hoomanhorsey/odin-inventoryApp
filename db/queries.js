const pool = require("./pool");

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
      
      ARRAY_AGG(DISTINCT CONCAT(authors.name)) AS authors,
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
   
      ARRAY_AGG(DISTINCT CONCAT(authors.name)) AS authors,
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

async function getBooksByGenre(genre) {
  console.log(genre);
  const { rows } = await pool.query(
    "SELECT books.* FROM books JOIN book_genre ON books.book_id = book_genre.book_id JOIN genres ON book_genre.genre_id = genres.genre_id WHERE genres.name = $1; ",
    [genre],
  );
  return rows;
}

async function updateItem(bookId, formData) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN"); // start transaction

    // 1️⃣ Upsert publisher
    const publisherRes = await client.query(
      `INSERT INTO publishers (name, country)
       VALUES ($1, $2)
       ON CONFLICT (name) DO UPDATE SET country = EXCLUDED.country
       RETURNING publisher_id`,
      [formData.publisher_name, formData.publisher_country],
    );
    const publisherId = publisherRes.rows[0].publisher_id;

    // 2️⃣ Update main book fields
    await client.query(
      `UPDATE books
       SET title = $1,
           pages = $2,
           year_published = $3,
           publisher_id = $4
       WHERE book_id = $5`,
      [
        formData.bookTitle,
        formData.pages,
        formData.year_published,
        publisherId,
        bookId,
      ],
    );

    // 3️⃣ Upsert authors
    if (formData.authors.length > 0) {
      await client.query(
        `INSERT INTO authors (name)
         SELECT unnest($1::text[])
         ON CONFLICT (name) DO NOTHING`,
        [formData.authors],
      );

      await client.query(`DELETE FROM book_author WHERE book_id = $1`, [
        bookId,
      ]);
      await client.query(
        `INSERT INTO book_author (book_id, author_id)
         SELECT $1, author_id FROM authors WHERE name = ANY($2::text[])`,
        [bookId, formData.authors],
      );
    }

    // 4️⃣ Upsert genres
    if (formData.genres.length > 0) {
      await client.query(
        `INSERT INTO genres (name)
         SELECT unnest($1::text[])
         ON CONFLICT (name) DO NOTHING`,
        [formData.genres],
      );

      await client.query(`DELETE FROM book_genre WHERE book_id = $1`, [bookId]);
      await client.query(
        `INSERT INTO book_genre (book_id, genre_id)
         SELECT $1, genre_id FROM genres WHERE name = ANY($2::text[])`,
        [bookId, formData.genres],
      );
    }

    await client.query("COMMIT"); // commit transaction
  } catch (err) {
    await client.query("ROLLBACK"); // rollback on error
    throw err;
  } finally {
    client.release();
  }
}

async function deleteItem(bookId) {
  console.log("delete book - just kidding");

  const client = await pool.connect();

  try {
    await client.query("BEGIN"); // start transaction

    // 1️⃣ delete author_book
    await client.query("DELETE FROM book_author WHERE  book_Id = $1", [bookId]);

    // 2️⃣ delete genre_book
    await client.query("DELETE FROM book_genre WHERE book_id = $1", [bookId]);

    // 3️⃣ delete book
    await client.query("DELETE FROM books WHERE book_id = $1", [bookId]);

    await client.query("COMMIT"); // commit transaction
  } catch (err) {
    await client.query("ROLLBACK"); // rollback on error
    throw err;
  } finally {
    client.release();
  }
}

async function newItem(formData) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN"); // start transaction

    // 1️⃣ Upsert publisher
    const publisherRes = await client.query(
      `INSERT INTO publishers (name, country)
       VALUES ($1, $2)
       ON CONFLICT (name) DO UPDATE SET country = EXCLUDED.country
       RETURNING publisher_id`,
      [formData.publisher_name, formData.publisher_country],
    );
    const publisherId = publisherRes.rows[0].publisher_id;

    console.log("publisher id", publisherId);

    // 2️⃣ Update main book fields
    const bookRes = await client.query(
      `INSERT INTO books (title, pages, year_published, publisher_id) VALUES ($1, $2, $3, $4) RETURNING book_id`,
      [
        formData.bookTitle,
        formData.pages,
        formData.year_published,
        publisherId,
      ],
    );
    const bookId = bookRes.rows[0].book_id;

    // 3️⃣ Upsert authors
    if (formData.authors.length > 0) {
      const authorRes = await client.query(
        `INSERT INTO authors (name) VALUES ($1)ON CONFLICT (name) DO NOTHING RETURNING author_id`,
        [formData.authors],
      );
      const authorId = authorRes.rows[0].author_id;

      await client.query(
        `INSERT INTO book_author (book_id, author_id) VALUES ($1, $2) `,
        [bookId, authorId],
      );
    }

    // 4️⃣ Upsert genres
    if (formData.genres.length > 0) {
      const genreRes = await client.query(
        `INSERT INTO genres (name) VALUES ($1)
         ON CONFLICT (name) DO NOTHING RETURNING genre_id`,
        [formData.genres],
      );
      const genreId = genreRes.rows[0].genre_id;

      await client.query(
        `INSERT INTO book_genre (book_id, genre_id) VALUES ($1, $2 )`,
        [bookId, genreId],
      );
    }

    await client.query("COMMIT"); // commit transaction
  } catch (err) {
    await client.query("ROLLBACK"); // rollback on error
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  getIndex,
  getItem,
  getBooksByGenre,
  updateItem,
  deleteItem,
  newItem,
};
