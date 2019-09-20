import React, { Component } from 'react'
import { Image, Text, View, AsyncStorage } from 'react-native'
import { Card, Button, Input, Overlay, ThemeProvider } from 'react-native-elements'

import Navbar from '../components/Navbar.js'
import { refreshToken, emailQRSticker, getUserData } from '../utils/routes.js'

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
    const username = await AsyncStorage.getItem('username')
    const accessToken = await AsyncStorage.getItem('accessToken')

    getUserData(username, accessToken).then((response) => response.json()).then((response) => {
      this.setState({
        email: response.email,
        username: response.id
      })
    }).catch(error => {
      console.log(error)
      this.setState({
        username: 'error'
      })
    })
  }
  
  refreshAuth = async () => {
    const username = this.state.username
    const refreshTok = await AsyncStorage.getItem('refreshToken')
    const refreshData = {
      'UserId': username,
      'RefreshToken': refreshTok
    }

    refreshToken(refreshData).then(response => response.json()).then((response) => {
        AsyncStorage.setItem('accessToken', response.access_token)
        AsyncStorage.setItem('refreshToken', response.refresh_token)
    }).catch(error => console.log(error))
  }

  handleInput = (value) => {
    this.setState({
      carId: value
    })
  }

  handleSubmit = async (carId) => {
    this.setState({
      loading: true,
      hideError: true,
      errorMessage: '',
    })
    const { username, email } = this.state

    const accessToken = await AsyncStorage.getItem('accessToken');

    emailQRSticker(username, carId, email, accessToken).then(response => {
      return response.blob()
    }).then((blob) => {
      const fileReaderInstance = new FileReader();
      fileReaderInstance.readAsDataURL(blob); 
      fileReaderInstance.onload = () => {
          base64data = fileReaderInstance.result;                
          this.setState({
            stickerURI: base64data
          })  
      }
      this.setState({
        loading: false
      })
    }).catch((error) => {
      if (error.status === '400') {
        this.setState({
          loading: false,
          hideError: false,
          errorMessage: 'Could not find a car with that ID'
        })
      }
      else if (error.status >= '401') {
        this.refreshAuth()
        this.setState({
          loading: false,
          hideError: false,
          errorMessage: 'An error occured. Please try again.'
        })
        console.log(error)
      }
    })
  }

  render () {
    const { username, carId, stickerURI, overlayVisible, loading, hideError, errorMessage } = this.state

    return (
      <ThemeProvider theme={theme}>
        <Navbar username={username} navigation={this.props.navigation} />
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
                this.handleSubmit(carId).then(() => {
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
              <View>
                <Image
                  style={{
                    width: 300,
                    height: 150,
                    resizeMode: 'contain',
                  }}
                  source={{ uri: stickerURI }}
                />
              </View>
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