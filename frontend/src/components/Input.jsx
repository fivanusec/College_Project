import React from "react";
import { Form, FormControl } from "react-bootstrap";
import { useField } from "formik";

const InputField = ({ label, textarea, ...props }) => {
  const [field, { error }] = useField(props);
  return (
    <Form.Group>
      <Form.Label htmlFor={field.name}>{label}</Form.Label>
      <FormControl
        as={textarea ? "textarea" : "input"}
        {...field}
        {...props}
        id={field.name}
        isInvalid={!!props.error}
      />
      {props.error ? (
        <Form.Control.Feedback type="invalid">
          {props.error}
        </Form.Control.Feedback>
      ) : null}
    </Form.Group>
  );
};

export default InputField;
