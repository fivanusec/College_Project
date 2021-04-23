import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Form, Formik } from "formik";
import InputField from "../../components/Input";
import {
  ChangePassword as GraphQLChangePassword,
  Me,
} from "../../graphql/graphql";
import { Container, Button, Spinner, Row, Col, Alert } from "react-bootstrap";
import { toErrorMap } from "../../utils/toErrorMap";

const ChangePassword = () => {
  const router = useHistory();
  const { token } = useParams();
  const [tokenError, setTokenError] = useState("");
  const [changePasswordMutation, { data }] = useMutation(GraphQLChangePassword);
  return (
    <>
      <title>Change password</title>
      <Container fluid style={{ backgroundColor: "#2ed15a" }}>
        <header className="masthead text-white text-center">
          <div className="container d-flex align-items-center flex-column">
            <h1 className="masthead-heading text-uppercase">Change password</h1>
            <div className="divider-custom divider-light">
              <div className="divider-custom-line"></div>
              <div className="divider-custom-line"></div>
            </div>
          </div>
        </header>
      </Container>
      <Container className="credentials">
        <Formik
          initialValues={{ newPassword: "" }}
          onSubmit={async (values, { setErrors }) => {
            const response = await changePasswordMutation({
              variables: {
                token: token,
                newPassword: values.newPassword,
              },
              refetchQueries: [{ query: Me }],
            });

            if (response.data?.changePassword.errors) {
              const errorMap = toErrorMap(response.data.changePassword.errors);
              if ("token" in errorMap) {
                setTokenError(errorMap.token);
              } else {
                setErrors(errorMap);
              }
            } else if (response.data?.changePassword.user) {
              router.push("/");
            }
          }}
        >
          {({ isSubmitting, errors }) => (
            <Row className="justify-content-md-center">
              <Col md={4}>
                <Form className="change-password-form">
                  <InputField
                    label="New password"
                    name="newpassword"
                    type="password"
                    textarea={false}
                    error={errors.password}
                  />
                  {tokenError ? (
                    <Alert variant="danger">
                      <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                      <p>
                        Your token has expired or something else. Well here is
                        your message:{" "}
                      </p>
                      <p>{tokenError}</p>
                    </Alert>
                  ) : null}
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
          )}
        </Formik>
      </Container>
    </>
  );
};

export default ChangePassword;
