import create from 'zustand'
import { persist } from 'zustand/middleware'

export type Team = (number | null)[]
interface TeamState {
  team: Team
  addToTeam: (id: number) => void
  removeFromTeam: (id: number) => void
}

export const initialState = new Array(6).fill(null)

const dummyStorageApi = {
  getItem: () => JSON.stringify({ team: initialState }),
  setItem: () => undefined,
  removeItem: () => undefined,
}

export const useStore = create<TeamState>()(
  persist(
    (set) => ({
      team: initialState,
      addToTeam: (id) =>
        set(({ team }) => {
          const existing = team.indexOf(id)
          const i = team.indexOf(null)
          if (existing !== -1 || i === -1) return { team }
          return { team: [...team.slice(0, i), id, ...team.slice(i + 1)] }
        }),
      removeFromTeam: (id) =>
        set(({ team }) => {
          const i = team.indexOf(id)
          return { team: [...team.slice(0, i), null, ...team.slice(i + 1)] }
        }),
    }),
    {
      name: 'team',
      getStorage: () =>
        typeof window !== 'undefined' ? window.localStorage : dummyStorageApi,
    }
  )
)
