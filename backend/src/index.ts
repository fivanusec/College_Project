import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { Contact } from "./entites/Contact";
import { Reviews } from "./entites/Reviews";
import { User } from "./entites/User";
import { UserResolver } from "./resolvers/user";
import Redis from "ioredis";
import connectRedis from "connect-redis";
import session from "express-session";
import { COOKIE_NAME, __prod__ } from "./constants";
import { ContactResolver } from "./resolvers/Contact";
import { ReviewResolver } from "./resolvers/Review";
import cors from "cors";

const main = async () => {
  //
  // Creating the connection
  //
  const connection = await createConnection({
    type: "postgres",
    database: "pzi_projekt",
    username: "postgres",
    password: "00259641",
    logging: true,
    synchronize: true,
    entities: [User, Reviews, Contact],
  });

  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis();

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  app.set("trust proxy", 1);

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        host: "localhost",
        port: 6379,
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secure: !__prod__,
      },
      saveUninitialized: false,
      secret: "uasdkadnkad",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, ContactResolver, ReviewResolver],
      validate: false,
    }),
    introspection: false,
    context: ({ req, res }) => ({ req, res, redis }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(4000, () => {
    console.log(`Server started on localhost:4000`);
  });
};

main().catch((err) => {
  console.error(err);
});
