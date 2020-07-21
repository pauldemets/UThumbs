import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import Navigator from './navigation';
import Store from './Store/configureStore';
import { Provider } from 'react-redux';


export default class App extends Component {
  render() {
    return (
      <Provider store={Store}>
        <Navigator />
      </Provider>
    );
  }
  
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
