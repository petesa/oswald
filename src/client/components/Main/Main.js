import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Work from '../pages/Work';
import About from '../pages/About';
import Contact from '../pages/Contact';

class Main extends Component {
  componentDidMount() {
    // alert('Mounting');
  }

  componentDidUpdate() {
    // alert('Updating');
  }

  render() {
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/work" component={Work} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
      </Switch>
    );
  }
}

export default Main;
