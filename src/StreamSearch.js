import React, { Component } from 'react';
import nanoid from 'nanoid';
import './App.css';

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.handleSearchValueChange = this.handleSearchValueChange.bind(this)
  }

  handleSearchValueChange(e) {
    this.props.onSearchValueChange(e.target.value)
  }

  render() {
    return (
    <div className="has-animation mb-3">
        <input type="text" className="form-control"
        value={this.props.searchValue} onChange={this.handleSearchValueChange}>
        </input>
        <button className="btn btn-secondary mt-4" type="button"
            onClick={this.props.onSearchSubmit}>SEARCH
        </button>
    </div>
    )
  }
}

const ProviderList = () => {
  const providerIconURLS = Object.values(PROVIDER_ICON_URLS)
  const providerIconList = providerIconURLS.map(url => (
    <div key={nanoid()} className="col-4 col-md-2 py-0">
      <img className="shadow-lg img-fluid m-1 rounded" src={url} alt=''></img>
    </div>
  ));

  return (
  <div>
    <div>
      <p className="pt-1 has-text-animation">Search across {providerIconList.length} streaming platforms.</p>
    </div>
    <div className="row px-4 has-animation" id="providers">
      {providerIconList}
    </div>
    

  </div>
  )
}
  

const SearchJumbotron = (props) => (
  <div className="jumbotron text-center">
    <div className="container">
    
      <h1 className="jumbotron-heading has-text-animation">Stream Search</h1>
      <p className="lead has-text-animation">Find where you can watch your favourite movies and shows on streaming platforms.</p>
      <div>
        <SearchBar 
          searchValue={props.searchValue} 
          onSearchValueChange={props.onSearchValueChange}
          onSearchSubmit={props.onSearchSubmit}
        />
        <ProviderList />
      </div>
    </div>
  </div>
)

const ProviderOverlay = ({ providers }) => {
  const resultProviderLinks = providers.map(provider => (
    <a key={nanoid()} style={{width: '35%', height: '35%'}} className="m-1" href={PROVIDER_URLS[provider]}>
      <img className="overlay-provider-icon img-fluid m-1 rounded" src={PROVIDER_ICON_URLS[provider]} alt=''></img>
    </a>
  ))

  const unavailableOverlay = <div className="h-25"><button type="button" className="overlay-provider-icon mb-4 btn btn-danger btn-block">Unavailable</button></div>

  return (
    <div className="card-img-overlay p-1 d-flex align-items-end justify-content-center flex-wrap align-content-end">
      {providers.length ? resultProviderLinks : unavailableOverlay}
    </div>
  )
}

const ResultCard = ({ resultData }) => (
  <div className="col-6 col-md-2">
    <div className="has-animation card my-4">
      <img className="card-img" src={resultData.poster} alt=''></img>
      <ProviderOverlay providers={resultData.providers} />
    </div>
  </div>
)

const SearchResults = ({ results, isLoading }) => {
  const resultCards = results.map(result => (
    <ResultCard key={nanoid()} resultData={result} />
  ))

  return (
  <div className="d-flex results-container align-items-center">
    <div className="container">
      <div className="row justify-content-center">
        { isLoading ? <Loading /> : resultCards }
      </div>
    </div>
  </div>
  )
}

class Loading extends Component {
  constructor(props) {
    super(props)
    this.scrollRef = React.createRef();
  } 

  componentDidMount() {
    this.scrollRef.current.scrollIntoView({behavior: "smooth"});
  }

  render() {
    return (
      <div className="loading-container" ref={this.scrollRef}>
        <i className="fas fa-spinner fa-spin fa-2x"></i>
      </div>
    )
  }
}


class StreamSearch extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchValue: '',
      results: [],
      isLoading: false
    }

    this.handleSearchValueChange = this.handleSearchValueChange.bind(this)
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
  }

  handleSearchValueChange(searchValue) {
    this.setState({
      searchValue: searchValue
    })
  }

  handleSearchSubmit() {
    const query = this.state.searchValue;
    this.setState({ isLoading: true })
    fetch('/.netlify/functions/query', {body: query, method: "POST"})
      .then(response => response.json())
      .then(results => this.setState({ 
        results: results,
        isLoading: false
      }))
  }

  render() {
    return (
      <main role="main">
        <SearchJumbotron 
          searchValue={this.state.searchValue} 
          onSearchValueChange={this.handleSearchValueChange}
          onSearchSubmit={this.handleSearchSubmit}
          />
        <SearchResults results={this.state.results} isLoading={this.state.isLoading}/>
      </main>
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
  

export default StreamSearch;
