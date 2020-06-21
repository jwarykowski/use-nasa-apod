import { useEffect, useState } from 'react'

const NASA_APOD_URL = 'https://api.nasa.gov/planetary/apod'

const defaultState = { data: null, error: null, isResolving: false }

export default useNasaAPOD

interface useNasaAPOD {
  apiKey: string
  apiUrl?: string
}

export function useNasaAPOD({ apiKey, apiUrl = NASA_APOD_URL }: useNasaAPOD) {
  const [state, setState] = useState(defaultState)

  if (!apiKey) {
    throw new Error('useNasaAPOD - api key must be defined!')
  }

  useEffect(function () {
    async function fetchData() {
      setState({ ...defaultState, isResolving: true })

      try {
        const response = await fetch(`${apiUrl}?api_key=${apiKey}`)

        if (!response.ok) {
          throw new RequestError({
            message: 'useNasaAPOD - request failed',
            status: response.status,
            statusText: response.statusText,
          })
        }

        const json = await response.json()

        setState({ ...defaultState, data: json })
      } catch (error) {
        setState({ ...defaultState, error })
      }
    }

    fetchData()
  }, [])

  return state
}

interface RequestError extends Error {
  name: string
  message: string
  status: number
  statusText: string
  constructor({
    message,
    status,
    statusText,
  }: {
    message: string
    status: number
    statusText: string
  })
}

class RequestError extends Error {
  constructor({ message, status, statusText }) {
    super(message)
    this.name = this.constructor.name
    this.status = status
    this.statusText = statusText
  }
}
