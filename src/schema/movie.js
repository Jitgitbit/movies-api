// src/schema/movie.js
import { makeExecutableSchema } from 'graphql-tools';
const typeDefs = `
  type Query {
    movie(id: ID): Movie
  }
  type Movie {
    id: ID!
  }
`;
const resolvers = {
};
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
export default schema;