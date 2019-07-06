// eslint-disable-next-line no-unused-vars
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
// Put any other imports below so that CSS from your
// components takes precedence over default styles.
// eslint-disable-next-line no-unused-vars
import App from './App';
import * as serviceWorker from './serviceWorker';

import graphqlClient from './graphql-client';
import {ACCESS_TOKEN_PARAM} from './graphql-client/index';

// eslint-disable-next-line no-unused-vars
import {Provider} from 'react-redux';
import store from './redux/store/index';

// import gql from 'graphql-tag';
// eslint-disable-next-line no-unused-vars
import {ApolloProvider} from 'react-apollo';
// import Flatted from 'flatted';
// import {phoenixSocket} from './graphql-client/absinthe-socket-link';


window.localStorage.removeItem(ACCESS_TOKEN_PARAM);

// graphqlClient.mutate({
//   variables: { },
//   mutation: gql`
//     mutation {
//       login(email: "asm@example.com", password: "altosecreto") {
//         token
//       }
//     }`,
// })
//     .then((result) => {
//       window.localStorage.setItem('token', result.data.login.token);
//     })
//     .catch((e) => {
//       if (Object.entries(e).length === 0) {
//         console.log('Access denied!');
//       } else {
//         console.log('Custom error: ' + e);
//       }
//     });

ReactDOM.render(
    <ApolloProvider client={graphqlClient}>
      <Provider store={store}>
        <App />
      </Provider>
    </ApolloProvider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
