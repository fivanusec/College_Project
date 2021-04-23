import { Field, InputType } from "type-graphql";

@InputType()
export class ContactInput {
  @Field()
  name: string;
  @Field()
  email: string;
  @Field()
  subject: string;
  @Field()
  body: string;
}
