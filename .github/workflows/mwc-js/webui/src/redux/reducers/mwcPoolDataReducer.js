// @flow

import { combineReducers } from 'redux'
import type { MWCPoolBlockData, PoolSharesSubmitted, Reducer, Action } from '../../types'

export type MWCPoolState = {
  historical: Array<any>,
  lastBlockMined: number,
  recentBlocks: Array<Object>,
  poolBlocksMined: { c31: Array<number>},
  poolBlocksOrphaned: Array<any>,
  sharesSubmitted: Array<any>
}

export type MWCPoolHistoricalBlockAction = {
  data: {
    historical: Array<MWCPoolBlockData>
  },
  type: 'MWC_POOL_DATA'
}

export const historical = (state: Array<any> = [], action: MWCPoolHistoricalBlockAction) => {
  switch (action.type) {
    case 'MWC_POOL_DATA':
      return action.data.historical
    default:
      return state
  }
}

export type LastMWCPoolBlockMinedAction = { type: 'MWC_POOL_LAST_BLOCK_MINED', data: { lastBlockMined: number } }

export const lastBlockMined = (state: number = 0, action: LastMWCPoolBlockMinedAction) => {
  switch (action.type) {
    case 'MWC_POOL_LAST_BLOCK_MINED':
      return action.data.lastBlockMined
    default:
      return state
  }
}

// recent blocks found by pool with info
export const recentBlocks = (state: Array<Object> = [], action: { type: 'MWC_POOL_RECENT_BLOCKS', data: Array<MWCPoolBlockData>}) => {
  switch (action.type) {
    case 'MWC_POOL_RECENT_BLOCKS':
      return action.data
    default:
      return state
  }
}

export type PoolBlocksMinedAction = {
  type: 'POOL_BLOCKS_MINED',
  data: {
    c31BlocksFound: Array<number>,
    c31BlocksWithTimestamps: { [number]: { height: number, timestamp: number }}
  }
}

// basic array of recent blocks found by pool
export const poolBlocksMined = (state: { c31: Array<number>, c31BlocksWithTimestamps: Object} = { c31: [], c31BlocksWithTimestamps: {} }, action: PoolBlocksMinedAction) => {
  switch (action.type) {
    case 'POOL_BLOCKS_MINED':
      return {
        c31: action.data.c31BlocksFound,
        c31BlocksWithTimestamps: action.data.c31BlocksWithTimestamps
      }
    default:
      return state
  }
}

export type PoolBlocksOrphanedAction = { type: 'POOL_BLOCKS_MINED', data: { blocksOrphaned: Array<number>}}

export const poolBlocksOrphaned = (state: Array<any> = [], action: PoolBlocksOrphanedAction) => {
  switch (action.type) {
    case 'POOL_BLOCKS_MINED':
      return action.data.blocksOrphaned
    default:
      return state
  }
}

export type PoolSharesSubmittedAction = { type: 'MWC_POOL_SHARES_SUBMITTED', data: { sharesSubmittedData: Array<PoolSharesSubmitted> }}

export const sharesSubmitted = (state: Array<any> = [], action: PoolSharesSubmittedAction) => {
  switch (action.type) {
    case 'MWC_POOL_SHARES_SUBMITTED':
      return action.data.sharesSubmittedData
    default:
      return state
  }
}

export const mwcPoolData: Reducer<MWCPoolState, Action> = combineReducers({
  historical,
  lastBlockMined,
  recentBlocks,
  poolBlocksMined,
  poolBlocksOrphaned,
  sharesSubmitted
})
