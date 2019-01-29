import React, { Component, Fragment } from 'react';
import nanoid from 'nanoid';
import './App.css';


const SearchProviderList = (props) => {
  const providerList = PROVIDERS.map(provider => (
    <div key={provider.key} className="search-provider">
        <a href={provider.url}>
          <img className="provider-image" src={provider.icon} alt={provider.name} />
          <p className="provider-title">{provider.name}</p>
        </a>
    </div>
  ))

  return (
    <div className="search-provider-list">
      {providerList}
    </div>
  )
}

class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.handleSearchValueChange = this.handleSearchValueChange.bind(this)
  }

  handleSearchValueChange(e) {
    this.props.onSearchValueChange(e.target.value)
  }
  
  render() {
    return (
      <form className="search-form" onSubmit={this.props.onSearchSubmit}>
        <input 
          className="search-input" type="text" required placeholder="Try 'Jurassic Park'..."
          value={this.props.searchValue} onChange={this.handleSearchValueChange}
        />
        <button type="button" className="search-button">
          {this.props.isLoading ? <i className="loading-icon fas fa-spinner fa-spin fa-2x"></i> : "search" }
        </button>
      </form>
    )
  }
}
const SearchContainer = (props) => (
  <div className="search-container">
    <SearchForm 
      searchValue={props.searchValue} 
      onSearchValueChange={props.onSearchValueChange}
      onSearchSubmit={props.onSearchSubmit}
      isLoading={props.isLoading}
    />
    <div className="search-divider"></div>
    <p className="search-num-providers">Search across {PROVIDERS.length} providers.</p>
    <SearchProviderList />
    <p className="search-footer">Click to visit provider's website</p>
  </div>  
)

const ResultProviderList = (props) => {
  const providers = props.providers.map(provider => (
    <a key={nanoid()} href={PROVIDER_URLS[provider]}>
      <img className="provider-image" src={PROVIDER_ICON_URLS[provider]} alt="" />
    </a>
  ))

  const unavailable = <div className="provider-unavailable">Unavailable</div>

  return (
    <div className="result-provider-list">
      {providers.length ? providers : unavailable}
    </div>
  )
}

const ResultContainer = (props) => {
  const resultCards = props.results.map(result => (
    <div key={nanoid()} className="result-card">
        <img className="result-image" src={result.poster} alt={result.title} />
        <div className="result-info">
            <div className="result-desc">
                <p className="result-title">{result.title}</p>
                <p className="result-year">{result.year}</p>
            </div>
            <ResultProviderList providers={result.providers} />
        </div>
    </div>
  ))

  return (
    <div className="result-container">
      {resultCards}
    </div>
  )
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      results: [],
      hasSearched: false,
      isLoading: false,
      errorLoading: false
    }

    this.handleSearchValueChange = this.handleSearchValueChange.bind(this)
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
  }

  handleSearchValueChange(searchValue) {
    this.setState({
      searchValue: searchValue
    })
  }

  handleSearchSubmit(e) {
    const query = this.state.searchValue;
    e.preventDefault();
    document.getElementsByClassName('search-input')[0].blur() //Remove focus from input
    this.setState({ 
      isLoading: true,
      errorLoading: false,
    })
    fetch('/.netlify/functions/query', {body: query, method: "POST"})
      .then(response => response.json())
      .then(results => this.setState({ 
        results: results,
        isLoading: false,
        hasSearched: true
      }))
      .catch(error => this.setState({
        errorLoading: true,
        isLoading: false
      }))
  }

  render() {
    return (
      <div className="container">
        <div className="hero">
            <a className="github-link" href="https://github.com/m-jan/netlify-streamsearch">
                <img src="/img/GitHub-Mark-Light-32px.png" alt=""></img>
            </a>
            <h1>Stream Search</h1>
            <h3>
                Find your favourite movies and shows on streaming platforms.
            </h3>
        </div>
        <SearchContainer 
          searchValue={this.state.searchValue} 
          onSearchValueChange={this.handleSearchValueChange}
          onSearchSubmit={this.handleSearchSubmit}
          isLoading={this.state.isLoading}
        />
        
        {this.state.errorLoading ?
          <div className="result-error">
            <p>Sorry something went wrong! :( </p>
            <p>Try a different search!</p>
          </div> :
          this.state.hasSearched && 
          <Fragment>
            <div className="result-number">{this.state.results.length} results found</div>
            <ResultContainer results={this.state.results} />
          </Fragment>
        }
    </div>
    )
  }
}

const PROVIDER_ICON_URLS = {
  "8" : "/img/netflix.jpeg",
  "39" : "/img/now-tv.jpeg",
  "9" : "/img/amazon-prime-video.jpeg",
  "103" : "/img/all-4.jpeg",
  "38" : "/img/bbc-iplayer.jpeg",
  "137" : "/img/uktv-play.jpeg",
  "41" : "/img/itv-player.jpeg",
  "129" : "/img/disneylife.jpeg",
  "99" : "/img/shudder.jpeg"
}

const PROVIDER_URLS = {
  "8" : "https://www.netflix.com/",
  "39" : "https://www.nowtv.com/",
  "9" : "https://www.primevideo.com/",
  "103" : "https://www.channel4.com/now",
  "38" : "https://www.bbc.co.uk/iplayer",
  "137" : "https://uktvplay.uktv.co.uk/",
  "41" : "https://www.itv.com/itvplayer/",
  "129" : "https://disneylife.com/",
  "99" : "https://try.shudder.com/uk/"
}

const PROVIDERS = [
  {
    "key" : 8,
    "name" : "Netflix",
    "url" : "https://www.netflix.com/",
    "icon" :  "/img/netflix.jpeg"
  },
  {
    "key" : 39,
    "name" : "NOW TV",
    "url" : "https://www.nowtv.com/",
    "icon" : "/img/now-tv.jpeg"
  },
  {
    "key" : 9,
    "name" : "Prime", 
    "url" : "https://www.primevideo.com/",
    "icon" : "/img/amazon-prime-video.jpeg",
  },
  {
    "key" : 103,
    "name" : "All 4",
    "url" : "https://www.channel4.com/now",
    "icon" : "/img/all-4.jpeg"
  },
  {
    "key" : 38,
    "name" : "BBC iPlayer",
    "url" :  "https://www.bbc.co.uk/iplayer",
    "icon" : "/img/bbc-iplayer.jpeg"
  },
  {
    "key" : 129,
    "name" : "Disney", 
    "url" : "https://disneylife.com/",
    "icon" : "/img/disneylife.jpeg"
  },
  {
    "key" : 99,
    "name" : "Shudder",
    "url" : "https://try.shudder.com/uk/",
    "icon" : "/img/shudder.jpeg"
  },
  {
    "key" : 41,
    "name" : "ITV Play",
    "url" : "https://www.itv.com/itvplayer/",
    "icon" : "/img/itv-player.jpeg"
  },
  {
    "key" : 137,
    "name" : "UKTV Play",
    "url" : "https://uktvplay.uktv.co.uk/",
    "icon" : "/img/uktv-play.jpeg"
  }
]

export default App 
