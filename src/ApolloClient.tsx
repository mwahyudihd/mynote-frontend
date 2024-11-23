import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql', // Sesuaikan dengan URL GraphQL server Anda
  cache: new InMemoryCache(),
});

// Definisikan komponen ApolloClientProvider agar menerima children
interface ApolloClientProviderProps {
  children: React.ReactNode;
}

export const ApolloClientProvider: React.FC<ApolloClientProviderProps> = ({ children }) => (
  <ApolloProvider client={client}>
    {children}
  </ApolloProvider>
);
