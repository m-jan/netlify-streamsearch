import fetch from "node-fetch";

const TMDB_BASE_URL = 'https://api.themoviedb.org/3/search/'
const TMDB_LANG = '&language=en-US'
const TMDB_PAGE = '&page=1'
const TMDB_API_KEY = process.env.TMDB_API_KEY 

const JW_BASE_QUERY = 'https://apis.justwatch.com/content/titles/en_GB/popular?body='
const JW_SETTINGS = {
  content_types: ['show', 'movie'],
  page: 1,
  page_size: 12,
}

const providers = [8,39,9,103,38,137,41,129,99]

function filterOffers(offers) {
  const uniqueOfferIds = Array.from(new Set(offers.map(offer => offer.provider_id)))
  const availableOfferIds = uniqueOfferIds.filter(id => providers.includes(id))
  return availableOfferIds
}

async function fetchPosters(item) {
  const { object_type, original_release_year, title } = item
  const date_type = object_type === 'movie' ? 'year' : 'first_air_date_year'
  const format_type = object_type === 'movie' ? 'movie' : 'tv'
  
  const url = `${TMDB_BASE_URL}${format_type}?api_key=${TMDB_API_KEY}${TMDB_LANG}${TMDB_PAGE}
                &query=${encodeURI(title)}&${date_type}=${original_release_year}`

  const resJSON = await fetch(url)
  const response = await resJSON.json()
  if(response.results.length > 0 && response.results[0].poster_path) {
    return `https://image.tmdb.org/t/p/w154${response.results[0].poster_path}`
  } else {
    return ''
  }
}

async function fetchResults(query) {
  const query_settings = Object.assign(JW_SETTINGS, {'query': query})
  const jw_query_url = `${JW_BASE_QUERY}${encodeURI(JSON.stringify(query_settings))}`
  
  let responseJSON = await fetch(jw_query_url)
  let response = await responseJSON.json()

  const resultPromiseArray = response.items.map(async item => ({
      title: item.title,
      year: item.original_release_year || item.first_air_date_year,
      poster: await fetchPosters(item),
      providers: item.offers ? filterOffers(item.offers) : []
  }))

  const results = await Promise.all(resultPromiseArray)
  const resultsWithPosters = results.filter(result => result.poster !== '')
  return resultsWithPosters
}

export async function handler(event, context) {
  return fetchResults(event.body)
    .then(results => ({
      statusCode: 200,
      body: `${JSON.stringify(results)}`
    }))
    .catch(error => ({ statusCode: 422, body: String(error) }));
}