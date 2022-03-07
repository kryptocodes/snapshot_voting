import { InjectedConnector } from '@web3-react/injected-connector'
import { FC, useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { WalletConnectConnector, URI_AVAILABLE } from '@web3-react/walletconnect-connector'

const injected = new InjectedConnector({
    supportedChainIds: [1, 137, 80001]
})

export const walletConnect = new WalletConnectConnector({
    rpc: {
        137: "https://polygon-rpc.com/",
        80001: "https://rpc-mumbai.matic.today"
    },
    bridge: 'https://bridge.walletconnect.org',
    qrcode: true,
    pollingInterval: 12000
})

const WalletconnectContextProvider = ({ children }) => {
    const { active: networkActive, error: networkError, activate: activateNetwork, connector } = useWeb3React()
    const provider = walletConnect.walletConnectProvider
    useEffect(() => {
        walletConnect.on(URI_AVAILABLE, uri => {
            activateNetwork(walletConnect)
        })
    })
    return(
        <>{children}</>
    )
}

const MetamaskProvider = ({ children }) => {
    const { active: networkActive, error: networkError, activate: activateNetwork, connector } = useWeb3React()
    const [loaded, setLoaded] = useState(false)
    const checkIsAuthorized = async () => {
        console.log(connector)
        const isInjectedAuthorized = await injected.isAuthorized()
        if(isInjectedAuthorized){
            setLoaded(true)
            if(!networkActive && !networkError){
                activateNetwork(injected)
            }
        }
        setLoaded(true)
    }
    const isProvider = async () => {
        const wcLocalStorage = localStorage.getItem('walletconnect')
        if(wcLocalStorage){
            const isConnected = JSON.parse(wcLocalStorage).connected
            console.log(isConnected === 'true')
            if(isConnected){
                activateNetwork(walletConnect)
            }
        }
    }

    useEffect(() => {
        checkIsAuthorized()
        isProvider()
    }, [activateNetwork, networkActive, networkError])
    
    if (loaded) {
        return <div>{children}</div>
    }
    return(
        <>Loading ...</>
    )
}


export default MetamaskProvider