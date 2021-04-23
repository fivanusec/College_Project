import React, { useState } from "react";
import { CardDeck, Container, Row, Card, Col, Spinner } from "react-bootstrap";
import Typed from "react-typed";

import Prva from "../img/prva.jpg";
import Druga from "../img/druga.jpg";
import Treca from "../img/treca.jpg";
import { useQuery } from "@apollo/client";
import { ShowReviews } from "../graphql/graphql";
import moment from "moment";
import Error from "./Error";

const Home = () => {
  const typeText = ["Speed.", "Quality.", "Performance."];
  const [variables, setVariables] = useState({
    limit: 3,
  });
  const { loading, error, data } = useQuery(ShowReviews, { variables });
  const picArr = [Prva, Druga, Treca];
  const arrIndex = Math.floor(Math.random() * picArr.length);

  if (error) {
    return <Error />;
  }

  return (
    <>
      <title>P!</title>
      <Container
        fluid
        style={{
          backgroundColor: "#2ed15a",
        }}
      >
        <header className="masthead text-white text-center">
          <div className="container d-flex align-items-center flex-column">
            <h1 className="masthead-heading text-uppercase mb-0">P!</h1>
            <p className="masthead-slogan font-weight-light mb-0">
              "With our product you are safe"
            </p>
            <div className="divider-custom divider-light">
              <div className="divider-custom-line"></div>
              <div className="divider-custom-line"></div>
            </div>
            <p className="masthead-subheading font-weight-light mb-0">
              <Typed
                strings={typeText}
                typeSpeed={80}
                backDelay={1100}
                backSpeed={30}
                loop
              />
            </p>
          </div>
        </header>
      </Container>
      <Container className="text-center">
        <Row className="align-content-center">
          <Col>
            <h1 className="review-title">
              <span className="lines">Read our reviews!</span>
            </h1>
          </Col>
        </Row>
      </Container>
      <Container className="text-center">
        <Row className="review-row align-content-center">
          {loading && !data ? (
            <Container className="text-center">
              <Row className="align-content-center">
                <Col>
                  <Spinner animation="grow" />
                </Col>
              </Row>
            </Container>
          ) : (
            <CardDeck>
              {data.showReviews.review.map((index) => (
                <Card style={{ borderRadius: "12px" }}>
                  <Card.Img
                    className="review-img"
                    variant="top"
                    src={picArr[arrIndex]}
                  />
                  <Card.Body>
                    <Card.Title>{index.title}</Card.Title>
                    <Card.Text>{index.Review}</Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <small className="text-muted">
                      Last updated{" "}
                      {moment.unix(index.updatedAt).toDate().toDateString()}
                      {""}
                    </small>
                  </Card.Footer>
                </Card>
              ))}
            </CardDeck>
          )}
        </Row>
      </Container>
    </>
  );
};

export default Home;
