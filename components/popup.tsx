import { gql, useQuery } from '@apollo/client'
import Box from '@mui/material/Box'
import CloseIcon from '@mui/icons-material/Close'
import Typography from '@mui/material/Typography'

const GET_POKEMON = gql`
  query ($id: Int!) {
    pokemon: pokemon_v2_pokemonspecies_by_pk(id: $id) {
      has_gender_differences
      base_happiness
      capture_rate
      evolution_chain_id
      evolves_from_species_id
      forms_switchable
      gender_rate
      generation_id
      growth_rate_id
      hatch_counter
      id
      is_baby
      is_legendary
      is_mythical
      order
      name
      pokemon_color_id
      pokemon_habitat_id
      pokemon_shape_id
    }
  }
`

type Props = {
  id: number
  onClose: () => void
}

export function Popup({id, onClose}: Props) {
  const { loading, error, data } = useQuery(GET_POKEMON, {variables: {id}})

  if (loading) return <div>Loading...</div>
  if (error || !data) return <div>Error! {error.message}</div>

  const { pokemon: {name, ...pokemon} } = data;

  return (
    <Box sx={{ p: 2 }}>
      <Box onClick={onClose} sx={{ cursor: 'pointer', position: 'absolute', right: 10 }}>
        <CloseIcon />
      </Box>
      <Box justifyContent="space-around">
        <Typography variant="h5" sx={{ display: 'inline-block', mr: 2 }}>{id}: </Typography>
        <Typography variant="h3" sx={{ display: 'inline-block' }}>{name}</Typography>
      </Box>
      <pre>{JSON.stringify(pokemon, null, 2)}</pre>
    </Box>
  )
}