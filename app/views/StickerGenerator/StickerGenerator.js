import React, { Component } from 'react'
import { ScrollView, AsyncStorage, Dimensions } from 'react-native'
import { ThemeProvider } from 'react-native-elements'

import Navbar from '../../components/Navbar.js'
import CarInput from './Components/CarInput.js'
import EventInput from './Components/EventInput.js'
import { refreshToken, getUserData } from '../../utils/routes.js'

import styles from '../styles.js'

const { height } = Dimensions.get('window')

export default class StickerGenerator extends Component {
  state = ({
    email: '',
    username: '',
    screenHeight: 0,
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

  onContentSizeChange = (contentWidth, contentHeight) => {
    this.setState({ screenHeight: contentHeight })
  }

  render () {
    const { email, username, screenHeight } = this.state
    const scrollEnabled = screenHeight > height

    return (
      <ThemeProvider theme={theme}>
        <Navbar username={username} navigation={this.props.navigation} />
        <ScrollView
          style={styles.container}
          scrollEnabled={scrollEnabled}
          onContentSizeChange={this.onContentSizeChange}
        >
          <CarInput
            email={email}
            username={username}
            refreshAuth={this.refreshAuth}
          />
          <EventInput
            email={email}
            username={username}
            refreshAuth={this.refreshAuth}
          />
        </ScrollView>
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