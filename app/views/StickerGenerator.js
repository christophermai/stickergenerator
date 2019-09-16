import React, { Component } from 'react'
import { Image, Text, View, AsyncStorage } from 'react-native'
import { Card, Button, Input, Overlay, ThemeProvider } from 'react-native-elements'

import Navbar from '../components/Navbar.js'
import { mergeImages } from 'merge-images'

import styles from './styles.js'

export default class StickerGenerator extends Component {
  state = ({
    username: '',
    carId: '',
    qrImageUrl: '',
    userId: '',
    overlayVisible: false,
    imageURI: '',
    hideError: true,
    errorMessage: '',
    loading: false,
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
    this.setState({
      loading: true,
      hideError: true,
      errorMessage: '',
    })
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
    }).then((response) => {
      this.setState({
        loading: false
      })
    }).catch((error) => {
      this.refreshAuth()
      this.setState({
        loading: false,
        hideError: false,
        errorMessage: 'Invalid carId'
      })
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
    const { username, carId, imageURI, overlayVisible, loading, hideError, errorMessage } = this.state

    return (
      <ThemeProvider theme={theme}>
        <Navbar username={username} />
        <View style={styles.container}>
          <Card title='The Autoground Sticker Generator'>
            <Input 
              placeholder='Car ID'
              value={carId}
              onChangeText={this.handleInput}
            />
            <Button
              title={loading ? 'Generating PNG...' : 'Generate PNG'}
              onPress={() => {
                this.fetchCarDetails(carId).then((response) => {
                  this.generateSticker().then(console.log(imageURI))
                  this.setState({
                    overlayVisible: true,
                  })
                })
              }}
              disabled={ loading
                || !carId
              }
            />
            { !hideError ?
              <Text style={styles.errorText}>{errorMessage}</Text>
              :
              null
            }
          </Card>
          <Overlay
            isVisible={overlayVisible}
            windowBackgroundColor='rgba(255, 255, 255, .5)'
            overlayBackgroundColor='white'
            width="auto"
            height="auto"
            onBackdropPress={() => this.setState({ overlayVisible: false, carId: '' })}
          >
            <View>
              <Text>PNG generated and sent as an email.</Text>
              <Image source={{uri: imageURI}}></Image>
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