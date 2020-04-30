import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/main.scss';
import { ApolloProvider } from '@apollo/react-hooks';
import client from './lib/apollo/client';

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root'),
);
