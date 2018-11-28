import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: '', results: []};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    fetch('/.netlify/functions/query', {body: this.state.value, method: "POST"})
      .then(response => response.json())
      .then(result => this.setState({ results: result }))
      .catch(error => console.log(error));
  }

  render() {
    return (
    <div>
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
      <span>{this.state.results.map(r => <li>{r.title}</li>)}</span>
    </div>
    );
  }
}





class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <NameForm />
        </header>
      </div>
    );
  }
}

export default App;
