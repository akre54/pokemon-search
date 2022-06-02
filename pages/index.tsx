import { gql } from '@apollo/client'
import Head from 'next/head'
import Typography from '@mui/material/Typography'

import { initializeApollo, addApolloState } from 'middleware/apollo-client'
import { SearchBox } from 'components/search-box'
import { Team } from 'components/team'

import styles from 'styles/Home.module.css'

export async function getStaticProps() {
  const apolloClient = initializeApollo()

  try {
    const {data: {pokemon}} = await apolloClient.query({
      query: gql`
        query Pokemon {
          pokemon: pokemon_v2_pokemonspecies (order_by: {id: asc}) {
            id
            name
          }
        }
      `
    })

    return addApolloState(apolloClient, {
      props: {pokemon},
    })
  } catch (e) {
    console.log("SERVER ERROR", e)
    return {props: {pokemon: {}}}
  }
}

export default function Root({pokemon}) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Gotta Search Em All</title>
        <meta name="description" content="Pokemon Search" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Typography variant="h1">
        Gotta Search Em All
      </Typography>

      <SearchBox pokemon={pokemon} />

      <Team />
    </div>
  )
}
