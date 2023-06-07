const User = require('../mongo/models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Book = require('../mongo/models/Book');

const generateToken = (user) => {
  const token = jwt.sign({ userId: user.id }, 'egruiopjiwt43nuiesrg', { expiresIn: '1h' });
  return token;
};

const userResolvers = {
  Query: {
    users: async () => {
      try {
        const users = await User.find();
        return users;
      } catch (error) {
        throw new Error('Error fetching users');
      }
    },
    user: async (parent, { id }) => {
      try {
        const user = await User.findById(id);
        return user;
      } catch (error) {
        throw new Error('Error fetching user');
      }
    },
  },
  Mutation: {
    createUser: async (parent, { name, email, username, password }) => {
      try {
        const existingEmailUser = await User.findOne({ email });
        if (existingEmailUser) {
          throw new Error('Email already used');
        }
        const existingUsernameUser = await User.findOne({ username });
        if (existingUsernameUser) {
          throw new Error('Username already exists');
        }
        const newUser = new User({ name, email, username, password });
        await newUser.save();
    
        return newUser;
      } catch (error) {
        throw new Error('Error creating user: ' + error.message);
      }
    },
    login: async (_, { username, password }) => {
      try {
        const user = await User.findOne({ username });

        if (!user) {
          throw new Error('User not found');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }

        const token = generateToken(user);

        return {
          user,
          token,
        };
      } catch (error) {
        throw new Error('Error logging in');
      }
    },
    updateUser: async (parent, { id, name, email }) => {
      try {
        const updatedUser = await User.findByIdAndUpdate(
          id,
          { name, email },
          { new: true }
        );
        return updatedUser;
      } catch (error) {
        throw new Error('Error updating user');
      }
    },
    deleteUser: async (parent, { id }) => {
      try {
        await Book.deleteMany({ userId: id });
        const deletedUser = await User.findByIdAndRemove(id);
    
        if (!deletedUser) {
          throw new Error('User not found');
        }
    
        return id;
      } catch (error) {
        throw new Error(`Error deleting user: ${error.message}`);
      }
    },
  },
};

module.exports = userResolvers;