import React, { Component } from 'react'
import { Image, Text, View, AsyncStorage } from 'react-native'
import { Card, Button, Input, Overlay, ThemeProvider } from 'react-native-elements'

import Navbar from '../components/Navbar.js'
import { emailQRSticker } from '../utils/routes.js'
import { arrayBufferToBase64 } from '../utils/helpers.js'

import styles from './styles.js'

export default class StickerGenerator extends Component {
  state = ({
    email: '',
    username: '',
    carId: '',
    stickerURI: '',
    overlayVisible: false,
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

  handleInput = (value) => {
    this.setState({
      carId: value
    })
  }

  emailQRSticker = async (carId) => {
    this.setState({
      loading: true,
      hideError: true,
      errorMessage: '',
    })
    const { username, email } = this.state

    const accessToken = await AsyncStorage.getItem('accessToken');
    let url = emailQRSticker + username + '/' + carId + '/' + email

    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    }).then(response => response.arrayBuffer()).then((buffer) => {
      this.setState({
        stickerURI: arrayBufferToBase64(buffer),
      }, () => {
        this.setState({
          loading: false
        })
      })
    }).catch((error) => {
      if (error.status === '400') {
        this.setState({
          loading: false,
          hideError: false,
          errorMessage: 'Could not find a car with that ID'
        })
      }
      else {
        this.refreshAuth()
        this.setState({
          loading: false,
          hideError: false,
          errorMessage: 'An error occured. Please try again.'
        })
      }
    })
  }

  render () {
    const { username, carId, stickerURI, overlayVisible, loading, hideError, errorMessage } = this.state

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
                this.emailQRSticker(carId).then((response) => {
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
              <Image
                style={{
                  width: 51,
                  height: 51,
                  resizeMode: 'contain', //center?
                }}
                source={{
                  uri:
                    'data:image/png;base64,' + stickerURI,
                }}
              />
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