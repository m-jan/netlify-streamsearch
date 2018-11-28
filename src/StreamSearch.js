import React, { Component } from 'react';
import nanoid from 'nanoid';
//import jw_search from './justwatchSearch'
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
      <div className="shadow-lg input-group mb-3">
        <input type="text" className="form-control"
        value={this.props.searchValue} onChange={this.handleSearchValueChange}>
        </input>
        <div className="input-group-append">
          <button className="btn btn-secondary" type="button" id="button-addon2"
            onClick={this.props.onSearchSubmit}>Search</button>
        </div>
    </div>
    )
  }
}

const ProviderList = () => {
  const providerIconURLS = Object.values(PROVIDER_ICON_URLS)
  const providerIconList = providerIconURLS.map(url => (
    <div key={nanoid()} className="col-4 col-md-2 py-0">
      <a href="#"><img className="shadow-lg img-fluid m-1 rounded" src={url}></img></a>
    </div>
  ));

  return (
  <div>
    <div>
      <p className="pt-1 text-muted">Search across {providerIconList.length} providers</p>
    </div>
    <div className="row px-4" id="providers">
      {providerIconList}
    </div>
    

  </div>
  )
}
  

const SearchJumbotron = (props) => (
  <div className="jumbotron text-center">
    <div className="container">
      <h1 className="jumbotron-heading">Stream Search</h1>
      <p className="lead">Search for your favourite movies and shows across streaming platforms.</p>
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
      <img className="overlay-provider-icon img-fluid m-1 rounded" src={PROVIDER_ICON_URLS[provider]}></img>
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
    <div className="shadow-lg card mb-4">
      <img className="card-img" src={resultData.poster}></img>
      <ProviderOverlay providers={resultData.providers} />
    </div>
  </div>
)

const SearchResults = ({ results, isLoading }) => {
  const resultCards = results.map(result => (
    <ResultCard key={nanoid()} resultData={result} />
  ))

  return (
  <div className="album py-5">
    <div className="container">
      <div className="row justify-content-center">
        {isLoading ? <Loading /> : resultCards}
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
    console.log("mounted" + this.scrollRef.current)
    this.scrollRef.current.scrollIntoView({behavior: "smooth"});
  }

  render() {
    return (
      <div className="mx-5" ref={this.scrollRef}>
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
  "8" : "https://images.justwatch.com/icon/430997/s100/netflix",
  "39" : "https://images.justwatch.com/icon/694554/s100/now-tv",
  "9" : "https://images.justwatch.com/icon/52449539/s100/amazon-prime-video",
  "103" : "https://images.justwatch.com/icon/3059247/s100/all-4",
  "29" : "https://images.justwatch.com/icon/657328/s100/sky-go",
  "38" : "https://images.justwatch.com/icon/694553/s100/bbc-iplayer",
  "137" : "https://images.justwatch.com/icon/5149848/s100/uktv-play",
  "41" : "https://images.justwatch.com/icon/694556/s100/itv-player",
  "129" : "https://images.justwatch.com/icon/4527547/s100/disneylife",
  "102" : "https://images.justwatch.com/icon/3059246/s100/filmstruck",
  "99" : "https://images.justwatch.com/icon/2562359/s100/shudder"
}

const PROVIDER_URLS = {
  "8" : "https://www.netflix.com/",
  "39" : "https://www.nowtv.com/",
  "9" : "https://www.primevideo.com/",
  "103" : "https://www.channel4.com/now",
  "29" : "https://www.sky.com/shop/tv/sky-go/",
  "38" : "https://www.bbc.co.uk/iplayer",
  "137" : "https://uktvplay.uktv.co.uk/",
  "41" : "https://www.itv.com/itvplayer/",
  "129" : "https://disneylife.com/",
  "102" : "https://www.filmstruck.com/uk/",
  "99" : "https://try.shudder.com/uk/"
}
  

export default StreamSearch;