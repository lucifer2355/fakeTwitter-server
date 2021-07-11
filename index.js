const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })
  .then(() => server.listen({ port: process.env.port || 5000 }))
  .then((res) => {
    console.log(`Server running at ${res.url}`);
  })
  .catch((err) => console.error(err));
