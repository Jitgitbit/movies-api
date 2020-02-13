// src/schema/movie.js
import { makeExecutableSchema } from 'graphql-tools';
import http from 'request-promise-json';
const MOVIE_DB_API_KEY = process.env.MOVIE_DB_API_KEY;

const typeDefs = `
  type Query {
    movies: [Movie]
    movie(id: ID, imdb_id: String): Movie
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
  type Mutation {
    rateMovie(id: ID!, rating: Int!): Int
  }
`;

let guestSessionObj
async function getSessionId() {
  guestSessionObj =
    guestSessionObj ||
    (await http.get(
      `https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${MOVIE_DB_API_KEY}&language=en-US`
    ))
  return guestSessionObj["guest_session_id"]
}

const resolvers = {
  Query: {
    movie: async (obj, args, context, info) => {
      if (args.id) {
        return http
          .get(`https://api.themoviedb.org/3/movie/${args.id}?api_key=${MOVIE_DB_API_KEY}&language=en-US`)
      }
      if (args.imdb_id) {
        const results = await http
          .get(`https://api.themoviedb.org/3/find/${args.imdb_id}?api_key=${MOVIE_DB_API_KEY}&language=en-US&external_source=imdb_id`)
        if (results.movie_results.length > 0) {
          const movieId = results.movie_results[0].id
          return http
            .get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${MOVIE_DB_API_KEY}&language=en-US`)
        }
      }
    },
    movies: (obj, args, context, info) => {
        return http
          .get(`https://api.themoviedb.org/3/discover/movie?api_key=${MOVIE_DB_API_KEY}&language=en-US`)
          .then(response => response.results)
    },
  },
  Mutation: {
    rateMovie: async (obj, args, context, info) => {
      const guest_session = await getSessionId()
      return await http.post(
        `https://api.themoviedb.org/3/movie/${
          args.id
        }/rating?api_key=${MOVIE_DB_API_KEY}&guest_session_id=${guest_session}&language=en-US`,
        {value: args.rating}
      ).then(() => args.rating)
    }
  }
};


const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
export default schema;