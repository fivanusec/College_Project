import React from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import { Row, Col } from "react-bootstrap";

const NotFound = () => {
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
              <h1 className="title-404">404</h1>
              <p className="text-404">
                Appears that this page doesn't exist :(
              </p>
            </Col>
          </Row>
        </Container>
      </Jumbotron>
    </>
  );
};

export default NotFound;
