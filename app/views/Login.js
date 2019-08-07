import React, { Component } from 'react'
import { StyleSheet, View, AsyncStorage } from 'react-native'
import { Card, Button, Input, ThemeProvider } from 'react-native-elements'

export default class Login extends Component {
  state = {
    username: '',
    password: '',
    accessToken: '',
    refreshToken: ''
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
      console.log(response.status)
    }).then((response) => {
      this._signInAsync()
    }).catch((error) => {
      console.log(error)
    })
  }
  
  _signInAsync = async () => {
    await AsyncStorage.setItem('accessToken', this.state.accessToken)
    await AsyncStorage.setItem('refreshToken', this.state.refreshToken)
    this.props.navigation.navigate('StickerGenerator')
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <View style={styles.container}>
          <Card title='The Autoground Sticker Generator'>
            <Input 
              placeholder='Username'
              name='username'
              value={this.state.username}
              onChangeText={this.handleUsernameInput}
            />
            <Input
              secureTextEntry={true}
              placeholder='Password'
              name='password'
              value={this.state.password}
              onChangeText={this.handlePasswordInput}
            />
            <Button
              title='Log In'
              onPress={() => {
                this.handleLogin()
              }}
            />
          </Card>
        </View>
      </ThemeProvider>
    )
  }
}

const loginConfig = {
  dev: 'https:// autoground-dev.azurewebsites.net'
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