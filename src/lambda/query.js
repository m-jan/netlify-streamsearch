import fetch from "node-fetch";

const JW_BASE_QUERY = 'https://apis.justwatch.com/content/titles/en_GB/popular?body=%7B%22content_types%22:%5B%22show%22,%22movie%22%5D,%22page%22:1,%22page_size%22:12,%22query%22:%22'
const TMDB_API_KEY = process.env.TMDB_API_KEY 

const providers = [8,39,9,103,38,137,41,129,99]

function filterOffers(offers) {
  const uniqueOfferIds = Array.from(new Set(offers.map(offer => offer.provider_id)))
  const availableOfferIds = uniqueOfferIds.filter(id => providers.includes(id))
  return availableOfferIds
}

async function fetchPosters(item) {
  const { object_type, original_release_year, title } = item
  const url = `https://api.themoviedb.org/3/search/${object_type === 'movie' ? 'movie' : 'tv'}?api_key=${TMDB_API_KEY}&language=en-US&page=1&include_adult=false&query=${encodeURI(title)}&${object_type === 'movie' ? 'year' : 'first_air_date_year'}=${original_release_year}`

  const resJSON = await fetch(url)
  const response = await resJSON.json()
  if(response.results[0].poster_path != null) {
    return `https://image.tmdb.org/t/p/w154${response.results[0].poster_path}`
  } else {
    return ''
  }
}

async function fetchResults(query) {
  let responseJSON = await fetch(`${JW_BASE_QUERY}${encodeURI(query)}%22%7D`)
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
