import React from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { Form, Formik } from "formik";
import InputField from "../components/Input";
import { useMutation } from "@apollo/client";
import { Me, Register as RegisterMutation } from "../graphql/graphql";
import { useHistory } from "react-router-dom";
import { toErrorMap } from "../utils/toErrorMap";

const Register = () => {
  const [registerMutation, { error }] = useMutation(RegisterMutation);
  const router = useHistory();

  return (
    <>
      <title>Register</title>
      <Container fluid style={{ backgroundColor: "#2ed15a" }}>
        <header className="masthead text-white text-center">
          <div className="container d-flex align-items-center flex-column">
            <h1 className="masthead-heading text-uppercase">Register</h1>
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
            name: "",
            surname: "",
            email: "",
            password: "",
          }}
          onSubmit={async (values, { setErrors }) => {
            const response = await registerMutation({
              variables: {
                name: values.name,
                surname: values.surname,
                email: values.email,
                password: values.password,
              },
              refetchQueries: [{ query: Me }],
            });

            if (response.data?.register.errors) {
              setErrors(toErrorMap(response.data.register.errors));
            } else {
              router.push("/");
            }
          }}
        >
          {({ isSubmitting, errors }) => (
            <Row className="justify-content-md-center">
              <Col md={4}>
                <Form className="register-form">
                  <InputField
                    label="Name"
                    name="name"
                    type="text"
                    textarea={false}
                    error={errors.name}
                  />
                  <InputField
                    label="Surname"
                    name="surname"
                    type="text"
                    textarea={false}
                    error={errors.surname}
                  />
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
                  <Button
                    style={{ marginTop: "1rem" }}
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {!isSubmitting && "Register"}
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
      </Container>
    </>
  );
};

export default Register;
