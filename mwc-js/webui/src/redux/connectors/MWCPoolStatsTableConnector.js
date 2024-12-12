
import { connect } from 'react-redux'
import { MWCPoolStatsTableComponent } from '../../containers/MWCPoolData/MWCPoolStatsTable'
import {
  fetchNetworkData
} from '../actions/networkDataActions.js'

const mapStateToProps = (state) => {
  return {
    historicalNetworkData: state.networkData.historical || [],
    historicalMWCPoolData: state.mwcPoolData.historical || [],
    latestBlockHeight: state.networkData.latestBlock.height || 0
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchNetworkData: () => dispatch(fetchNetworkData())
  }
}

export const MWCPoolStatsTableConnector = connect(mapStateToProps, mapDispatchToProps)(MWCPoolStatsTableComponent)
