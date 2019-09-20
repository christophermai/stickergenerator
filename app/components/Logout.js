import React from 'react'
import { AsyncStorage } from 'react-native'
import { Button } from 'react-native-elements'

const Logout = ({navigation}) => {
  _signOutAsync = async () => {
    await AsyncStorage.removeItem('accessToken')
    await AsyncStorage.removeItem('refreshToken')
    await AsyncStorage.removeItem('username')
    navigation.navigate('Login')
  }

  return(
    <Button title="Logout" onPress={this._signOutAsync} />
  )
}

export default Logout