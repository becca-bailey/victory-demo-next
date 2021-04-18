import { ApolloServer, gql } from "apollo-server-micro";
import { populationData } from "../../public/population-data.json";

const typeDefs = gql`
  type YearValue {
    year: Int!
    value: String
  }

  type PopulationData {
    country: String!
    values: [YearValue!]!
  }

  type Query {
    populationData: [PopulationData!]!
  }
`;

const resolvers = {
  Query: {
    populationData: () => {
      return populationData;
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
