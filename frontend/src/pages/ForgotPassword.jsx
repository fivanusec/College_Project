import { Form, Formik } from "formik";
import InputField from "../components/Input";
import React from "react";
import { useState } from "react";
import { Container, Button, Spinner, Row, Col, Alert } from "react-bootstrap";
import { ForgotPasword } from "../graphql/graphql";
import { useMutation } from "@apollo/client";

const ForgotPassword = () => {
  const [complete, setComplete] = useState(false);
  const [forgotPasswordMutation, { data }] = useMutation(ForgotPasword);
  return (
    <>
      <title>Forogot password</title>
      <Container fluid style={{ backgroundColor: "#2ed15a" }}>
        <header className="masthead text-white text-center">
          <div className="container d-flex align-items-center flex-column">
            <h1 className="masthead-heading text-uppercase">
              Forogot password
            </h1>
            <div className="divider-custom divider-light">
              <div className="divider-custom-line"></div>
              <div className="divider-custom-line"></div>
            </div>
          </div>
        </header>
      </Container>
      <Container className="credentials">
        <Formik
          initialValues={{
            email: "",
          }}
          onSubmit={async (values) => {
            const result = await forgotPasswordMutation({
              variables: { email: values.email },
            });

            if (result.data?.forgetPassword) {
              setComplete(true);
            }
          }}
        >
          {({ isSubmitting, errors }) =>
            complete ? (
              <Alert variant="success">
                <Alert.Heading>Hey, we sent you an email!</Alert.Heading>
                <p>
                  Aww yeah, we sent you an email with the link to change your
                  password!
                </p>
                <hr />
                <p className="mb-0">Your team at P!</p>
              </Alert>
            ) : (
              <Row className="justify-content-md-center">
                <Col md={4}>
                  <Form className="login-form">
                    <InputField
                      label="Email"
                      name="email"
                      type="email"
                      textarea={false}
                      error={errors.email}
                    />
                    <Button
                      style={{ display: "flex" }}
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {!isSubmitting && "Submit"}
                      {isSubmitting && (
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                      )}
                    </Button>
                  </Form>
                </Col>
              </Row>
            )
          }
        </Formik>
      </Container>
    </>
  );
};

export default ForgotPassword;
