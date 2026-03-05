#! /usr/bin/env node

const { Client } = require("pg");

const SQL = `

DROP TABLE IF EXISTS loans;
DROP TABLE IF EXISTS book_author;
DROP TABLE IF EXISTS book_genre;
DROP TABLE IF EXISTS borrowers;

DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS authors;
DROP TABLE IF EXISTS publishers;
DROP TABLE IF EXISTS genres;

CREATE TABLE publishers (
  publisher_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  country TEXT NOT NULL,
  CONSTRAINT name_not_blank CHECK (TRIM(name) <> ''),
  CONSTRAINT country_not_blank CHECK (TRIM(country) <> '')
);


CREATE TABLE books (
  book_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  pages INTEGER NOT NULL CHECK (pages > 0),
  year_published INTEGER NOT NULL CHECK (
    year_published BETWEEN 100 AND EXTRACT(YEAR FROM CURRENT_DATE)
  ),
  publisher_id INTEGER NOT NULL REFERENCES publishers(publisher_id) ,
  CONSTRAINT title_not_blank CHECK (TRIM(title) <> '')
);

CREATE TABLE authors (
  author_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL UNIQUE

);


CREATE TABLE genres (
  genre_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);



CREATE TABLE book_author (
  book_id INTEGER NOT NULL REFERENCES books(book_id) ON DELETE CASCADE,
  author_id INTEGER NOT NULL REFERENCES authors(author_id),
  PRIMARY KEY (book_id, author_id)
);

CREATE TABLE book_genre (
  book_id INTEGER NOT NULL REFERENCES books(book_id),
  genre_id INTEGER NOT NULL REFERENCES genres(genre_id),
  PRIMARY KEY (book_id, genre_id)
);


INSERT INTO publishers (name, country) 
VALUES
  ('Faber & Faber', 'UK'),
  ('Simon & Schuster', 'USA'),
  ('Hardie Grant', 'AUS'),
  ('Bodley Head', 'UK'),  
  ('Doring Kindersley', 'UK'),
  ('Thames and Hudson', 'UK');

INSERT INTO books (title, pages, year_published, publisher_id)
VALUES
  ('Why I love poo', 12, 2025, 2),
  ('I hate Andrew!', 567, 2023, 1),
  ('Cats are the best people', 67, 2020, 3),
  ('Single speed bikes and the people who ride them', 113, 2011, 4),
  ('I used to be a sandwich', 190, 1975, 5),
  ('Shoegaze forever', 256, 1990, 6),
  ('Practical guide to clowning', 55, 2020, 2);
  

INSERT INTO authors (name)
VALUES
  ('Hemingway, Ernest'),
  ('Orwell, George'),
  ('Dama, Whiskey'),
  ('Loonytoons, Luna'),
  ('Ramsay, Gordon'),
  ('Chomsky, Noam'),
  ('Worm, Sand');


INSERT INTO genres (name)
VALUES
('Science Fiction'), ('Fantasy'), ('Horror'), ('Romance'), ('Mystery'), ('Thriller'), ('Biography'), ('Crime'), ('Historical'), ('Science');

INSERT INTO book_genre (book_id, genre_id) VALUES
(1, 4),
(1, 7),
(2, 8),
(3, 5),
(3, 10),
(4, 4),
(5, 5),
(6, 8),
(7, 9);

INSERT INTO book_author (book_id, author_id) VALUES 
(1, 2),
(2, 1),
(3, 3),
(3, 2),
(4, 4),
(5, 5),
(6, 6),
(7, 7);
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: "postgresql://dev_user@localhost:5432/inventoryapp",
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();

// CREATE TABLE loans (
//   loan_id INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
//   book_id INTEGER NOT NULL REFERENCES books(book_id),
//   borrower_id INTEGER NOT NULL REFERENCES borrowers(borrower_id),
//   loan_date DATE NOT NULL,
//   due_date DATE NOT NULL,
//   returned_date DATE,
//   renewals INTEGER DEFAULT 0,
//   CONSTRAINT unique_loan_per_day UNIQUE (book_id, borrower_id, loan_date)
// // );
// CREATE TABLE borrowers (
//   borrower_id INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
//   first_name TEXT NOT NULL,
//   last_name TEXT NOT NULL,
//   address TEXT NOT NULL,
//   member_no INTEGER	NOT NULL,
//   member_since INTEGER NOT NULL
// );

// INSERT INTO borrowers (first_name, last_name, address, member_no, member_since)
// VALUES
// ('Ben', 'Corbett', '1 Fonzy Lane, Kensington', 12345, 2023),
// ('Andrew', 'Ma', '666 Bennett Street, Fitzroy North', 23421, 2020);
