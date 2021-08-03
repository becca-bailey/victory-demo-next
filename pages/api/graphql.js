import { ApolloServer, gql } from "apollo-server-micro";
import data from "../../public/population-data.json";
import { sampleSize } from "lodash";

const typeDefs = gql`
  type YearValue {
    year: Int!
    value: String
  }

  type XY {
    x: Float!
    y: Float!
  }

  type PopulationData {
    country: String!
    values: [YearValue!]!
  }

  type Query {
    populationData(count: Int!): [PopulationData!]!
    randomXY(count: Int!): [XY!]!
  }
`;

const resolvers = {
  Query: {
    populationData: (_, { count }) => {
      return sampleSize(data.populationData, count);
    },
    randomXY: (_, { count }) => {
      const random = [];
      for (let i = 0; i < count; i++) {
        random.push({
          x: Math.random(),
          y: Math.random(),
        });
      }
      return random;
    },
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: "/api/graphql" });
