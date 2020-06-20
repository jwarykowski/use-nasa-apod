import { useEffect, useState } from 'react'

const NASA_APOD_URL = 'https://api.nasa.gov/planetary/apod'

export default useNasaAPOD

export function useNasaAPOD({ apiKey, apiUrl = NASA_APOD_URL }) {
  const [data, setData] = useState(null)

  useEffect(function () {
    async function fetchData() {
      const response = await fetch(`${apiUrl}?api_key=${apiKey}`)
      const json = await response.json()
      setData(json)
    }

    fetchData()
  }, [])

  return data
}
