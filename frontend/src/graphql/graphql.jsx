import { gql } from "@apollo/client";

// Fragments

const Fragments = {
  review: {
    errors: gql`
      fragment ErrorFragment on ReviewFieldError {
        field
        message
      }
    `,
    data: gql`
      fragment ReviewFragment on Reviews {
        id
        userId
        title
        Review
        createdAt
        updatedAt
      }
    `,
  },
  user: {
    errors: gql`
      fragment ErrorFragment on UserFieldError {
        field
        message
      }
    `,
    data: gql`
      fragment UserFragment on User {
        id
        Name
        Surname
        email
      }
    `,
  },
};

//queries

export const ShowReviews = gql`
  query ShowReviews($limit: Int!, $cursor: String) {
    showReviews(limit: $limit, cursor: $cursor) {
      review {
        ...ReviewFragment
        user {
          ...UserFragment
        }
      }
      hasMore
    }
  }
  ${Fragments.review.data}
  ${Fragments.user.data}
`;

export const ShowContacts = gql`
  query ShowContacts($limit: Int!, $cursor: String) {
    showContacts(limit: $limit, cursor: $cursor) {
      contact {
        id
        name
        subject
        body
        CreatedAt
      }
      hasMore
    }
  }
`;

export const Me = gql`
  query Me {
    me {
      ...UserFragment
    }
  }
  ${Fragments.user.data}
`;

/* MUTATIONS */

export const SubmitContact = gql`
  mutation SubmitContact(
    $name: String!
    $email: String!
    $subject: String!
    $body: String!
  ) {
    submitContact(
      options: { name: $name, email: $email, subject: $subject, body: $body }
    ) {
      contact {
        id
        name
        email
        subject
        body
      }
      errors {
        field
        message
      }
    }
  }
`;

export const Login = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        ...UserFragment
      }
      errors {
        ...ErrorFragment
      }
    }
  }
  ${Fragments.user.data}
  ${Fragments.user.errors}
`;

export const ForgotPasword = gql`
  mutation ForgotPassword($email: String!) {
    forgetPassword(email: $email)
  }
`;

export const ChangePassword = gql`
  mutation ChangePassword($token: String!, $newPassword: String!) {
    changePassword(token: $token, newPassword: $newPassword) {
      user {
        ...UserFragment
      }
      errors {
        ...ErrorFragment
      }
    }
  }
  ${Fragments.user.data}
  ${Fragments.user.errors}
`;

export const Register = gql`
  mutation Register(
    $name: String!
    $surname: String!
    $email: String!
    $password: String!
  ) {
    register(
      options: {
        name: $name
        surname: $surname
        email: $email
        password: $password
      }
    ) {
      user {
        ...UserFragment
      }
      errors {
        ...ErrorFragment
      }
    }
  }
  ${Fragments.user.data}
  ${Fragments.user.errors}
`;

export const Logout = gql`
  mutation Logout {
    logout
  }
`;

export const SubmitReview = gql`
  mutation SubmitReview($title: String!, $review: String!) {
    submitReview(options: { title: $title, review: $review }) {
      review {
        ...ReviewFragment
      }
      errors {
        ...ErrorFragment
      }
    }
  }
  ${Fragments.review.data}
  ${Fragments.review.errors}
`;
