import { Reviews } from "../entites/Reviews";
import { isAuth } from "../middleware/isAuth";
import { AppContext } from "../Types";
import { ReviewInput } from "../utils/ReviewInput";
import {
  Arg,
  Ctx,
  Field,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { getConnection } from "typeorm";

@ObjectType()
class ReviewFieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class ReviewResponse {
  @Field(() => [ReviewFieldError], { nullable: true })
  errors?: ReviewFieldError[];

  @Field(() => Reviews, { nullable: true })
  review?: Reviews;
}

@ObjectType()
class PaginatedReviews {
  @Field(() => [Reviews])
  review: Reviews[];

  @Field()
  hasMore: boolean;
}

@Resolver(Reviews)
export class ReviewResolver {
  @Query(() => PaginatedReviews)
  async showReviews(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string
  ): Promise<PaginatedReviews> {
    const realLimit = Math.min(10, limit);
    const realLimitAdded = realLimit + 1;

    const replacements: any[] = [realLimitAdded];

    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }
    const reviews = await getConnection().query(
      `select r.*, json_build_object(
        'id', u.id,
        'Name',u."Name",
        'Surname', u."Surname",
        'email', u.email,
        'createdAt', u."createdAt",
        'updatedAt', u."updatedAt"
        ) "user"
        from reviews r 
        inner join public.user u on u.id = r."userId"
       ${cursor ? ` where r."createdAt" < $2` : ""} 
       order by r."createdAt" DESC limit $1`,
      replacements
    );

    return {
      review: reviews.slice(0, realLimit),
      hasMore: reviews.length === realLimitAdded,
    };
  }

  @Mutation(() => Reviews, { nullable: true })
  async updateReview(
    @Arg("id", () => Int) id: number,
    @Arg("title", () => String) title: string,
    @Arg("Review", () => String) Review: string
  ): Promise<Reviews | null> {
    const review = await Reviews.findOne(id);

    if (!review) {
      return null;
    }

    if (typeof Review !== "undefined") {
      await Reviews.update({ id }, { title, Review });
    }

    return review;
  }

  @Mutation(() => ReviewResponse)
  @UseMiddleware(isAuth)
  async submitReview(
    @Arg("options") options: ReviewInput,
    @Ctx() { req }: AppContext
  ): Promise<ReviewResponse> {
    let review;
    try {
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Reviews)
        .values({
          title: options.title,
          Review: options.review,
          userId: req.session.userId,
        })
        .returning("*")
        .execute();
      review = result.raw[0];
    } catch (err) {
      return {
        errors: [
          {
            field: "Review",
            message: "There was an error",
          },
        ],
      };
    }
    return { review };
  }
}
