import argon2 from "argon2";
import { User } from "../entites/User";
import { UsernamePasswordInput } from "../utils/UsernamePasswordInput";
import {
  Arg,
  Field,
  Mutation,
  ObjectType,
  Resolver,
  Ctx,
  Query,
} from "type-graphql";
import { getConnection } from "typeorm";
import { AppContext } from "../Types";
import { v4 } from "uuid";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constants";
import { sendMail } from "../utils/SendEmail";
import { ValidateRegister } from "../utils/ValidateRegister";

@ObjectType()
class UserFieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [UserFieldError], { nullable: true })
  errors?: UserFieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver(User)
export class UserResolver {
  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { redis, req }: AppContext
  ): Promise<UserResponse> {
    const key = FORGET_PASSWORD_PREFIX + token;
    const userID = await redis.get(key);

    if (!userID) {
      return {
        errors: [
          {
            field: "token",
            message: "Token expired",
          },
        ],
      };
    }

    const userid = parseInt(userID);
    const userData = await User.findOne(userid);

    if (!userData) {
      return {
        errors: [
          {
            field: "token",
            message: "User no longer exists",
          },
        ],
      };
    }

    await User.update(
      { id: userid },
      {
        password: await argon2.hash(newPassword),
      }
    );

    await redis.del(key);

    req.session.userId = userData.id;
    return {
      user: userData,
    };
  }

  @Mutation(() => Boolean)
  async forgetPassword(
    @Arg("email") email: string,
    @Ctx() { redis }: AppContext
  ) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return true;
    }

    const token = v4();
    await redis.set(
      FORGET_PASSWORD_PREFIX + token,
      user.id,
      "ex",
      1000 * 60 * 60 * 24 * 3
    );

    await sendMail(
      email,
      "Change password",
      `<a href="http://localhost:3000/change-password/${token}">Reset password</a>`
    ).catch(console.error);
    return true;
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: AppContext) {
    if (!req.session.userId) {
      return null;
    }

    return User.findOne(req.session.userId);
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { req }: AppContext
  ): Promise<UserResponse> {
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return {
        errors: [
          {
            field: "email",
            message: "Email doesn't exist",
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "Password you entered is not matching one in database",
          },
        ],
      };
    }

    req.session.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { req }: AppContext
  ): Promise<UserResponse> {
    const errors = ValidateRegister(options);
    if (errors) {
      return { errors };
    }

    const hashPassword = await argon2.hash(options.password);
    let user = null;
    try {
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          Name: options.name,
          Surname: options.surname,
          email: options.email,
          password: hashPassword,
        })
        .returning("*")
        .execute();
      // console.log(result);
      user = result.raw[0];
    } catch (err) {
      // console.log(err);
      if (err.code === "23505") {
        return {
          errors: [
            {
              field: "email",
              message: "Email already taken",
            },
          ],
        };
      }
    }

    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: AppContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }
        resolve(true);
      })
    );
  }
}
