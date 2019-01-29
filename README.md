## [Stream Search](www.stream-search.io)

Stream Search allows users to search for the availability of movies and TV shows across streaming providers. It currently searches the UK libraries of the following streaming providers:

* [Netflix](https://www.netflix.com/)
* [NOW TV](https://www.nowtv.com/)
* [Prime Video](https://www.primevideo.com/)
* [Disney Life](https://disneylife.com/)
* [Shudder](https://try.shudder.com/uk/)
* [BBC IPlayer](https://www.bbc.co.uk/iplayer)
* [All 4](https://www.channel4.com/now)
* [ITV Player](https://www.itv.com/itvplayer/)
* [UKTV Player](https://uktvplay.uktv.co.uk/)

### Development
Stream Search is a ReactJS app hosted on Netlify, and is built on top of the [create-react-app-lambda](https://github.com/netlify/create-react-app-lambda) skeleton. Responsive layout is simply Flexbox, no CSS libraries are used. 

Searches are performed using [Netlify Functions](https://www.netlify.com/docs/functions/) (using AWS Lambda under the hood). Queries are made to the [JustWatch API](www.justwatch.com/uk), which returns relevant results and provider availability. Request are also made to the [TMDB API](https://developers.themoviedb.org/3) to retrieve poster images.

JustWatch's data is not 100% accurate, particulary with the smaller providers.

### Installation
Given that this project is built using create-react-app, to build it simply clone the repository and start the development server using `yarn start`

Your TMDB API Key will need to be added as an environment variable

### About
Stream Search was created as a project to help me learn ReactJS and modern web development technologies. In the future I would like to collect availability data and create an API which has higher accuracy then the JustWatch API. 

Please let me know if you find any bugs or would like a feature added!
