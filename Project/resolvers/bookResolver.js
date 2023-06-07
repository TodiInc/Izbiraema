const Book = require('../mongo/models/Book');
const User = require('../mongo/models/User');

const bookResolvers = {
  Query: {
    books: async () => {
      try {
        const books = await Book.find();
        return books;
      } catch (error) {
        throw new Error('Error fetching books');
      }
    },
    book: async (parent, { id }) => {
      try {
        const book = await Book.findById(id);
        return book;
      } catch (error) {
        throw new Error('Error fetching book');
      }
    },
  },
  Mutation: {
    createBook: async (parent, { title, author, userId }) => {
      try {
        const newBook = await Book.create({ title, author, userId });
        return newBook;
      } catch (error) {
        throw new Error('Error creating book');
      }
    },
    updateBook: async (parent, { id, title, author, userId }) => {
      try {
        const updatedBook = await Book.findByIdAndUpdate(
          id,
          { title, author, userId },
          { new: true }
        );
        return updatedBook;
      } catch (error) {
        throw new Error('Error updating book');
      }
    },
    deleteBook: async (parent, { id }) => {
      try {
        await Book.findByIdAndRemove(id);
        return id;
      } catch (error) {
        throw new Error('Error deleting book');
      }
    },
  },
  Book: {
    user: async (parent) => {
      try {
        const user = await User.findById(parent.userId);
        return user;
      } catch (error) {
        throw new Error('Error fetching user');
      }
    },
  },
};

module.exports = bookResolvers;