import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';

import PizzaForm from './components/PizzaForm'


class App extends Component {
  render() {
    return (
      <div className="App">
        <PizzaForm store={this.props.store}/>
      </div>
    );
  }
}

export default App;
