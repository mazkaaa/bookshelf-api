const { nanoid } = require('nanoid');

//  model
const bookshelf = require('../model/bookModel');

const addBook = (req, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt: insertedAt,
  };

  if (name === undefined) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }
  if (bookshelf.filter((book) => book.id === id).length >= 0) {
    bookshelf.push(newBook);
    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    }).code(201);
  }

  return h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  }).code(500);
};

const getBooks = (req, h) => {
  const { name, reading, finished } = req.query;

  /* if (name === undefined && reading === undefined && finished === undefined) {
    return h.response({
      status: 'success',
      data: {
        books: bookshelf.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    }).code(200);
  }
  */

  if (name !== undefined) {
    const queryRes = bookshelf.filter((queryKey) => queryKey.name.toLowerCase()
      .includes(name.toLowerCase()))
      .map((queryBook) => ({
        id: queryBook.id,
        name: queryBook.name,
        publisher: queryBook.publisher,
      }));

    return h.response({
      status: 'success',
      data: {
        books: queryRes,
      },
    }).code(200);
  }
  if (reading) {
    const queryRes = bookshelf.filter((queryKey) => queryKey.reading === reading)
      .map((queryBook) => ({
        id: queryBook.id,
        name: queryBook.name,
        publisher: queryBook.publisher,
      }));

    return h.response({
      status: 'success',
      data: {
        books: queryRes,
      },
    }).code(200);
  }
  if (finished) {
    const queryRes = bookshelf.filter((queryKey) => queryKey.finished === finished)
      .map((queryBook) => ({
        id: queryBook.id,
        name: queryBook.name,
        publisher: queryBook.publisher,
      }));

    return h.response({
      status: 'success',
      data: {
        books: queryRes,
      },
    }).code(200);
  }

  return h.response({
    status: 'success',
    data: {
      books: bookshelf.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  }).code(200);
};

const getBookId = (req, h) => {
  const { bookIdParam } = req.params;
  const booksQuery = bookshelf.filter((book) => book.id === bookIdParam)[0];
  if (booksQuery === undefined || !booksQuery) {
    return h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    }).code(404);
  }
  return h.response({
    status: 'success',
    data: {
      book: booksQuery,
    },
  }).code(200);
};

const editBook = (req, h) => {
  const { bookIdParam } = req.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  if (name === undefined) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  const indexBook = bookshelf.findIndex((book) => book.id === bookIdParam);
  if (indexBook === -1) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    }).code(404);
  }

  bookshelf[indexBook] = {
    ...bookshelf[indexBook],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished: pageCount === readPage,
    updatedAt: new Date().toISOString(),
  };
  return h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  }).code(200);
};

const deleteBook = (req, h) => {
  const { bookIdParam } = req.params;
  const indexBook = bookshelf.findIndex((book) => book.id === bookIdParam);

  if (indexBook === -1) {
    return h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    }).code(404);
  }
  bookshelf.splice(indexBook, 1);
  return h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  }).code(200);
};

module.exports = {
  addBook,
  getBooks,
  getBookId,
  deleteBook,
  editBook,
};
