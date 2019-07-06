import ApolloClient from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {ApolloLink} from 'apollo-link';
import {setContext} from 'apollo-link-context';
import {createHttpLink} from 'apollo-link-http';
import {hasSubscription} from '@jumpn/utils-graphql';
import absintheSocketLink from './absinthe-socket-link';

export const HTTP_SERVER_URI = 'http://localhost:4000/api';
export const ACCESS_TOKEN_PARAM = 'token';

// Create an HTTP link to the Absinthe server.
const httpLink = createHttpLink({
  uri: HTTP_SERVER_URI,
});

// Use setContext to create a chainable link object that sets
// the token cookie to the Authorization header.
const authLink = setContext((_, {headers}) => {
  // Get the authentication token from local storage if it exists.
  const token = window.localStorage.getItem(ACCESS_TOKEN_PARAM);

  // Add the new Authorization header.
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Chain the HTTP link and the authorization link.
const authHttpLink = authLink.concat(httpLink);

// eslint-disable-next-line new-cap
const link = new ApolloLink.split(
    (operation) => hasSubscription(operation.query),
    absintheSocketLink,
    authHttpLink
);

export default new ApolloClient({
  link,
  cache: new InMemoryCache(),
});
