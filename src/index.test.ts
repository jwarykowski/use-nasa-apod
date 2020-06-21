import { renderHook } from '@testing-library/react-hooks'

import { useNasaAPOD } from './'

const fixture = {
  date: '2020-06-20',
  explanation: `Today's solstice brings summer to planet Earth's northern hemisphere. But
  the northern summer solstice arrived for ringed planet Saturn over three
    years ago on May 24, 2017. Orbiting the gas giant, Saturn's moon Titan
  experiences the Saturnian seasons that are about 7 Earth-years long. Larger
  than inner planet Mercury, Titan was captured in this Cassini spacecraft
  image about two weeks after its northern summer began. The near-infrared view
  finds bright methane clouds drifting through Titan's dense, hazy atmosphere
  as seen from a distance of about 507,000 kilometers. Below the clouds, dark
  hydrocarbon lakes sprawl near its fully illuminated north pole.`,
  hdurl: 'https://apod.nasa.gov/apod/image/2006/PIA21615TitanNorthSummer.jpg',
  media_type: 'image',
  service_version: 'v1',
  title: 'Northern Summer on Titan',
  url: 'https://apod.nasa.gov/apod/image/2006/PIA21615TitanNorthSummer1024.jpg',
}

beforeEach(() => fetch.resetMocks())

it('throws an error when no apiKey defined', () => {
  const { result } = renderHook(() => useNasaAPOD({ apiKey: null }))

  expect(result.error).toMatchInlineSnapshot(
    `[Error: useNasaAPOD - api key must be defined!]`,
  )
})

it('fetches on initialisation', async () => {
  fetch.mockResponseOnce(JSON.stringify({ data: fixture }))

  const { result, waitForNextUpdate } = renderHook(() =>
    useNasaAPOD({ apiKey: 'api-key' }),
  )

  await waitForNextUpdate()

  expect(fetch.mock.calls.length).toEqual(1)
  expect(fetch.mock.calls[0][0]).toMatchInlineSnapshot(
    `"https://api.nasa.gov/planetary/apod?api_key=api-key"`,
  )

  expect(result.current.data.data).toEqual(fixture)
  expect(result.current.error).toEqual(null)
})

it('fetches on initialisation with custom url', async () => {
  fetch.mockResponseOnce(JSON.stringify({ data: fixture }))

  const { result, waitForNextUpdate } = renderHook(() =>
    useNasaAPOD({ apiKey: 'api-key', apiUrl: 'https://testing.com' }),
  )

  await waitForNextUpdate()

  expect(fetch.mock.calls[0][0]).toMatchInlineSnapshot(
    `"https://testing.com?api_key=api-key"`,
  )
})

it('handles request error', async () => {
  fetch.mockResponseOnce(JSON.stringify({ data: {} }), {
    status: 400,
    statusText: 'bad request',
  })

  const { result, waitForNextUpdate } = renderHook(() =>
    useNasaAPOD({ apiKey: 'api-key' }),
  )

  await waitForNextUpdate()

  expect(fetch.mock.calls.length).toEqual(1)
  expect(result.current.error).toMatchInlineSnapshot(
    `[RequestError: useNasaAPOD - request failed]`,
  )

  expect(result.current.error.status).toEqual(400)
  expect(result.current.error.statusText).toEqual('bad request')
})

it('handles thrown request error', async () => {
  fetch.mockRejectOnce(new Error('Unknown error'))

  const { result, waitForNextUpdate } = renderHook(() =>
    useNasaAPOD({ apiKey: 'api-key' }),
  )

  await waitForNextUpdate()

  expect(fetch.mock.calls.length).toEqual(1)
  expect(result.current.error).toMatchInlineSnapshot(`[Error: Unknown error]`)
})
