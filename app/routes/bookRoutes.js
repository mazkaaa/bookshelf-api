const {
  getBookId,
  getBooks,
  addBook,
  editBook,
  deleteBook,
} = require('../controller/bookController');

const routes = [
  {
    method: 'GET',
    path: '/books/{bookIdParam}',
    handler: getBookId,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getBooks,
  },
  {
    method: 'POST',
    path: '/books',
    handler: addBook,
  },
  {
    method: 'PUT',
    path: '/books/{bookIdParam}',
    handler: editBook,
  },
  {
    method: 'DELETE',
    path: '/books/{bookIdParam}',
    handler: deleteBook,
  },
];

module.exports = routes;
