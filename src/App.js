import React from 'react'

import Header from './components/Header'
import Footer from './components/Footer'
import ListView from './components/ListView'

import './App.css'

const App = props => {
  return (
    <div className='app__main-container'>
      <Header />
      <div className='app__content-container'>
        <ListView />
      </div>
      <Footer />
    </div>
  )
}

export default App
