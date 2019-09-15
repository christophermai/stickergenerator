import React, { Component } from 'react'
import { Image, StyleSheet, Text, View, AsyncStorage } from 'react-native'
import { Card, Button, Input, Overlay, ThemeProvider } from 'react-native-elements'

import Navbar from '../components/Navbar.js'
import { mergeImages } from 'merge-images'

export default class StickerGenerator extends Component {
  state = ({
    username: '',
    carId: '',
    qrImageUrl: '',
    userId: '',
    overlayVisible: false,
    imageURI: ''
  })

  componentDidMount() {
    this.fetchUserData()
  }

  fetchUserData = async () => {
    this.setState({
      username: await AsyncStorage.getItem('username')
    })
  }

  handleInput = (value) => {
    this.setState({
      carId: value
    })
  }

  refreshAuth = async () => {
    const username = this.state.username
    const refreshToken = await AsyncStorage.getItem('refreshToken')
    const refreshData = {
      'UserId': username,
      'RefreshToken': refreshToken
    }

    fetch('autoground-dev.azurewebsites.net/api/token/refreshtoken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(refreshData)
    }).then(response => response.json()).then((response) => {
        AsyncStorage.setItem('accessToken', response.access_token)
        AsyncStorage.setItem('refreshToken', response.refresh_token)
    }).catch(error => console.log(error))
  }

  fetchCarDetails = async (carId) => {
    const username = this.state.username
    const accessToken = await AsyncStorage.getItem('accessToken');
    let url = 'https://autoground-dev.azurewebsites.net/api/car/id/' + username + '/' + carId

    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    }).then(response => response.json()).then((response) => {
      this.setState({
        qrImageUrl: response.qrImageUrl,
        userId: response.userId
      })
    }).catch((error) => {
      this.refreshAuth()
      this.fetchCarDetails(this.state.carId)
    })
  }

  generateSticker = () => {
    mergeImages([
      { src: './app/assets/Checkerboard_background.png', x: 0, y: 0 },
      { src: './app/assets/Logo_Gold.png', x: 50, y: 25 }
    ]).then((b64) => {
      this.setState({ imageURI: b64 })
      console.log('b64: ')
      console.log(b64)
    }).catch(error => console.log(error))
  }

  render () {
    return (
      <ThemeProvider theme={theme}>
        <Navbar username={this.state.username} />
        <View style={styles.container}>
          <Card title='The Autoground Sticker Generator'>
            <Input 
              placeholder='Car ID'
              value={this.state.carId}
              onChangeText={this.handleInput}
            />
            <Button
              title='Generate PNG'
              onPress={() => {
                this.fetchCarDetails(this.state.carId).then((response) => {
                  this.generateSticker().then(console.log(this.state.imageURI))
                  this.setState({
                    overlayVisible: true,
                  })
                })
              }}
            />
          </Card>
          <Overlay
            isVisible={this.state.overlayVisible}
            windowBackgroundColor='rgba(255, 255, 255, .5)'
            overlayBackgroundColor='white'
            width="auto"
            height="auto"
            onBackdropPress={() => this.setState({ overlayVisible: false, carId: '' })}
          >
            <View>
              <Text>PNG generated and sent as an email.</Text>
              <Image source={{uri: this.state.imageURI}}></Image>
            </View>
          </Overlay>
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