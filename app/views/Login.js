import React, { Component } from 'react'
import { Card, Button, Input } from 'react-native-elements'

export default class Login extends Component {
  state = {
    username: '',
    password: '',
    accessToken: ''
  }

  handleInput = ({name, value}) => {
    this.setState({
      [name]: value
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

  render () {
    return (
      <Card title='The Autoground Sticker Generator'>
        <Input 
          placeholder='Username'
          name='username'
          value={this.state.username}
          onChange={this.handleInput}
        />
        <Input
          placeholder='Password'
          name='password'
          value={this.state.password}
          onChange={this.handleInput}
        />
        <Button
          title='Log In'
          onPress={() => {
            this.handleLogin()
          }}
        />
      </Card>
    )
  }
}