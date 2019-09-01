import React, { Component } from 'react';

class Translate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: 'It\'s a cat',
      output: '',
      // indexedDB: null,
      timeout: null,
      DB: props.db,
    };
    this.translate = this.translate.bind(this);
    this.test = this.test.bind(this);
    this.save = this.save.bind(this);
  }

  componentWillReceiveProps(newProps) {
    console.log('gonna update props now in translate');
    this.setState({ DB: newProps.db });
  }

  async save(event) {
    event.preventDefault();
    if (!this.state.DB) {
      console.log('No DB received');
      return;
    }
    if (this.state.output !== '') {
      const translationsOS = this.state.DB.transaction('translations', 'readwrite').objectStore('translations');
      const newItem = {
        lang_o: 'en',
        lang_t: 'sv',
        text: this.state.input,
        translation: this.state.output,
      };
      const request = translationsOS.add(newItem);
      request.onsuccess = (e) => {
        this.props.onUpdate();
      };
    }
  }

  async test(event) {
    event.preventDefault();
    if (this.state.input !== '') {
      // const response = await this.httpGet(`/api/sv/${encodeURIComponent(this.state.input)}`);
      const response = {
        status: 200,
        translation: 'Es un gato',
      };

      if (response.status === 200) {
        this.setState({ output: response.translation });
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async httpGet(theUrl) {
    const xmlHttp = new XMLHttpRequest();
    return new Promise((resolve, reject) => {
      xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
          resolve(JSON.parse(xmlHttp.responseText));
        }
      };
      xmlHttp.open('GET', theUrl, true); // true for asynchronous
      xmlHttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xmlHttp.send(null);
    });
  }

  async translate(event) {
    this.setState({ input: event.target.value });
    if (this.state.input !== '') {
      /* this.throttle(async () => {
        const response = await this.httpGet(`/api/sv/${encodeURIComponent(this.state.input)}`);
        if (response.status === 200) {
          this.setState({ output: response.translation });
        }
      }, 500); */
    }
  }

  throttle(callback, interval) {
    if (this.state.timeout) {
      clearTimeout(this.state.timeout);
    }
    const timeout = setTimeout(() => {
      callback();
    }, interval);
    this.setState({ timeout });
  }

  render() {
    let saveBtn;
    if (this.state.DB) {
      saveBtn = <button onClick={this.save} disabled={!this.state.output}>Save translation</button>;
    }
    return (
      <section>
        <h1>Translate</h1>
        <form>
          <textarea
            onChange={this.translate}
            value={this.state.input}
          />
          <p>{this.state.output}</p>
          <button
            onClick={this.test}
          >
            Test
          </button>
          { saveBtn }
        </form>
      </section>
    );
  }
}

export default Translate;
