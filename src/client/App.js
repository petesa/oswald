import React, { Component } from 'react';
import Header from './components/Header';
import Main from './components/Main';
import './App.css';

class App extends Component {
  componentDidMount() {
  }
  render() {
    return (
      <div className="App">
        <Header />
        <Main />
      </div>
    );
  }
}

export default App;
