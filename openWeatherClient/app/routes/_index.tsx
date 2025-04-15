import type { MetaFunction } from '@remix-run/node';
import { ApolloProvider, InMemoryCache, ApolloClient } from '@apollo/client';
import { useState, useEffect, createContext } from 'react';
import { Container } from '../components/Container';

export const meta: MetaFunction = () => {
  return [
    { title: 'Weather App' },
    { name: 'description', content: 'Open Weather App using GraphQL' },
  ];
};

export const ApolloClientContext = createContext<ApolloClient<any> | null>(
  null
);

export default function Index() {
  const [client, setClient] = useState<ApolloClient<any> | null>(null);

  useEffect(() => {
    const newClient = new ApolloClient({
      uri: 'http://localhost:4000/graphql',
      cache: new InMemoryCache(),
    });
    setClient(newClient);
  }, []);

  if (!client) {
    return (
      <div className='container mx-auto p-4'>Loading Apollo Client...</div>
    );
  }

  return (
    <ApolloProvider client={client}>
      <ApolloClientContext.Provider value={client}>
        <div className='container mx-auto p-4 flex flex-col items-center'>
          <h1 className='text-2xl font-bold mb-4'>5-day Weather Forecast</h1>
          <Container />
        </div>
      </ApolloClientContext.Provider>
    </ApolloProvider>
  );
}
