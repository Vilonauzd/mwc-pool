// @flow

import React, { Component } from 'react'
import { Row, Col, Table, FormGroup, Label, Input, Alert } from 'reactstrap'
import { HashLink } from 'react-router-hash-link'
import { C31_COLOR } from '../../custom/custom.js'
import { RigGraphConnector } from '../../redux/connectors/RigGraphConnector.js'
import { nanoMWCToMWC, getMinerBlockRewardData, calculateDailyEarningFromGps } from '../../utils/utils.js'
import { BLOCK_RANGE } from '../../constants/dataConstants.js'
import { type MinerBlockData } from '../../types.js'
import ReactTooltip from 'react-tooltip'

export type MinerDataComponentStateProps = {
    minerData: MinerBlockData,
    latestBlockHeight: number,
    poolBlocksMined: { c31: Array<number>},
    latestBlockMWCEarned: number,
    latestBlock: Object,
    amount: number,
    minerImmatureBalance: number,
    totalPayoutsAmount: number,
    minerShareData: Object,
    networkData: Array<Object>,
    MWCPoolData: Array<Object>,
    MWCPoolRecentBlocks: Array<Object>
}

export type MinerDataComponentDispatchProps = {
    fetchMinerData: () => void,
    fetchMinerPaymentData: () => void,
    fetchMinerImmatureBalance: () => void,
    getLatestMinerPaymentRange: () => void,
    fetchMinerShareData: () => void,
    fetchNetworkData: () => void,
    fetchMWCPoolData: () => void,
    fetchMWCPoolRecentBlocks: () => void
}

export type MinerDataComponentProps = MinerDataComponentDispatchProps & MinerDataComponentStateProps

type MinerDataComponentState = {
  faderStyleId: string,
  matureBalanceStyleId: string,
  immatureBalanceStyleId: string,
  showTotal: boolean
}

export class RigDataComponent extends Component<MinerDataComponentProps, MinerDataComponentState> {
  constructor (props: MinerDataComponentProps) {
    super(props)
    this.state = {
      faderStyleId: 'blockHeight1',
      matureBalanceStyleId: 'balance1',
      immatureBalanceStyleId: 'balance1',
      selectedRigWorker: 'Total',
      showTotal: true
    }
  }

  UNSAFE_componentWillMount () {
    const { latestBlockHeight } = this.props
    if (latestBlockHeight === 0) {
      setTimeout(this.updateData, 2000)
      return
    }
    this.updateData()
  }

  componentDidUpdate (prevProps: MinerDataComponentProps) {
    const { faderStyleId, matureBalanceStyleId, immatureBalanceStyleId } = this.state
    const { latestBlockHeight, amount, minerImmatureBalance } = this.props
    if (prevProps.latestBlockHeight !== latestBlockHeight) {
      console.log('Block heights: ', prevProps.latestBlockHeight, ' vs. ', latestBlockHeight)
      this.updateData()
      this.setState({
        faderStyleId: faderStyleId === 'blockHeight1' ? 'blockHeight2' : 'blockHeight1'
      })
    }
    if (prevProps.amount < amount) {
      this.setState({
        matureBalanceStyleId: matureBalanceStyleId === 'balance1' ? 'balance2' : 'balance1'
      })
    }
    if (prevProps.minerImmatureBalance < minerImmatureBalance) {
      this.setState({
        immatureBalanceStyleId: immatureBalanceStyleId === 'balance1' ? 'balance2' : 'balance1'
      })
    }
  }

  updateData = () => {
    const {
      fetchMinerData,
      fetchMinerShareData,
      fetchMinerPaymentData,
      fetchMinerImmatureBalance,
      getLatestMinerPaymentRange,
      fetchNetworkData,
      fetchMWCPoolData,
      fetchMWCPoolRecentBlocks,
      fetchRigData
    } = this.props
    fetchMinerData()
    fetchMinerPaymentData()
    fetchMinerImmatureBalance()
    getLatestMinerPaymentRange()
    fetchMinerShareData()
    fetchNetworkData()
    fetchMWCPoolData()
    fetchMWCPoolRecentBlocks()
    fetchRigData()
    console.log('UPDATING MINER DATA')
  }

  onChangeRigWorker = (event) => {
    this.setState({
      selectedRigWorker: event.target.value
    })
  }

  onChangeShowTotal = (event) => {
    const value = event.target.checked
    this.setState({
      showTotal: value
    })
  }

  render () {
    const {
      poolBlocksMined,
      latestBlock,
      amount,
      minerImmatureBalance,
      totalPayoutsAmount,
      // minerShareData,
      networkData,
      mwcPoolData,
      mwcPoolRecentBlocks,
      rigGpsData,
      rigWorkers,
      rigShareData
    } = this.props
    const { faderStyleId, matureBalanceStyleId, immatureBalanceStyleId, selectedRigWorker, showTotal } = this.state
    const numberOfRecordedBlocks = rigGpsData.c31
    const noBlocksAlertSyntax = 'Mining data may up to 10 blocks to show up after you start mining'

    let maxPoolBlockHeight = 0
    mwcPoolData.forEach(block => {
      if (block.height > maxPoolBlockHeight) maxPoolBlockHeight = block.height
    })
    let mwcPoolLatestBlock = 0
    mwcPoolRecentBlocks.forEach(block => {
      if (block.height > mwcPoolLatestBlock && block.height < maxPoolBlockHeight) mwcPoolLatestBlock = block.height
    })
    const minerBlockRewardData = getMinerBlockRewardData(mwcPoolLatestBlock, networkData, mwcPoolData, rigShareData, selectedRigWorker)
    const latestBlockMWCEarned = minerBlockRewardData ? minerBlockRewardData.userReward : 'n/a'

    // find the latest GPS data for each algo
    let c31LatestGraphRate = 0
    if (rigGpsData.c31.length > 0) {
      const maxHeightFinder = (accumulator, currentValue) => {
        if (currentValue.height > accumulator.height) {
          return {
            height: currentValue.height,
            gps: currentValue[selectedRigWorker]
          }
        }
      }

      const latestC31Block = rigGpsData.c31.reduce(maxHeightFinder)
      c31LatestGraphRate = latestC31Block.gps ? latestC31Block.gps.toFixed(2) : 0
    }
    const graphRates = { c31: [] }
    const payWindowAverage = { c31: [] }
    for (const algo in rigGpsData) {
      rigGpsData[algo].forEach((block) => {
        if ((block.height >= latestBlock.height - 245) && (block.height < latestBlock.height - 5)) {
          payWindowAverage[algo].push(block[selectedRigWorker])
        }
        if (block[selectedRigWorker]) {
          graphRates[algo].push(block[selectedRigWorker])
        }
      })
    }
    // MUST USE 240 / 5 = 48 BLOCKS BECAUSE ONLY GET ONE OF EVERY 5 BLOCKS!!!
    const paymentWindowC31Average = payWindowAverage.c31.length ? (payWindowAverage.c31.reduce((a, b) => a + (b || 0), 0) / 48).toFixed(2) : 0
    const c31Average = graphRates.c31.length ? (graphRates.c31.reduce((a, b) => a + b, 0) / 288).toFixed(2) : 0
    const nowTimestamp = Date.now()
    const latestBlockTimeAgo = latestBlock.timestamp ? Math.floor((nowTimestamp / 1000) - latestBlock.timestamp) : ''
    const mergedPoolBlocksMined = poolBlocksMined.c31
    let latestBlockMWCEarnedSyntax
    if (typeof latestBlockMWCEarned === 'number' && latestBlockMWCEarned > 0) {
      latestBlockMWCEarnedSyntax = `${latestBlockMWCEarned.toFixed(4)} MWC`
    } else if (latestBlock.height - Math.max(...mergedPoolBlocksMined) < 1) {
      latestBlockMWCEarnedSyntax = 'Calculating...'
    } else {
      latestBlockMWCEarnedSyntax = 'n/a'
    }
    const readableAmount = amount > 0 ? nanoMWCToMWC(amount).toFixed(4) : 0
    const minerImmatureBalanceSyntax = (!isNaN(minerImmatureBalance) && minerImmatureBalance > 0) ? `${nanoMWCToMWC(minerImmatureBalance).toFixed(4)} MWC` : 'n/a'
    const nextBlockMinerRewardData = getMinerBlockRewardData(maxPoolBlockHeight, networkData, mwcPoolData, rigShareData, selectedRigWorker)
    const estimatedShareOfNextBlockReward = nextBlockMinerRewardData ? nextBlockMinerRewardData.userReward : 'n/a'
    const nextBlockRewardSyntax = typeof estimatedShareOfNextBlockReward === 'number' ? `${estimatedShareOfNextBlockReward.toFixed(4)} MWC` : 'n/a'
    const estimatedDailyEarningsFromGps = 5 * calculateDailyEarningFromGps(networkData, rigGpsData, latestBlock.height, selectedRigWorker)
    const estimatedDailyEarningsSyntax = isNaN(estimatedDailyEarningsFromGps) ? 'n/a' : `${estimatedDailyEarningsFromGps.toFixed(4)} MWC`
    const isTotalRigWorker = selectedRigWorker === 'Total'
    return (
      <Row xs={12} md={12} lg={12} xl={12}>
        <Col xs={12} md={12} lg={12} xl={12}>
          <h4 className='page-title'>Graph Rate</h4>
          <div style={{ textAlign: 'center', marginBottom: 12 }}>{(numberOfRecordedBlocks === 0) && <Alert color='warning' style={{ textAlign: 'center', display: 'inline' }}>{noBlocksAlertSyntax}</Alert>}</div>
          <RigGraphConnector
            miningData={rigGpsData}
            poolBlocksMined={poolBlocksMined}
            decimals={2}
            showTotal={showTotal}
          />
        </Col>
        <Col xs={12} md={12} lg={12} xl={12}>
          <FormGroup>
            <Label for="exampleSelect" style={{ fontSize: '1.2rem' }}>Select Rig-Worker:</Label><br />
            <Input onChange={this.onChangeRigWorker} type="select" name="select" id="exampleSelect" style={{ display: 'inline', width: 'auto', paddingHorizontal: 16, minWidth: '200px' }}>
              {rigWorkers.map(rigWorkerName => {
                return <option style={{ paddingHorizontal: 8 }} value={rigWorkerName} key={rigWorkerName}>{rigWorkerName}</option>
              })}
            </Input><br /><br /><span style={{ marginLeft: '10px' }}><HashLink to="/info#workerRigConfig">Worker &amp; Rigs Instructions</HashLink></span>
            <br /><br />
            <FormGroup check>
              <Label check><Input type="checkbox" onChange={this.onChangeShowTotal} checked={showTotal} />{' '}Show Total Graph Line</Label>
            </FormGroup>
          </FormGroup>
          <h4 className='page-title' style={{ marginBottom: 36 }}>Rig Stats</h4>
          <Row>
            <Col xs={12} md={6} lg={6} xl={6}>
              <Table size='sm'>
                <tbody>
                  <tr>
                    <td>Current Graph Rate</td>
                    <td><span style={{ color: C31_COLOR }}>C31: {c31LatestGraphRate} gps</span></td>
                  </tr>
                  <tr>
                    <td>Chain Height</td>
                    <td id={faderStyleId}>{latestBlock.height}</td>
                  </tr>
                  <tr>
                    <td>Last Network Block</td>
                    <td>{latestBlockTimeAgo} sec ago</td>
                  </tr>
                  <tr>
                    <td>Miner 240--Block Average <span data-tip={`When mining during the past 240 blocks, these graph rates are what you have averaged `} style={{ verticalAlign: 'super', fontSize: '0.8rem' }}>?</span><ReactTooltip className={'customTheme'} /></td>
                    <td><span style={{ color: C31_COLOR }}>C31: {paymentWindowC31Average} gps</span></td>
                  </tr>
                  <tr>
                    <td>Miner {BLOCK_RANGE}-Block Average <span data-tip={`When mining during the past ${BLOCK_RANGE} blocks, these graph rates are what you have averaged `} style={{ verticalAlign: 'super', fontSize: '0.8rem' }}>?</span><ReactTooltip className={'customTheme'} /></td>
                    <td><span style={{ color: C31_COLOR }}>C31: {c31Average} gps</span></td>
                  </tr>
                </tbody>
              </Table>
            </Col>
            <Col xs={12} md={6} lg={6} xl={6}>
              <Table size='sm'>
                <tbody>
                  <tr className={'betaEstimates'}>
                    <td>Estimated Share of Last Pool Block <span data-tip='Your estimated share of the last pool block, based on your work done during 240-block period leading up to block reward' style={{ verticalAlign: 'super', fontSize: '0.8rem' }}>?</span><ReactTooltip className={'customTheme'} /></td>
                    <td>{latestBlockMWCEarnedSyntax}</td>
                  </tr>
                  <tr className={'betaEstimates'}>
                    <td>Estimated Share of Next Pool Block <span data-tip='Your estimated share of the next pool block, based on your work done during the past 240 blocks' style={{ verticalAlign: 'super', fontSize: '0.8rem' }}>?</span><ReactTooltip className={'customTheme'} /></td>
                    <td>{nextBlockRewardSyntax}</td>
                  </tr>
                  <tr className={'betaEstimates'}>
                    <td>Estimated Average Daily Earnings <span data-tip='Your estimated daily earnings based on your work done during the past 240 blocks' style={{ verticalAlign: 'super', fontSize: '0.8rem' }}>?</span><ReactTooltip className={'customTheme'} /></td>
                    <td>{estimatedDailyEarningsSyntax}</td>
                  </tr>
                  <tr style={{ display: isTotalRigWorker ? 'table-row' : 'none' }}>
                    <td>Available Balance</td>
                    <td id={matureBalanceStyleId}>{readableAmount} MWC</td>
                  </tr>
                  <tr style={{ display: isTotalRigWorker ? 'table-row' : 'none' }}>
                    <td>Immature Balance</td>
                    <td id={immatureBalanceStyleId}>{minerImmatureBalanceSyntax}</td>
                  </tr>
                  <tr style={{ display: isTotalRigWorker ? 'table-row' : 'none' }}>
                    <td>Total Payouts</td>
                    <td>{nanoMWCToMWC(totalPayoutsAmount).toFixed(4)} MWC</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}
