import React from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import { Row, Col } from "react-bootstrap";

const Error = (props) => {
  return (
    <>
      <title>OoOops!</title>
      <Jumbotron
        fluid
        style={{
          backgroundColor: "#2ed15a",
        }}
      >
        <Container
          className="text-center"
          fluid
          style={{
            backgroundColor: "#2ed15a",
          }}
        >
          <Row className="content-404">
            <Col>
              <h1 className="title-404">500</h1>
              <p className="text-404">
                Appears that internal server error happend :(
              </p>
              <p>{props.error}</p>
            </Col>
          </Row>
        </Container>
      </Jumbotron>
    </>
  );
};

export default Error;
