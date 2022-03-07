import { useState,useEffect } from 'react'
import logo from './logo.svg'
import './App.css'
import snapshot from '@snapshot-labs/snapshot.js';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { walletConnect } from '../components/MetaMaskProvider'
import { LazyAuth } from 'lazyauth'

import { PortisConnector } from '@web3-react/portis-connector'
const hub = 'https://hub.snapshot.org'; // or https://testnet.snapshot.org for testnet
const client = new snapshot.Client712(hub);
const web3 = new Web3Provider(window.ethereum);



function App() {
  const { active, account, library: provider, activate, deactivate, connector, chainId } = useWeb3React()
	const [ isLoading, setIsLoading ] = useState(false)
  const [error, setError] = useState(false)
  const [scores,setScores] = useState()
	const injected = new InjectedConnector({
		supportedChainIds: [1, 137, 80001]
	})

	const portis = new PortisConnector({
		dAppId: 'efa76be7-71f3-4b3f-a49a-5cccae6dfaf7',
		networks: [1, 137, 80001]
	})

	const connectBrowser = async () => {
		setIsLoading(true)
		try {
			await activate(injected)
		
		}
		catch(err) {
			console.log(err)
		}
		setIsLoading(false)
	}

	const connectMobile = async () => {
		setIsLoading(true)
		try {
			await activate(walletConnect)
		
		}
		catch(err) {
			console.log(err)
		}
		setIsLoading(false)
	}

	const connectPortis = async () => {
		setIsLoading(true)
		try {
			await activate(portis)
		
		}
		catch (err) {
			console.log(err)
		}
		setIsLoading(false)
	}
	const removeWalletconnect = async () => {
		localStorage.removeItem('walletconnect')
		window.location.reload()
	}

  const CreateProposal = async () => {
  
const receipt = await client.proposal(web3, account, {
  space: 'yam.eth',
  type: 'single-choice',
  title: 'Test proposal using Snapshot.js',
  body: '',
  choices: ['Alice', 'Bob', 'Carol'],
  start: 1636984800,
  end: 1637244000,
  snapshot: 13620822,
  network: '1',
  strategies: JSON.stringify({}),
  plugins: JSON.stringify({}),
  metadata: JSON.stringify({})
}).catch((err) => {
  setError(err)
  console.log(err)
})
console.log(receipt)
  }

const Submit = async() => {
    const reciept = await client.vote(web3, account, {
    space: 'yam.eth',
    proposal: '0x21ea31e896ec5b5a49a3653e51e787ee834aaf953263144ab936ed756f36609f',
    type: 'single-choice',
    choice: 1,
    metadata: JSON.stringify({})
  }).catch(err => {
    setError(err)
    console.log(err)
  })
  console.log(reciept)
}

const GetScores = async() => {
  const space = 'yam.eth';
const strategies = [
  {
    name: 'erc20-balance-of',
    params: {
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      symbol: 'DAI',
      decimals: 18
    }
  }
];
const network = '1';
const voters = [
  '0xa478c2975ab1ea89e8196811f51a7b7ade33eb11'
];
const blockNumber = 11437846;
snapshot.utils.getScores(
  space,
  strategies,
  network,
  voters,
  blockNumber
).then(scores => {
  console.log(scores[0]);
  setScores(scores[0])
});

}
  
  console.log(scores)
  return (
    <>
      {/* <h1>Hello</h1>
      <button onClick={Wallet}>Wallet</button>
      {accounts && 
     <button onClick={Submit}>Submit</button>}
      */}
      <div className="wallet">
          <button onClick={connectBrowser} className='WalletButton'>
           { account ? `Connected as ${account}` : "Connect MetaMask" }
            </button>
        {account && 
          <>
            <button onClick={CreateProposal}>Create Proposal</button>
            <button onClick={Submit}>Vote</button>
            <button onClick={GetScores}>Get Scores</button>

            {scores && JSON.stringify(scores)}
            {error && JSON.stringify(error)}
          </>
        }
        </div>
    </>
  )
}

export default App
