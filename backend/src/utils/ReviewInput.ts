import { Field, InputType } from "type-graphql";

@InputType()
export class ReviewInput {
  @Field()
  title!: string;
  @Field()
  review!: string;
}
