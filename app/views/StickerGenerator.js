import React, { Component } from 'react'
import { StyleSheet, Text, View, AsyncStorage } from 'react-native'
import { Card, Button, Input, Overlay, ThemeProvider } from 'react-native-elements'

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

  fetchCarDetails = async (carId) => {
    let username = 'chrismtest'
    const accessToken = await AsyncStorage.getItem('accessToken');
    let url = 'autoground-dev.azurewebsites.net/api/car/id/' + username + '/' + carId

    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      },
    }).then(response => response.json()).then((response) => {
      this.setState({
        qrImageUrl: response.qrImageUrl,
        userId: response.userId
      })
    }).catch((error) => {
      console.log(error)
    })
  }

  render () {
    return (
      <ThemeProvider theme={theme}>
        <View style={styles.container}>
          <Card title='The Autoground Sticker Generator'>
            <Input 
              placeholder='Car ID'
              value={this.state.carId}
              onChangeText={this.handleInput}
            />
            <Button
              title='Generate PNG'
              onPress={() => {
                this.fetchCarDetails(this.state.carId).then((response) => {
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
            onBackdropPress={() => this.setState({ overlayVisible: false, carId: '' })}
          >
            <View>
              <Text>PNG generated and sent as an email.</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  }
})