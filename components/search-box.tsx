import { forwardRef, useState } from 'react'
import { gql, useLazyQuery } from '@apollo/client'
import AddIcon from '@mui/icons-material/Add'
import Autocomplete from '@mui/material/Autocomplete'
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { FixedSizeList as List } from 'react-window'

import { useStore, Team } from 'reducers/team'

type Pokemon = {
  id: number
  name: string
}

interface Props {
  pokemon: Pokemon[]
}

const GET_POKEMON = gql`
  query ($query: String) {
    pokemon: pokemon_v2_pokemonspecies (where: {name: {_ilike: $query}}) {
      id
      name
    }
  }
`

function isClickable(team: Team, id: number) {
  const isInTeam = team.includes(id)
  const teamIsFull = !team.includes(null)
  return !isInTeam && !teamIsFull
}

export function SearchBox({pokemon}: Props) {
  const [value, setValue] = useState('')
  const team = useStore(state => state.team)
  const addToTeam = useStore(state => state.addToTeam)

  // Note: this isn't strictly necessary because we have all the data,
  // but it's a cool demo to show server results can be combined with client results
  const [
    getFilteredPokemon,
    {loading, data}
  ] = useLazyQuery(GET_POKEMON)

  console.log(JSON.stringify(data))

  return (
    <Autocomplete
      sx={{ width: 300 }}
      value={value}
      options={pokemon}
      loading={loading}
      autoSelect
      blurOnSelect
      clearOnBlur
      clearOnEscape
      onInputChange={(_, text, reason) => {
        if (reason === 'reset') {
          setValue('')
          return
        } else {
          setValue(text)
        }
      }}
      onChange={(_, option: Pokemon) => {
        if (option && isClickable(team, option.id)) {
          addToTeam(option.id)
        }
      }}
      ListboxComponent={ListboxComponent}
      getOptionLabel={(option: Pokemon | string) => typeof option === 'string' ? option : option.name}
      renderOption={(props, pokemon) => ({props, pokemon, team} as any) }
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          label="Search"
          InputProps={{
            ...params.InputProps,
            onKeyUp: (e) => getFilteredPokemon({variables: {query: `%${e.currentTarget.value}%`}}),
          }}
          fullWidth
        />
      )}
    />
  );
}

function Row({style, index, data}) {
  const {props, pokemon, team} = data[index]
  const {name, id} = pokemon

  return (
    <Stack direction="row" alignItems="center" spacing={2} component="li" {...props} style={style}>
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={
          isClickable(team, id) ?
            <AddIcon /> :
            null
        }
      >
        <Avatar
          alt={name}
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
          sx={{ bgcolor: 'inherit', width: 64, height: 64 }}
        />
      </Badge>
      <Typography>{name}</Typography>
    </Stack>
  )
}

const ListboxComponent = forwardRef<HTMLUListElement, List>(
  ({ children, ...props }, _ref) => (
    <List
      {...props}
      ref={props.ref}
      height={300}
      itemData={children}
      itemCount={children.length}
      itemSize={64}
      width={300}
    >
      {Row}
    </List>
  ))
