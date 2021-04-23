import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Spinner,
  Alert,
  Collapse,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { Form as FromikForm, Formik } from "formik";
import { useMutation } from "@apollo/client";
import { SubmitContact } from "../graphql/graphql";
import InputField from "../components/Input";

const Contact = () => {
  const socialText = [
    {
      text:
        "Lorem ipsum pariatur consectetur laboris occaecat nulla aliqua irure ad deserunt duis. Eiusmod nulla cupidatat labore sint sit aute dolore irure nostrud ut incididunt. Anim laborum reprehenderit labore magna ut dolore quis irure. Labore ea duis deserunt ullamco irure fugiat deserunt ut nisi ea minim proident. Nisi consectetur do non magna duis aliqua minim minim veniam. In occaecat minim qui consequat elit mollit consectetur non id tempor. Amet adipisicing occaecat tempor culpa quis est duis.",
    },
  ];

  const [query, { data }] = useMutation(SubmitContact);
  const [visibleAlert, setVisibleAlert] = useState(false);
  const handleVisible = () => {
    setVisibleAlert(true);
    setTimeout(() => {
      setVisibleAlert(false);
    }, 3500);
  };

  return (
    <>
      <title>Contact</title>
      <Container fluid style={{ backgroundColor: "#2ed15a" }}>
        <header className="masthead text-white text-center">
          <div className="container d-flex align-items-center flex-column">
            <h1 className="masthead-heading text-uppercase">Conctact us</h1>
            <div className="divider-custom divider-light">
              <div className="divider-custom-line"></div>
              <div className="divider-custom-line"></div>
            </div>
          </div>
        </header>
      </Container>
      {visibleAlert ? (
        <Collapse in={visibleAlert}>
          <Row
            className="justify-content-md-center"
            style={{
              position: "fixed",
              left: 0,
              width: "100%",
            }}
          >
            <Col md={4}>
              <Alert
                show={visibleAlert}
                variant="success"
                dismissible
                fixed-top
              >
                <strong>Success!</strong> we will contact you as soon as we can!
              </Alert>
            </Col>
          </Row>
        </Collapse>
      ) : null}
      <Container className="text-center">
        <Row className="align-content-center">
          <Col>
            <h1 className="review-title">
              <span className="lines">Tell us what you think!</span>
            </h1>
          </Col>
        </Row>
      </Container>
      <Container className="contact-container">
        <Row>
          <Col>
            <Formik
              initialValues={{ name: "", email: "", subject: "", body: "" }}
              onSubmit={async (values) => {
                const { response } = await query({
                  variables: {
                    name: values.name,
                    email: values.email,
                    subject: values.subject,
                    body: values.body,
                  },
                });
                if (!response) {
                  handleVisible();
                }
              }}
            >
              {({ isSubmitting }) => (
                <FromikForm>
                  <InputField
                    label="Name"
                    name="name"
                    type="text"
                    textarea={false}
                  />
                  <InputField
                    label="Email"
                    name="email"
                    type="email"
                    textarea={false}
                  />
                  <InputField
                    label="Subject"
                    name="subject"
                    type="text"
                    textarea={false}
                  />
                  <InputField
                    label="Message"
                    name="body"
                    textarea={true}
                    rows={5}
                  />
                  <Button type="submit" disabled={isSubmitting}>
                    {!isSubmitting && "Send"}
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
                </FromikForm>
              )}
            </Formik>
          </Col>
          <Col>
            {socialText.map((field) => (
              <p>
                {field.text}
                {field.text}
              </p>
            ))}
            <div className="socials text-center">
              <ul>
                <li>
                  <a href="http://www.facebook.com">
                    <FontAwesomeIcon
                      style={{ width: "50px", height: "50px" }}
                      icon={faFacebook}
                    />
                  </a>
                </li>
                <li>
                  <a href="http://www.twitter.com">
                    <FontAwesomeIcon
                      style={{
                        width: "50px",
                        height: "50px",
                        paddingLeft: "1rem",
                      }}
                      icon={faTwitter}
                    />
                  </a>
                </li>
                <li>
                  <a href="http://www.instagram.com">
                    <FontAwesomeIcon
                      style={{
                        width: "50px",
                        height: "50px",
                        paddingLeft: "1rem",
                      }}
                      icon={faInstagram}
                    />
                  </a>
                </li>
              </ul>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Contact;
