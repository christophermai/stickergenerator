import React, { Component } from 'react'
import { AppRegistry } from 'react-native'
import { createSwitchNavigator, createAppContainer } from 'react-navigation'

import Login from './app/views/Login.js'
import StickerGenerator from './app/views/StickerGenerator.js'
import AuthChecker from './app/utils/AuthChecker.js'


class App extends Component {
  render() {
    return (
      <Login navigation={this.props.navigation}/>
    )
  }
}

class NavigateStickerGenerator extends Component {
  render() {
    return (
      <StickerGenerator navigation={this.props.navigation}/>
    )
  }
}

const AppNavigator = createSwitchNavigator(
  {
    AuthChecker: AuthChecker,
    Login: App,
    StickerGenerator:  NavigateStickerGenerator
  },
  {
    initialRouteName: 'AuthChecker'
  }
)

export default createAppContainer(AppNavigator)

AppRegistry.registerComponent('AppNavigator', () => AppNavigator)
