import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import firebaseClient from "./firebaseClient";

const httpLink = createHttpLink({
  uri: "https://faith-adventures-api.herokuapp.com/graphql",
});

const authLink = setContext(async (_, { headers }) => {
  const token = await firebaseClient.auth().currentUser?.getIdToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default apolloClient;
