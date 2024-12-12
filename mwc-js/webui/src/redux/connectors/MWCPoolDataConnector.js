
import { connect } from 'react-redux'
import { MWCPoolDataComponent } from '../../containers/MWCPoolData/MWCPoolData.js'
import {
  fetchMWCPoolData,
  fetchMWCPoolLastBlock
} from '../actions/mwcPoolDataActions.js'

const mapStateToProps = (state) => {
  const mwcPoolHistoricalData = state.mwcPoolData.historical
  const mwcPoolHistoricalDataLength = mwcPoolHistoricalData.length
  const poolBlocksMined = state.mwcPoolData.poolBlocksMined
  const latestBlockHeight = state.networkData.latestBlock.height
  let activeWorkers = 0
  if (mwcPoolHistoricalDataLength > 0) {
    activeWorkers = mwcPoolHistoricalData[mwcPoolHistoricalDataLength - 1].active_miners
  }
  return {
    mwcPoolData: state.mwcPoolData.historical || [],
    activeWorkers,
    lastBlockMined: state.mwcPoolData.lastBlockMined,
    poolBlocksMined,
    latestBlockHeight
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchMWCPoolData: () => dispatch(fetchMWCPoolData()),
    fetchMWCPoolLastBlock: () => dispatch(fetchMWCPoolLastBlock())
  }
}

export const MWCPoolDataConnector = connect(mapStateToProps, mapDispatchToProps)(MWCPoolDataComponent)
