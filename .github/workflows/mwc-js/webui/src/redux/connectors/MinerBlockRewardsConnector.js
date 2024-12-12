// @flow

import { connect } from 'react-redux'
import {
  MinerBlockRewards,
  type MinerBlockRewardsStateProps,
  type MinerBlockRewardsDispatchProps
} from '../../containers/MinerData/MinerBlockRewards.js'
import { fetchNetworkRecentBlocks, fetchNetworkData } from '../actions/networkDataActions.js'
import { fetchMinerShareData } from '../actions/minerDataActions.js'
import { fetchMWCPoolData } from '../actions/mwcPoolDataActions.js'
import { type Dispatch, type State } from '../../types.js'

const mapStateToProps = (state: State): MinerBlockRewardsStateProps => {
  return {
    latestBlockHeight: state.networkData.latestBlock.height,
    recentBlocks: state.mwcPoolData.recentBlocks || [],
    graphTitle: 'Miner Block Rewards',
    minerShareData: state.minerData.minerShareData,
    networkData: state.networkData.historical,
    mwcPoolData: state.mwcPoolData.historical
  }
}

const mapDispatchToProps = (dispatch: Dispatch): MinerBlockRewardsDispatchProps => {
  return {
    fetchBlockRange: (endBlockHeight?: null | number, rangeSize?: number) => dispatch(fetchNetworkRecentBlocks(endBlockHeight, rangeSize)),
    fetchMinerShareData: () => dispatch(fetchMinerShareData()),
    fetchNetworkData: () => dispatch(fetchNetworkData()),
    fetchMWCPoolData: () => dispatch(fetchMWCPoolData())
  }
}

export const MinerBlockRewardsConnector = connect(mapStateToProps, mapDispatchToProps)(MinerBlockRewards)
