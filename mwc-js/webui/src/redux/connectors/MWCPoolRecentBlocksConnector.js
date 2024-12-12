
import { connect } from 'react-redux'
import { BlockRange } from '../../containers/BlockRange/BlockRange.js'
import { fetchMWCPoolRecentBlocks } from '../actions/mwcPoolDataActions.js'

const mapStateToProps = (state) => {
  return {
    latestBlockHeight: state.networkData.latestBlock.height,
    recentBlocks: state.mwcPoolData.recentBlocks || [],
    graphTitle: 'Blocks Found by Pool'
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchBlockRange: (endBlockHeight?: null | number, rangeSize?: number) => dispatch(fetchMWCPoolRecentBlocks(endBlockHeight, rangeSize))
  }
}

export const MWCPoolRecentBlocksConnector = connect(mapStateToProps, mapDispatchToProps)(BlockRange)
