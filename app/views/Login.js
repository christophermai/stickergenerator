import React, { Component } from 'react'
import { View, AsyncStorage } from 'react-native'
import { Card, Button, Input, Text, ThemeProvider } from 'react-native-elements'
import { login } from '../utils/routes.js'
import Navbar from '../components/Navbar.js'

import styles from './styles.js'

export default class Login extends Component {
  state = {
    username: '',
    password: '',
    hideError: true,
    errorMessage: '',
    loading: false,
  }

  handleUsernameInput = (value) => {
    this.setState({
      username: value
    })
  }

  handlePasswordInput = (value) => {
    this.setState({
      password: value
    })
  }

  handleLogin = () => {
    this.setState({
      loading: true,
      hideError: true,
      errorMessage: '',
    })
    const data = {
      UserId: this.state.username,
      Password: this.state.password,
      RefreshToken: ''
    }

    return login(data).then(response => response.json()).then((response) => {
      this._signInAsync(response.access_token, response.refresh_token)
    }).catch((error) => {
      this.setState({
        loading: false,
        hideError: false,
        errorMessage: 'Invalid credentials'
      })
    })
  }
  
  _signInAsync = async (accessToken, refreshToken) => {
    await AsyncStorage.setItem('accessToken', accessToken)
    await AsyncStorage.setItem('refreshToken', refreshToken)
    await AsyncStorage.setItem('username', this.state.username)
    this.props.navigation.navigate('StickerGenerator')
  }

  render() {
    const { username, password, loading, hideError, errorMessage } = this.state

    return (
      <ThemeProvider theme={theme}>
        <Navbar username={'Guest'} />
        <View style={styles.container}>
          <Card title='The Autoground Sticker Generator'>
            <Input 
              placeholder='Username'
              name='username'
              value={username}
              onChangeText={this.handleUsernameInput}
            />
            <Input
              secureTextEntry={true}
              placeholder='Password'
              name='password'
              value={password}
              onChangeText={this.handlePasswordInput}
            />
            <Button
              title={loading ? 'Logging In...' : 'Log In'}
              onPress={() => {
                this.handleLogin()
              }}
              disabled={ loading
                || !username
                || !password
              }
            />
            { !hideError ?
              <Text style={styles.errorText}>{errorMessage}</Text>
              :
              null
            }
          </Card>
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