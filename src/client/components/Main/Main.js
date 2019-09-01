import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Review from '../views/Review';
import Translation from '../views/Translate';
import Settings from '../views/Settings';

class Main extends Component {
  constructor() {
    super();
    this.state = {
      DB: null,
    };
    this.updateState = this.updateState.bind(this);
  }

  componentDidMount() {
    this.updateState();
  }

  async updateState() {
    if (('indexedDB' in window) && !this.state.indexedDB) {
      const DB = await this.createDB();
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({ DB });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async createDB() {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open('test-db1', 1);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        db.onerror = (evt) => { console.log(`Error: ${evt.target.errorCode}`); };
        const OS = db.createObjectStore('translations', { keyPath: 'id', autoIncrement: true });
        OS.createIndex('lang_o', 'lang_o', { unique: false });
        OS.createIndex('lang_t', 'lang_t', { unique: false });
        OS.createIndex('text', 'text', { unique: false });
        OS.createIndex('translation', 'translation', { unique: false });
        OS.transaction.oncomplete = () => {
          resolve(db);
        };
      };
      request.onerror = (event) => {
        console.log('Error');
        reject(event.target.errorCode);
      };
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
    });
  }

  render() {
    return (
      <Switch>
        <Route
          exact
          path="/"
          render={props => (
            <Review
              db={this.state.DB}
              onUpdate={this.updateState}
            />
          )}
        />
        <Route
          path="/translation"
          render={props => (
            <Translation
              db={this.state.DB}
              onUpdate={this.updateState}
            />
          )}
        />
        <Route path="/settings" component={Settings} />
      </Switch>
    );
  }
}

export default Main;
