import { Form, Formik } from "formik";
import React from "react";
import { Container, Button, Spinner, Row, Col } from "react-bootstrap";
import InputField from "../components/Input";
import { useHistory } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { Login as LoginMutation, Me } from "../graphql/graphql";
import { toErrorMap } from "../utils/toErrorMap";

const Login = () => {
  const router = useHistory();
  const [query, { error }] = useMutation(LoginMutation);

  return (
    <>
      <title>Sign in</title>
      <Container fluid style={{ backgroundColor: "#2ed15a" }}>
        <header className="masthead text-white text-center">
          <div className="container d-flex align-items-center flex-column">
            <h1 className="masthead-heading text-uppercase">Sign in</h1>
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
            password: "",
          }}
          onSubmit={async (values, { setErrors }) => {
            const response = await query({
              variables: {
                email: values.email,
                password: values.password,
              },
              refetchQueries: [{ query: Me }],
            });

            if (response.data.login.errors) {
              setErrors(toErrorMap(response.data.login.errors));
            } else {
              router.push("/");
            }
          }}
        >
          {({ isSubmitting, errors }) => (
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

                  <InputField
                    label="Password"
                    name="password"
                    type="password"
                    textarea={false}
                    error={errors.password}
                  />
                  <a href="/forgot-password">Forgot Password?</a>
                  <br />
                  <Button
                    style={{ marginTop: "1rem" }}
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {!isSubmitting && "Log in"}
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
          )}
        </Formik>
        <Container
          style={{
            paddingTop: "2rem",
          }}
          className="text-center"
        >
          <Row className="align-content-center">
            <Col>
              <p>
                You still don't have account? Create one{" "}
                <a href="/register">here</a> for free
              </p>
            </Col>
          </Row>
        </Container>
      </Container>
    </>
  );
};

export default Login;
