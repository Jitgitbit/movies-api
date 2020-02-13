// src/schema/movie.js
import { makeExecutableSchema } from 'graphql-tools';
const typeDefs = `
  type Query {
    movie(id: ID): Movie
  }
  type Movie {
    id: ID!
    title: String!
    budget(currency: Currency = EUR): Int
    release_date: String!
    production_companies: [Production_companies]
  }

  enum Currency {
    EUR
    GBP
    USD
  }
  type Production_companies {
    id: ID!
    logo_path: String!
    name: String!
    origin_country: String!
  }
`;
const resolvers = {
};
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
export default schema;