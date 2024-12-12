// @flow
import { API_URL_V2 } from '../../config.js'
import { BLOCK_RANGE } from '../../constants/dataConstants.js'
import { type Dispatch, type GetState } from '../../types.js'

export const fetchMWCPoolData = (start: number = 0) => async (dispatch: Dispatch, getState: GetState) => {
  try {
    const state = getState()
    const latestBlockHeight = state.networkData.latestBlock.height || 0
    if (latestBlockHeight === 0) return
    const previousData = state.mwcPoolData.historical
    let previousMaxBlockHeight = latestBlockHeight - BLOCK_RANGE
    previousData.forEach(block => {
      if (block.height > previousMaxBlockHeight) previousMaxBlockHeight = block.height
    })
    const blockDifference = latestBlockHeight - previousMaxBlockHeight
    const url = `${API_URL_V2}pool/stats/${latestBlockHeight},${blockDifference}/gps,height,total_blocks_found,active_miners,timestamp,edge_bits`
    const newMWCPoolDataResponse = await fetch(url)
    if (!newMWCPoolDataResponse.ok) return
    const newMWCPoolData = await newMWCPoolDataResponse.json()
    const newFormattedMWCPoolData = newMWCPoolData.map((block) => {
      return {
        ...block,
        share_counts: JSON.parse(block.share_counts)
      }
    })
    const concatenatedMWCPoolData = [...previousData, ...newFormattedMWCPoolData]
    const numberToRemove = concatenatedMWCPoolData.length > BLOCK_RANGE ? concatenatedMWCPoolData.length - BLOCK_RANGE : 0
    const newHistoricalData = concatenatedMWCPoolData.slice(numberToRemove)
    dispatch({ type: 'MWC_POOL_DATA', data: { historical: newHistoricalData } })
  } catch (e) {
    console.log('Error: ', e)
  }
}

export const fetchMWCPoolLastBlock = (start: number = 0) => async (dispatch: Dispatch, getState: GetState) => {
  try {
    const url = `${API_URL_V2}pool/block`
    const MWCPoolLastBlockDataResponse = await fetch(url)
    if (!MWCPoolLastBlockDataResponse.ok) return
    const MWCPoolLastBlockData = await MWCPoolLastBlockDataResponse.json()
    dispatch({ type: 'MWC_POOL_LAST_BLOCK_MINED', data: { lastBlockMined: MWCPoolLastBlockData.timestamp } })
  } catch (e) {
    console.log('Error: ', e)
  }
}

export const fetchMWCPoolRecentBlocks = () => async (dispatch: Dispatch, getState: GetState) => {
  try {
    const state = getState()
    const minedBlockAlgos = state.networkData.minedBlockAlgos
    const latestBlockHeight = state.networkData.latestBlock.height || 0
    if (latestBlockHeight === 0) return
    const url = `${API_URL_V2}pool/blocks/${latestBlockHeight},20`
    const MWCPoolRecentBlocksResponse = await fetch(url)
    if (!MWCPoolRecentBlocksResponse.ok) return
    const MWCPoolRecentBlocksData = await MWCPoolRecentBlocksResponse.json()
    const MWCPoolRecentBlockWithEdgeBits = MWCPoolRecentBlocksData.map(block => {
      let edge_bits = 31
      if (minedBlockAlgos.c31.includes(block.height)) edge_bits = 31
      return {
        ...block,
        edge_bits
      }
    })
    dispatch({
      type: 'MWC_POOL_RECENT_BLOCKS',
      data: MWCPoolRecentBlockWithEdgeBits
    })
  } catch (e) {

  }
}

export const fetchMWCPoolSharesSubmitted = (start: number = 0) => async (dispatch: Dispatch, getState: GetState) => {
  try {
    const state = getState()
    const latestBlockHeight = state.networkData.latestBlock.height || 0
    if (latestBlockHeight === 0) return
    const previousData = state.mwcPoolData.sharesSubmitted
    let previousMaxBlockHeight = latestBlockHeight - BLOCK_RANGE
    previousData.forEach(block => {
      if (block.height > previousMaxBlockHeight) previousMaxBlockHeight = block.height
    })
    const blockDifference = latestBlockHeight - previousMaxBlockHeight
    const url = `${API_URL_V2}pool/stats/${latestBlockHeight},${blockDifference}/shares_processed,total_shares_processed,active_miners,height`
    const newSharesSubmittedDataResponse = await fetch(url)
    if (!newSharesSubmittedDataResponse.ok) return
    const newSharesSubmittedData = await newSharesSubmittedDataResponse.json()
    const concatenatedMWCPoolShareData = [...previousData, ...newSharesSubmittedData]
    const numberToRemove = concatenatedMWCPoolShareData.length > BLOCK_RANGE ? concatenatedMWCPoolShareData.length - BLOCK_RANGE : 0
    const sharesSubmittedData = concatenatedMWCPoolShareData.slice(numberToRemove)
    dispatch({ type: 'MWC_POOL_SHARES_SUBMITTED', data: { sharesSubmittedData } })
  } catch (e) {
    console.log('Error: ', e)
  }
}

export const fetchMWCPoolBlocksMined = () => async (dispatch: Dispatch, getState: GetState) => {
  try {
    const state = getState()
    const minedBlockAlgos = state.networkData.minedBlockAlgos
    const previousData = {
      ...state.mwcPoolData.poolBlocksMined,
      orphaned: state.mwcPoolData.poolBlocksOrphaned
    }
    const latestBlockHeight = state.networkData.latestBlock.height || 0
    if (latestBlockHeight === 0) return
    let combinedMaxBlockHeight = Math.max(Math.max(...previousData.c31), Math.max(...previousData.orphaned))
    combinedMaxBlockHeight = isFinite(combinedMaxBlockHeight) ? combinedMaxBlockHeight : 0
    const blockDifference = combinedMaxBlockHeight ? (latestBlockHeight - combinedMaxBlockHeight) : BLOCK_RANGE
    const url = `${API_URL_V2}pool/blocks/${latestBlockHeight},${blockDifference}`
    const MWCPoolBlocksMinedResponse = await fetch(url)
    if (!MWCPoolBlocksMinedResponse.ok) return
    const MWCPoolBlocksMinedData = await MWCPoolBlocksMinedResponse.json()
    // turn them into a basic array
    const c31BlocksFound = []
    const c31BlocksWithTimestamps = {}
    const blocksOrphaned = []
    MWCPoolBlocksMinedData.forEach((block) => {
      if (block.state === 'new') {
        if (minedBlockAlgos.c31.includes(block.height)) {
          c31BlocksFound.push(block.height)
          c31BlocksWithTimestamps[block.height] = { height: block.height, timestamp: block.timestamp }
        }
      } else if (block.state === 'orphan') {
        blocksOrphaned.push(block.height)
      }
    })
    const updatedPoolBlocksMined = {
      c31: [...previousData.c31, ...c31BlocksFound],
      orphaned: [...previousData.orphaned, ...blocksOrphaned],
      c31WithTimestamps: { ...previousData.c31BlocksWithTimestamps, ...c31BlocksWithTimestamps }
    }
    updatedPoolBlocksMined.c31.filter(height => (height > latestBlockHeight - BLOCK_RANGE))
    updatedPoolBlocksMined.orphaned.filter(height => (height > latestBlockHeight - BLOCK_RANGE))
    dispatch({
      type: 'POOL_BLOCKS_MINED',
      data: {
        c31BlocksFound: updatedPoolBlocksMined.c31,
        blocksOrphaned: updatedPoolBlocksMined.orphaned,
        c31BlocksWithTimestamps: updatedPoolBlocksMined.c31WithTimestamps
      }
    })
  } catch (e) {
    console.log('getchMWCPoolBlocksMined error: ', e)
  }
}
