import { useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import {
  Container,
  Button,
  Spinner,
  Row,
  Col,
  Table,
  Modal,
  Collapse,
  Alert,
} from "react-bootstrap";
import { Form, Formik } from "formik";
import { useParams } from "react-router-dom";
import { ShowReviews, SubmitReview } from "../../graphql/graphql";
import Error from "../Error";
import InputField from "../../components/Input";
import { toErrorMap } from "../../utils/toErrorMap";
import moment from "moment";

const Dashboard = () => {
  const id = useParams();
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null,
  });
  const { loading, error, data, fetchMore } = useQuery(ShowReviews, {
    variables,
  });
  const [SubmitReviewMutation, _] = useMutation(SubmitReview);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const handleVisible = () => {
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3500);
  };
  if (error) {
    return <Error />;
  }

  return (
    <>
      <title>Dashboard</title>

      {showAlert ? (
        <Collapse in={showAlert}>
          <Row
            className="justify-content-md-center"
            style={{
              position: "fixed",
              left: 0,
              width: "100%",
            }}
          >
            <Col md={4}>
              <Alert show={showAlert} variant="success" dismissible fixed-top>
                <strong>Success!</strong> Your review is successfully submited!
                Thank you for your time!
              </Alert>
            </Col>
          </Row>
        </Collapse>
      ) : null}

      <Modal
        className="new-review-modal"
        show={showModal}
        onHide={() => {
          setShowModal(false);
        }}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>New review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              title: "",
              review: "",
            }}
            onSubmit={async (values, { setErrors }) => {
              const response = await SubmitReviewMutation({
                variables: {
                  title: values.title,
                  review: values.review,
                },
                refetchQueries: [{ query: ShowReviews, variables: variables }],
              });

              if (response.data?.submitReview.errors) {
                setErrors(toErrorMap(response.data.submitReview.errors));
              } else {
                setShowModal(false);
                handleVisible();
              }
            }}
          >
            {({ isSubmitting, errors }) => (
              <Form className="review-form">
                <InputField
                  label="Title"
                  name="title"
                  type="text"
                  textarea={false}
                  error={errors.title}
                />

                <InputField
                  label="Review:"
                  name="review"
                  textarea={true}
                  rows={10}
                  error={errors.review}
                />
                <Button
                  className="ml-auto"
                  style={{ marginTop: "1rem" }}
                  type="submit"
                  disabled={isSubmitting}
                >
                  {!isSubmitting && "Submit review"}
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
            )}
          </Formik>
        </Modal.Body>
      </Modal>
      <Container fluid style={{ backgroundColor: "#2ed15a" }}>
        <header className="masthead text-white text-center">
          <div className="container d-flex align-items-center flex-column">
            <h1 className="masthead-heading text-uppercase">Dashboard</h1>
            <div className="divider-custom divider-light">
              <div className="divider-custom-line"></div>
              <div className="divider-custom-line"></div>
            </div>
          </div>
        </header>
      </Container>
      <Container className="my-reviews">
        <Button
          style={{
            marginBottom: "2rem",
          }}
          onClick={() => {
            setShowModal(true);
          }}
        >
          New
        </Button>
        <Table striped bordered>
          <thead>
            <tr>
              <th>Title</th>
              <th>Review</th>
              <th>Created at</th>
              <th>Updated at</th>
            </tr>
          </thead>
          {loading && !data ? (
            <tbody className="text-center">
              <Spinner animation="grow" />
            </tbody>
          ) : (
            <tbody>
              {!data
                ? "Greska"
                : data.showReviews.review.map((index) => (
                    <tr>
                      <td>{index.title}</td>
                      <td>{index.Review}</td>
                      <td>
                        {moment.unix(index.createdAt).toDate().toDateString()}
                      </td>
                      <td>
                        {moment.unix(index.updatedAt).toDate().toDateString()}
                      </td>
                    </tr>
                  ))}
            </tbody>
          )}
        </Table>
        {data && data.showReviews.hasMore ? (
          <Button
            onClick={() =>
              fetchMore({
                variables: setVariables({
                  limit: variables?.limit,
                  cursor:
                    data.showReviews.review[data.showReviews.review.length - 1]
                      .createdAt,
                }),
              })
            }
          >
            {loading ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              "Load more"
            )}
          </Button>
        ) : null}
      </Container>
    </>
  );
};

export default Dashboard;
