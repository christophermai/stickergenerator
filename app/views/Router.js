import React from 'react'
import { NativeRouter, Route, Switch } from 'react-router-native'

import { Login } from './Login.js'
import { StickerGenerator } from './StickerGenerator.js'

export const Router = () => {
  <NativeRouter initialEntries={['/login']}>
    <Switch>
      <Route exact={true} path='/login' component={Login} />
      <Route exact={true} path='/generator' component={StickerGenerator} />
    </Switch>
  </NativeRouter>
}