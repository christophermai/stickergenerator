import React, { Component } from 'react'
import { Image, Text, View, AsyncStorage } from 'react-native'
import { Card, Button, Input, Overlay } from 'react-native-elements'

import { emailQRSticker } from '../../../utils/routes.js'

import styles from '../../styles.js'

export default class CarInput extends Component {
  state = {
    carId: '',
    stickerUri: '',
    overlayVisible: false,
    loading: false,
    hideError: true,
    errorMessage: '',
  }

  handleCarIdInput = (value) => {
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

    const { username, email } = this.props
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
      else {
        this.props.refreshAuth()
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
    const { carId, stickerURI, overlayVisible, loading, hideError, errorMessage } = this.state

    return (
      <React.Fragment>
        <Card title='Please input a CarID'>
          <Input 
            placeholder='Car ID'
            value={carId}
            name='carId'
            onChangeText={this.handleCarIdInput}
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
          onBackdropPress={() => this.setState({
              overlayVisible: false,
              carId: ''
            })
          }
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
      </React.Fragment>
    )
  }
}