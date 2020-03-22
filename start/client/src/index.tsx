import { ApolloClient } from 'apollo-client';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
// import gql from "graphql-tag";
import { ApolloProvider } from '@apollo/react-hooks';
import React from 'react';
import ReactDOM from 'react-dom'; 
import Pages from './pages';
import injectStyles from './styles';
import { resolvers, typeDefs } from './resolvers';
// import Login from './pages/login';

import styled from 'react-emotion';
import { useApolloClient } from '@apollo/react-hooks';

import { menuItemClassName }  from './components/menu-item';
import { ReactComponent as ExitIcon } from './assets/icons/exit.svg';


const cache = new InMemoryCache();
/* const link = new HttpLink({
  uri: 'http://localhost:4000/'
}); */

/* const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  link
}); */

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    cache,
    link: new HttpLink({
      uri: 'http://localhost:4000/graphql',
      headers: {
        authorization: localStorage.getItem('token'),
      },
    }),
    typeDefs,
    resolvers,
  });
  
  cache.writeData({
    data: {
      isLoggedIn: !!localStorage.getItem('token'),
      cartItems: [],
    },
  });

/*   const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`; */

/* function IsLoggedIn() {
  const { data } = useQuery(IS_LOGGED_IN);
  return data.isLoggedIn ? <Pages /> : <Login />;
} */

/* client
  .query({
    query: gql`
      query GetLaunch {
        launch(id: 56) {
          id
          mission {
            name
          }
        }
      }
    `
  })
  .then(result => console.log(result)); */

  export default function LogoutButton() {
    const client = useApolloClient();
    return (
      <StyledButton
        onClick={() => {
          client.writeData({ data: { isLoggedIn: false } });
          localStorage.clear();
        }}
      >
        <ExitIcon />
        Logout
      </StyledButton>
    );
  }
  
  const StyledButton = styled('button')(menuItemClassName, {
    background: 'none',
    border: 'none',
    padding: 0,
  });

  injectStyles();
ReactDOM.render(
  <ApolloProvider client={client}>
    <Pages />
  </ApolloProvider>, 
  document.getElementById('root')
);