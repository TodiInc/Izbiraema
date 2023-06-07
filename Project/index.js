const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const { readFileSync } = require('fs');

const bookResolvers = require('./resolvers/bookResolver');
const userResolvers = require('./resolvers/userResolver');

const app = express();
const port = 4000;

const MONGODB_URI =
  'mongodb+srv://Todi:Zeratul3637@cluster0.gnswdia.mongodb.net/mydatabase?retryWrites=true&w=majority';

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });

const typeDefs = readFileSync('./schema/schema.graphql', 'utf8');

const server = new ApolloServer({
  typeDefs,
  resolvers: [bookResolvers, userResolvers],
});

server.start().then(() => {
  server.applyMiddleware({ app });

  app.listen({ port }, () => {
    console.log(`Server running at http://localhost:${port}${server.graphqlPath}`);
  });
});