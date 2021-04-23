import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import img from "../img/user.png";

class AboutUs extends React.Component {
  letterStyle = {
    position: "relative",
  };

  text = {
    columnOne:
      "Lorem ipsum pariatur consectetur laboris occaecat nulla aliqua irure ad deserunt duis. Eiusmod nulla cupidatat labore sint sit aute dolore irure nostrud ut incididunt. Anim laborum reprehenderit labore magna ut dolore quis irure. Labore ea duis deserunt ullamco irure fugiat deserunt ut nisi ea minim proident. Nisi consectetur do non magna duis aliqua minim minim veniam. In occaecat minim qui consequat elit mollit consectetur non id tempor. Amet adipisicing occaecat tempor culpa quis est duis.",
    columnTwo:
      "Lorem ipsum pariatur consectetur laboris occaecat nulla aliqua irure ad deserunt duis. Eiusmod nulla cupidatat labore sint sit aute dolore irure nostrud ut incididunt. Anim laborum reprehenderit labore magna ut dolore quis irure. Labore ea duis deserunt ullamco irure fugiat deserunt ut nisi ea minim proident. Nisi consectetur do non magna duis aliqua minim minim veniam. In occaecat minim qui consequat elit mollit consectetur non id tempor. Amet adipisicing occaecat tempor culpa quis est duis.",
    devs: [
      {
        name: "Hi my name is Dev 1",
        about:
          "Lorem ipsum pariatur consectetur laboris occaecat nulla aliqua irure ad deserunt duis. Eiusmod nulla cupidatat labore sint sit aute dolore irure nostrud ut incididunt. Anim laborum reprehenderit labore magna ut dolore quis irure. Labore ea duis deserunt ullamco irure fugiat deserunt ut nisi ea minim proident. Nisi consectetur do non magna duis aliqua minim minim veniam. In occaecat minim qui consequat elit mollit consectetur non id tempor. Amet adipisicing occaecat tempor culpa quis est duis.",
      },
      {
        name: "Hi my name is Dev 2",
        about:
          "Lorem ipsum pariatur consectetur laboris occaecat nulla aliqua irure ad deserunt duis. Eiusmod nulla cupidatat labore sint sit aute dolore irure nostrud ut incididunt. Anim laborum reprehenderit labore magna ut dolore quis irure. Labore ea duis deserunt ullamco irure fugiat deserunt ut nisi ea minim proident. Nisi consectetur do non magna duis aliqua minim minim veniam. In occaecat minim qui consequat elit mollit consectetur non id tempor. Amet adipisicing occaecat tempor culpa quis est duis.",
      },
      {
        name: "Hi my name is Dev 3",
        about:
          "Lorem ipsum pariatur consectetur laboris occaecat nulla aliqua irure ad deserunt duis. Eiusmod nulla cupidatat labore sint sit aute dolore irure nostrud ut incididunt. Anim laborum reprehenderit labore magna ut dolore quis irure. Labore ea duis deserunt ullamco irure fugiat deserunt ut nisi ea minim proident. Nisi consectetur do non magna duis aliqua minim minim veniam. In occaecat minim qui consequat elit mollit consectetur non id tempor. Amet adipisicing occaecat tempor culpa quis est duis.",
      },
    ],
  };

  render() {
    return (
      <>
        <title>About us</title>
        <Container fluid style={{ backgroundColor: "#2ed15a" }}>
          <header className="masthead text-white text-center">
            <div className="container d-flex align-items-center flex-column">
              <h1
                className="masthead-heading text-uppercase"
                style={this.letterStyle}
              >
                Meet us
              </h1>
              <div className="divider-custom divider-light">
                <div className="divider-custom-line"></div>
                <div className="divider-custom-line"></div>
              </div>
            </div>
          </header>
        </Container>
        <Container className="text-center">
          <header className="intro-about-header">
            <h1 className="intro-about-title">
              <span className="lines">Our story starts with good product!</span>
            </h1>
          </header>
          <Row className="aboutus align-items-center">
            <Col>{this.text.columnOne}</Col>
            <Col>{this.text.columnTwo}</Col>
          </Row>
        </Container>
        <Container className="text-center">
          <Row className="devs align-items-center">
            {this.text.devs.map((dev) => (
              <Col className="text-center">
                <Card
                  style={{
                    width: "18rem",
                    paddingBottom: "2rem",
                    borderRadius: "12px",
                  }}
                >
                  <Card.Img variant="top" src={img} />
                  <Card.Body>
                    <Card.Title>{dev.name}</Card.Title>
                    <Card.Text>{dev.about}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </>
    );
  }
}

export default AboutUs;
