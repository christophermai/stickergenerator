import React, { Component } from 'react'
import { StyleSheet, View, AsyncStorage, ActivityIndicator, StatusBar } from 'react-native'
import { Card, Button, Input, Text, ThemeProvider } from 'react-native-elements'
import { loginConfig } from '../utils/routes.js'

export default class Login extends Component {
  state = {
    username: '',
    password: '',
    accessToken: '',
    refreshToken: '',
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

  handleLogin = async () => {
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

    return await fetch(loginConfig.dev + '/api/token/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(response => response.json()).then((response) => {
      this.setState({
        accessToken: response.access_token,
        refreshToken: response.refresh_token
      })
    }).then((response) => {
      this._signInAsync()
    }).then((response) => {
      this.setState({
        loading: false
      })
    }).catch((error) => {
      this.setState({
        loading: false,
        hideError: false,
        errorMessage: 'Invalid credentials'
      })
    })
  }
  
  _signInAsync = async () => {
    await AsyncStorage.setItem('accessToken', this.state.accessToken)
    await AsyncStorage.setItem('refreshToken', this.state.refreshToken)
    await AsyncStorage.setItem('username', this.state.username)
    this.props.navigation.navigate('StickerGenerator')
  }

  render() {
    const { username, password, loading, hideError, errorMessage } = this.state

    return (
      <ThemeProvider theme={theme}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  errorText: {
    color: 'red'
  }
})