import React, { Component } from 'react'
import { AppRegistry, StyleSheet, View } from 'react-native'

import { ThemeProvider } from 'react-native-elements'

import Router from './app/views/Router.js'
import Login from './app/views/Login.js'


export default class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <View style={styles.container}>
          <Login />
        </View>
      </ThemeProvider>
    )
  }
}

const theme = {
  Button: {
    raised: true,
  },
  Card: {
    titleStyle: {
      color: '#daa520'
    }
  },
  Input: {
    containerStyle: {
      padding: 10,
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  }
})

AppRegistry.registerComponent('App', () => App)
