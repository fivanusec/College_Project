import React from "react";
import Routes from "../src/components/Routes";
import Navigation from "../src/components/Navigation";
import Footer from "../src/components/Footer";
import { Container, Row, Col } from "react-bootstrap";
import { useQuery } from "@apollo/client";
import { Me } from "./graphql/graphql";
import { useHistory, useLocation } from "react-router-dom";

const App = (props) => {
  const { data } = useQuery(Me);
  const location = useLocation();
  const router = useHistory();
  return (
    <>
      <Navigation
        user={data?.me}
        client={props.client}
        location={location}
        router={router}
      />
      <Routes />
      <Container>
        <Row>
          <Col>
            <Footer />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default App;
