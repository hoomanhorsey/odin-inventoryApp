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
  name TEXT NOT NULL,
  country TEXT NOT NULL
);


CREATE TABLE books (
  book_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  pages INTEGER NOT NULL,
  year_published INTEGER NOT NULL,
  publisher_id INTEGER NOT NULL REFERENCES publishers(publisher_id)
);

CREATE TABLE authors (
  author_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  birth_year INTEGER NOT NULL, 
  nationality TEXT NOT NULL
);


CREATE TABLE genres (
  genre_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE borrowers (
  borrower_id INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY, 
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL, 
  address TEXT NOT NULL, 
  member_no INTEGER	NOT NULL,
  member_since INTEGER NOT NULL
);

CREATE TABLE book_author (
  book_id INTEGER NOT NULL REFERENCES books(book_id),
  author_id INTEGER NOT NULL REFERENCES authors(author_id),
  PRIMARY KEY (book_id, author_id)
);

CREATE TABLE book_genre (
  book_id INTEGER NOT NULL REFERENCES books(book_id),
  genre_id INTEGER NOT NULL REFERENCES genres(genre_id),
  PRIMARY KEY (book_id, genre_id)
);

CREATE TABLE loans (
  loan_id INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  book_id INTEGER NOT NULL REFERENCES books(book_id),
  borrower_id INTEGER NOT NULL REFERENCES borrowers(borrower_id), 
  loan_date DATE NOT NULL,
  due_date DATE NOT NULL, 
  returned_date DATE, 
  renewals INTEGER DEFAULT 0,
  CONSTRAINT unique_loan_per_day UNIQUE (book_id, borrower_id, loan_date)
);

INSERT INTO publishers (name, country) 
VALUES
  ('Faber & Faber', 'UK'),
  ('Simon & Schuster', 'USA'),
  ('Hardie Grant', 'AUS'),
  ('Bodley Head', 'UK');

INSERT INTO books (title, pages, year_published, publisher_id)
VALUES
  ('Why I love poo', 12, 2025, 2),
  ('I hate Andrew!', 567, 2023, 1);

INSERT INTO authors (first_name, last_name, birth_year, nationality)
VALUES
  ('Ernest', 'Hemingway', 1902, 'American'),
  ('George', 'Orwell', 1890, 'English');

INSERT INTO genres (name)
VALUES
('Science Fiction'), ('Fantasy'), ('Horror'), ('Romance'), ('Mystery'), ('Thriller'), ('Biography'), ('Crime'), ('Historical');
  
INSERT INTO borrowers (first_name, last_name, address, member_no, member_since) 
VALUES
('Ben', 'Corbett', '1 Fonzy Lane, Kensington', 12345, 2023),
('Andrew', 'Ma', '666 Bennett Street, Fitzroy North', 23421, 2020);

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
