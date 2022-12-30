import { useState } from 'react'

export const SORT_ORDER = {
  START_CLOSEST: {
    value: 'start_at.closest',
    label: 'Happening soon first',
  },
  CREATED_NEWEST: {
    value: 'created_at.newest',
    label: 'Recently created first',
  },
}

export function useSortAudioChats() {
  return useState(SORT_ORDER.START_CLOSEST)
}
