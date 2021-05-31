import { isAuth } from "../middleware/isAuth";
import { Query, Resolver, UseMiddleware } from "type-graphql";

@Resolver()
export class HelloResolver {
  @UseMiddleware(isAuth)
  @Query(() => String)
  async helloWorld() {
    return "hello world";
  }
}
