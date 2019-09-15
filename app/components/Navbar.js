import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { Header } from 'react-native-elements'

import Logout from './Logout.js'

export default class Navbar extends Component {
  render () {
    const { username } = this.props

    return (
      <Header
        centerComponent={{ text: 'Hello ' + username, style: styles.text }}
        rightComponent={<Logout />}
        containerStyle={styles.container}>
      </Header>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#696969',
    justifyContent: 'center',
  },
  text: {
    color: '#daa520'
  }
})