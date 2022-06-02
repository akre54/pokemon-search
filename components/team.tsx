import { useState, useRef, useEffect } from 'react'
import { gql } from '@apollo/client'
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import CancelIcon from '@mui/icons-material/Cancel'
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn'
import Popover from '@mui/material/Popover'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { Popup } from 'components/popup'
import { apolloClient } from 'middleware/apollo-client'
import { initialState, useStore } from 'reducers/team'

import styles from 'styles/Team.module.css'

function RosterPokemon({id}) {
  const removeFromTeam = useStore(state => state.removeFromTeam)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>()

  if (id === null) {
    return (
      <Stack direction="column" spacing={1} alignItems="center">
        <DoDisturbOnIcon sx={{ fontSize: 64 }} />
        <Typography variant="subtitle1">Empty</Typography>
      </Stack>
    )
  }

  const {name} = apolloClient.readFragment({
    id: `pokemon_v2_pokemonspecies:${id}`,
    fragment: gql`
      fragment RosterPokemon on pokemon_v2_pokemonspecies {
        id
        name
      }
    `,
  })

  return (
    <Stack
      direction="column"
      spacing={1}
      alignItems="center"
      aria-owns={open ? 'popover' : undefined}
      aria-haspopup="true"
      sx={{ cursor: 'pointer' }}
      >
      <Popover
        id="popover"
        open={open}
        anchorEl={ref.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        onClose={() => setOpen(false)}
      >
        <Popup id={id} onClose={() => setOpen(false)} />
      </Popover>
      <Badge
        overlap="circular"
        ref={ref}
        onClick={() => setOpen(true)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        badgeContent={
          <CancelIcon onClick={() => removeFromTeam(id)} />
        }
      >
        <Avatar
          alt={name}
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
          sx={{ bgcolor: 'inherit', width: 64, height: 64 }}
        />
      </Badge>
      <Typography variant="subtitle1">{name}</Typography>
    </Stack>
  )
}

export function Team() {
  const [team, setTeam] = useState(initialState)
  const _team = useStore(state => state.team)

  // Fix for next ssr rehydration issue with zustand persist
  useEffect(() => {
    setTeam(_team)
  }, [_team])

  return (
    <Stack className={styles.team} direction="row" spacing={4}>
      {team.map((id, i) => (
        <RosterPokemon key={id || `empty-${i}`} id={id} />
      ))}
    </Stack>
  )
}
