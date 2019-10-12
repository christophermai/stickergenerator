import React, { Component } from 'react'
import { Image, Text, View, AsyncStorage } from 'react-native'
import { Card, Button, Input, CheckBox, Overlay } from 'react-native-elements'

import { getEvent, emailQRSticker } from '../../../utils/routes.js'

import styles from '../../styles.js'

export default class EventInput extends Component {
  state = {
    eventId: '',
    carIds: [],
    stickerURIs: [],
    checked: {},
    carListVisible: false,
    overlayVisible: false,
    loading: false,
    loadingGenerate: false,
    hideError: true,
    hideErrorGenerate: true,
    errorMessage: '',
  }

  handleEventIdInput = (value) => {
    this.setState({
      eventId: value
    })
  }

  handleCheckbox = (item, checked) => {
    let updatedChecklist = Object.assign({}, this.state.checked, {[item]: !checked})
    this.setState({
      checked: updatedChecklist
    })
  }

  handleSubmitEventId = async (eventId) => {
    this.setState({
      loading: true,
      hideError: true,
      errorMessage: '',
    })

    var carIds = []
    const { username } = this.props
    const accessToken = await AsyncStorage.getItem('accessToken');

    return getEvent(username, eventId, accessToken).then(response => response.json()).then((response) => {
      for (let carId of Object.keys(response.carRegistrations)) {
        carIds.push(carId)
      }
      this.setState({
        carIds: carIds,
        loading: false
      })
    }).catch((error) => {
      if (error.status === '400') {
        this.setState({
          loading: false,
          hideError: false,
          errorMessage: 'Could not find an event with that ID'
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

  handleSubmitCarIds = async (checked) => {
    this.setState({
      loadingGenerate: true,
      hideErrorGenerate: true,
      errorMessage: '',
    })

    const { stickerURIs } = this.state
    const { username, email } = this.props
    const accessToken = await AsyncStorage.getItem('accessToken');

    for (let carId of Object.keys(checked)) {
      if (checked[carId]) {
        emailQRSticker(username, carId, email, accessToken).then(response => {
          return response.blob()
        }).then((blob) => {
          const fileReaderInstance = new FileReader();
          fileReaderInstance.readAsDataURL(blob); 
          fileReaderInstance.onload = () => {
              base64data = fileReaderInstance.result;
              let newStickerURIs = stickerURIs
              newStickerURIs.push(base64data)                
              this.setState({
                stickerURI: newStickerURIs
              })
          }
        }).catch((error) => {
          this.props.refreshAuth()
          this.setState({
            loadingGenerate: false,
            hideErrorGenerate: false,
            errorMessage: 'An error occured. Please try again.'
          })
          console.log(error)
        })
      }
    }
  }

  render () {
    const { eventId, carIds, stickerURIs, checked, carListVisible, overlayVisible, loading, loadingGenerate, hideError, hideErrorGenerate, errorMessage } = this.state

    return (
      <React.Fragment>
        <Card title='Please input an EventID'>
          <Input 
            placeholder='Event ID'
            value={eventId}
            name='eventId'
            onChangeText={this.handleEventIdInput}
          />
          <Button
            title={loading ? 'Pulling Cars...' : 'Get Car List'}
            onPress={() => {
              this.handleSubmitEventId(eventId).then(() => {
                this.setState({
                  carListVisible: true,
                })
              })
            }}
            disabled={ loading
              || !eventId
            }
          />
          { !hideError ?
            <Text style={styles.errorText}>{errorMessage}</Text>
            :
            null
          }
          {
            carListVisible ?
            <View>
              { carIds ?
                <View>
                  { carIds.map((item) => {
                      return (
                        <CheckBox
                          title={item}
                          key={item}
                          checked={checked[item]}
                          onPress={() => this.handleCheckbox(item, checked[item])}
                        />
                      )
                    })
                  }
                  <Button
                    title={'Generate Stickers'}
                    onPress={() => {
                      this.handleSubmitCarIds(checked).then(() => {
                        this.setState({
                          loadingGenerate: false,
                          overlayVisible: true,
                        })
                      })
                    }}
                    disabled={loadingGenerate}
                  />
                  { !hideErrorGenerate ?
                    <Text style={styles.errorText}>{errorMessage}</Text>
                    :
                    null
                  }
                  <Overlay
                    isVisible={overlayVisible}
                    windowBackgroundColor='rgba(255, 255, 255, .5)'
                    overlayBackgroundColor='white'
                    width="auto"
                    height="auto"
                    onBackdropPress={() => this.setState({ overlayVisible: false, eventId: '' })}
                  >
                    <View>
                      <Text>Stickers generated and sent as an email.</Text>
                      <View>
                        { stickerURIs.map((stickerURI, idx) => {
                          return (
                            <Image
                              style={{
                                width: 300,
                                height: 150,
                                resizeMode: 'contain',
                              }}
                              source={{ uri: stickerURI }}
                              key={idx}
                            />
                          )
                        })
                        }
                      </View>
                    </View>
                  </Overlay>
                </View>
                :
                <Text style={styles.errorText}>No cars to display for this event</Text>
              }
            </View>
            :
            null
          }
        </Card>
      </React.Fragment>
    )
  }
}