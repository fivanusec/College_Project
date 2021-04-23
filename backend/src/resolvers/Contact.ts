import { Contact } from "../entites/Contact";
import { ContactInput } from "../utils/ContactInput";
import {
  Arg,
  Field,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { getConnection } from "typeorm";
import { sendMail } from "../utils/SendEmail";

/**
 * ContactFieldError: Object for displaying errors,
 * Gets and sets field and error messages depending on where error happend
 *
 * @field : filed: string
 * @field : message: string
 */

@ObjectType()
class ContactFieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

/**
 * ContactResponse: Object for displaying data that is set to database,
 * Gets and sets data in database if data is full else sets data into ContactFieldError
 *
 * @field : errors?: ContactFiledError[]
 * @field : contact?: Contact
 */

@ObjectType()
class ContactResponse {
  @Field(() => [ContactFieldError], { nullable: true })
  errors?: ContactFieldError[];

  @Field(() => Contact, { nullable: true })
  contact?: Contact;
}

/**
 * PaginatedContact: Object that sorts and shows contacts,
 * only for testing
 */

@ObjectType()
class PaginatedContacts {
  @Field(() => [Contact])
  contact: Contact[];

  @Field()
  hasMore: boolean;
}

@Resolver(Contact)
export class ContactResolver {
  /**
   * showContatcs: Gets contacts from database acording to limit and cursor,
   *  as search filter.
   *
   * @param limit
   * @param cursor
   */

  @Query(() => PaginatedContacts)
  async showContacts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedContacts> {
    const realLimit = Math.min(5, limit);
    const realLimitAdded = realLimit + 1;

    const replacements: any[] = [realLimitAdded];

    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }
    const contacts = await getConnection().query(
      `select c.* from contact c where c."CreatedAt" < $2 order by c."CreatedAt" DESC limit $1`,
      replacements
    );

    return {
      contact: contacts.slice(0, realLimit),
      hasMore: contacts.length === realLimitAdded,
    };
  }

  /**
   * submitContact: Gets data from argumnet options and sets it into database,
   * after the database returned result sends email to contact sender
   *
   * @param options
   * @returns { contact }
   */

  @Mutation(() => ContactResponse)
  async submitContact(
    @Arg("options") options: ContactInput
  ): Promise<ContactResponse> {
    let contact = null;
    try {
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Contact)
        .values({
          ...options,
        })
        .returning("*")
        .execute();
      // console.log(result);
      contact = result.raw[0];

      await sendMail(
        options.email,
        "Thank you for contacting us!",
        `Thank you for contacting us! We will return to you shortly!`
      ).catch(console.error);
    } catch (err) {
      // console.log(err);
      return {
        errors: [
          {
            field: "Body",
            message: "There was an error",
          },
        ],
      };
    }
    return { contact };
  }
}
