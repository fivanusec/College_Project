import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router } from "react-router-dom";
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client";

import App from "./App";

const client = new ApolloClient({
  link: createHttpLink({
    uri: "http://localhost:4000/graphql",
    credentials: "include",
  }),
  cache: new InMemoryCache({
    typePolicies:{
      Query:{
        fields:{
          review:{
            keyArgs:[],
            merge(existing, incoming){
              console.log("Existing: ", existing);
              console.log("Incoming: ", incoming);
              return {
                ...incoming,
                review: [...(existing?.review || []), ...incoming?.review],
              }
            }
          }
        }
      }
    }
  })
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Router>
      <App client={client} />
    </Router>
  </ApolloProvider>,
  document.getElementById("root")
);
