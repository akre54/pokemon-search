import { ApolloProvider } from '@apollo/client'
import { ThemeProvider } from '@mui/material'

import theme from 'styles/theme'
import 'styles/globals.css'
import {useApollo} from 'middleware/apollo-client'

function MyApp({ Component, pageProps }) {
  const apolloClient = useApollo(pageProps)

  return (
    <ThemeProvider theme={theme}>
      <ApolloProvider client={apolloClient}>
        <Component {...pageProps} />
      </ApolloProvider>
    </ThemeProvider>
  )
}

export default MyApp
