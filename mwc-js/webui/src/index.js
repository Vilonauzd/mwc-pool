/* eslint-disable react/no-deprecated */
import React from 'react'
import ReactDOM from 'react-dom'
import App from './app/App'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import store from './app/store'
import ScrollToTop from './app/ScrollToTop'

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter basename=''>
      <ScrollToTop>
        <App/>
      </ScrollToTop>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
)
