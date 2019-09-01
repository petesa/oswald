import React, { Component } from 'react';

class Review extends Component {
  constructor(props) {
    super(props);
    this.state = {
      DB: props.db,
      translations: [],
      editID: null,
      editValue: null,
    };
    this.deleteItem = this.deleteItem.bind(this);
    this.editItem = this.editItem.bind(this);
    this.saveItem = this.saveItem.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  async componentWillMount() {
    this.getTranslations();
  }

  async componentWillReceiveProps(newProps) {
    this.setState(
      { DB: newProps.db },
      async () => {
        this.getTranslations();
      },
    );
  }

  async getTranslations() {
    return new Promise((resolve, reject) => {
      if (!this.state.DB) {
        reject();
      }
      const transaction = this.state.DB.transaction('translations', 'readwrite');
      const objectStore = transaction.objectStore('translations');
      const request = objectStore.getAll();
      request.onerror = (e) => {
        reject(e);
      };
      request.onsuccess = (e) => {
        this.setState({ translations: request.result });
        resolve(request.result);
      };
    });
  }

  async deleteItem(event) {
    const key = event.target.dataset.id;
    return new Promise((resolve, reject) => {
      const transaction = this.state.DB.transaction('translations', 'readwrite');
      const objectStore = transaction.objectStore('translations');
      const request = objectStore.delete(Number(key));
      // const request = objectStore.clear();
      request.onerror = (e) => {
        reject(e);
      };
      request.onsuccess = (e) => {
        this.props.onUpdate();
        console.log(`Item with key ${key} deleted.`);
        resolve(request.result);
      };
    });
  }

  editItem(event) {
    const editID = Number(event.target.dataset.id);
    const editItem = this.queryTranslations(editID);
    this.setState({ editID, editValue: editItem.translation });
  }

  queryTranslations(key) {
    for (const item of this.state.translations) {
      if (item.id === key) {
        return item;
      }
    }
    return null;
  }

  async saveItem() {
    const key = this.state.editID;
    return new Promise((resolve, reject) => {
      const transaction = this.state.DB.transaction('translations', 'readwrite');
      const objectStore = transaction.objectStore('translations');
      const object = this.queryTranslations(key);
      object.translation = this.state.editValue;
      const request = objectStore.put(object);
      request.onerror = (e) => {
        reject(e);
      };
      request.onsuccess = (e) => {
        this.props.onUpdate();
        this.setState({ editID: null });
        this.getTranslations();
        console.log(`Item with key ${key} updated.`);
        resolve(request.result);
      };
    });
  }

  handleChange(event) {
    const editValue = event.target.value;
    this.setState({ editValue });
  }

  render() {
    const trItems = [];
    for (const item of this.state.translations) {
      let translation = <h3>{item.translation}</h3>;
      if (item.id === this.state.editID) {
        translation = (
          <input
            value={this.state.editValue}
            onChange={this.handleChange}
          />
        );
      }
      let editBtn = (
        <button
          data-id={item.id}
          onClick={this.editItem}
        >
          Edit
        </button>
      );
      if (this.state.editID) {
        editBtn = (
          <button
            onClick={this.saveItem}
          >
            Save
          </button>
        );
      }
      trItems.push(
        <li key={item.id}>
          {translation}
          <p>{item.text}</p>
          <button
            data-id={item.id}
            onClick={this.deleteItem}
          >
            Delete
          </button>
          {editBtn}
        </li>,
      );
    }
    return (
      <section>
        <h1>Review</h1>
        <ul>{ trItems }</ul>
      </section>
    );
  }
}

export default Review;
