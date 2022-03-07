import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { Web3Provider } from '@ethersproject/providers'
import { Web3ReactProvider } from '@web3-react/core'
import MetamaskProvider from '../components/MetaMaskProvider'

const getLibrary = (
  provider
) => {
  return new Web3Provider(provider)
}

ReactDOM.render(
  <React.StrictMode>
     <Web3ReactProvider getLibrary={getLibrary}>
      <MetamaskProvider>
    <App />
    </MetamaskProvider>
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById('root')
);