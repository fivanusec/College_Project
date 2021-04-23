import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Logout as LogoutMutation, Me } from "../graphql/graphql";

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bg: "transparent",
      variant: "dark",
      style: {
        color: "white",
      },
      user: null,
    };
  }
  handleScroll = () => {
    if (window.scrollY === 0) {
      this.setState({
        bg: "transparent",
        variant: "dark",
        style: {
          color: "white",
        },
      });
    } else if (window.scrollY > 0) {
      this.setState({
        bg: "light",
        variant: "light",
        style: {
          color: "#2ed15a",
          borderColor: "#2ed15a",
        },
      });
    }
  };
  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  render() {
    return (
      <Navbar
        fixed="top"
        bg={this.props.bg ? this.props.bg : this.state.bg}
        variant={this.state.variant}
        expand="md"
      >
        <Navbar.Brand style={this.state.style} href="/">
          P!
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="nav ml-auto" activeKey={window.location.pathname}>
            <Nav.Link style={this.state.style} href="/">
              Home
            </Nav.Link>
            <Nav.Link style={this.state.style} href="/aboutus">
              About us
            </Nav.Link>
            <Nav.Link style={this.state.style} href="/contact">
              Contact us
            </Nav.Link>
            {this.props.user ? (
              <>
                <Nav.Link
                  style={this.state.style}
                  href={"/dashboard/" + this.props.user.id}
                >
                  {this.props.user.Name + " " + this.props.user.Surname}
                </Nav.Link>
                <Nav.Link
                  style={this.state.style}
                  onClick={async () => {
                    this.props.client
                      .mutate({
                        mutation: LogoutMutation,
                        refetchQueries: [{ query: Me }],
                      })
                      .then((result) => {
                        if (!result.data?.logout) {
                          console.log(result.data.logout);
                        }
                        if (
                          this.props.location.pathname.includes("/dashboard/")
                        ) {
                          this.props.router.push("/");
                        }
                      });
                  }}
                >
                  Logout
                </Nav.Link>
              </>
            ) : (
              <Nav.Link style={this.state.style} href="/login">
                Sign in
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Navigation;
