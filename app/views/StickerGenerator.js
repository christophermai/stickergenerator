import React, { Component } from 'react'
import { Text } from 'react-native'
import { Card, Button, Input, Overlay } from 'react-native-elements'

export default class StickerGenerator extends Component {
  state = ({
    carId: '',
    qrImageUrl: '',
    userId: '',
    overlayVisible: false
  })

  handleInput = (value) => {
    this.setState({
      carId: value
    })
  }

  fetchCarDetails = (carId) => {
    let username = 'chrismtest'
    let url = 'autoground-dev.azurewebsites.net/api/car/id/' + username + '/' + carId

    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.props.access_token
      },
    }).then(response => response.json()).then((response) => {
      this.setState({
        qrImageUrl: response.qrImageUrl,
        userId: response.userId
      })
    })
  }

  render () {
    return (
      <React.Fragment>
        <Card title='The Autoground Sticker Generator'>
          <Input 
            placeholder='Car ID'
            value={this.state.carId}
            onChange={this.handleInput}
          />
          <Button
            title='Generate PNG'
            onPress={() => {
              this.fetchCarDetails('01043ec4-a3ca-4a1f-9a51-a19ede9da920').then((response) => {
                this.setState({
                  overlayVisible: true
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
          onBackdropPress={() => this.setState({ overlayVisible: false })}
        >
          <Text>PNG generated and sent as an email.</Text>
          <Button
            title='Ok'
            onPress={() => this.setState({ overlayVisisble: false })}
          />
        </Overlay>
      </React.Fragment>
    )
  }
}