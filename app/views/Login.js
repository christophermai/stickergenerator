import React, { Component } from 'react'
import { Card, Button, Input } from 'react-native-elements'

export default class Login extends Component {
  state = {
    username: '',
    password: '',
    accessToken: ''
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
    const data = {
      UserId: this.state.username,
      Password: this.state.password,
      RefreshToken: ''
    }

    return fetch('autoground-dev.azurewebsites.net/api/token/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(response => response.json()).then((response) => {
      this.setState({
        accessToken: response.access_token
      })
    })
  }

  render() {
    const { history } = this.props

    return (
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
            history.push('/generator')
          }}
        />
      </Card>
    )
  }
}