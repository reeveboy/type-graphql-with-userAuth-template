import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { createConnection } from "typeorm";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { UserResolver } from "./resolvers/user/user";
import session from "express-session";
import {
  COOKIE_NAME,
  COOKIE_SECRET,
  FRONTEND_ORIGIN,
  __prod__,
} from "./constants";
import connectRedis from "connect-redis";
import cors from "cors";
import { redis } from "./redis";

const main = async () => {
  await createConnection();

  const schema = await buildSchema({
    resolvers: [HelloResolver, UserResolver],
  });

  const app = Express();

  const RedisStore = connectRedis(session);

  app.use(
    cors({
      origin: FRONTEND_ORIGIN,
      credentials: true,
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: "lax", // csrf
        secure: __prod__, // cookie will only work in http
      },
      saveUninitialized: false,
      secret: COOKIE_SECRET,
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({
      req,
      res,
    }),
  });

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("server started on http://localhost:4000/graphql");
  });
};

main();
