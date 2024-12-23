import React, { Component } from 'react'
import { Row, Col, Table } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { C31_COLOR } from '../../custom/custom.js'
import { MiningGraphConnector } from '../../redux/connectors/MiningGraphConnector.js'
import { BLOCK_RANGE } from '../../constants/dataConstants.js'

export class MWCPoolDataComponent extends Component {
  interval = null
  constructor (props) {
    super(props)
    this.state = {
      faderStyleId: 'blockHeight1'
    }
  }

  componentWillUnmount = () => {
    clearInterval(this.interval)
  }

  UNSAFE_componentWillMount () {
    this.fetchMWCPoolData()
  }

  componentDidUpdate (prevProps) {
    const { latestBlockHeight } = this.props
    const { faderStyleId } = this.state
    if (prevProps.latestBlockHeight !== latestBlockHeight) {
      this.fetchMWCPoolData()
      this.setState({
        faderStyleId: faderStyleId === 'blockHeight1' ? 'blockHeight2' : 'blockHeight1'
      })
    }
  }

  fetchMWCPoolData = () => {
    const { fetchMWCPoolData, fetchMWCPoolLastBlock } = this.props
    fetchMWCPoolData()
    fetchMWCPoolLastBlock()
  }

  render () {
    const { faderStyleId } = this.state
    const { mwcPoolData, activeWorkers, lastBlockMined, poolBlocksMined, latestBlockHeight } = this.props

    let c31LatestGraphRate = 'C31 = 0 gps'
    let averageMinerGraphRate = 0
    let c31PoolPeriodTotalGraphRates = 0
    let c31BlockCount = 0
    if (mwcPoolData.length > 0) {
      const lastBlock = mwcPoolData[mwcPoolData.length - 1]
      const c31 = lastBlock.gps.find(gps => {
        averageMinerGraphRate = activeWorkers ? (gps.gps / activeWorkers).toFixed(2) : 0
        return gps.edge_bits === 31
      })
      if (c31) {
        c31LatestGraphRate = `C31 = ${c31.gps.toFixed(1)} gps`
      }
      mwcPoolData.forEach((block) => {
        const c31BlockGraph = block.gps.find(gps => gps.edge_bits === 31)
        if (c31BlockGraph) {
          c31BlockCount++
          c31PoolPeriodTotalGraphRates = c31PoolPeriodTotalGraphRates + c31BlockGraph.gps
        }
      })
    } else {
      c31LatestGraphRate = '0 gps'
    }

    const c31PoolPeriodAverage = (c31PoolPeriodTotalGraphRates / c31BlockCount).toFixed(1)

    const nowTimestamp = Date.now()
    const lastBlockTimeAgo = Math.floor(nowTimestamp / 1000 - lastBlockMined)
    const totalPoolBlocksMined = mwcPoolData[mwcPoolData.length - 1] ? mwcPoolData[mwcPoolData.length - 1].total_blocks_found : 0
    const cumulativeBlockShare = latestBlockHeight ? (100 * totalPoolBlocksMined / latestBlockHeight).toFixed(2) : 'n/a'
    return (
      <Row xs={12} md={12} lg={12} xl={12}>
        <Col xs={12} md={12} lg={12} xl={12}>
          <MiningGraphConnector
            miningData={mwcPoolData}
            poolBlocksMined={poolBlocksMined}
            decimals={1}
          />
        </Col>
        <Col xs={12} md={12} lg={12} xl={12}>
          <h4 className='page-title' style={{ marginBottom: 36 }}>MWC-Pool Stats</h4>
          <Table size='sm'>
            <tbody>
              <tr>
                <td><FontAwesomeIcon style={{ marginRight: 5 }} size='lg' icon={'chart-line'} /> Graph Rate</td>
                <td><span style={{ color: C31_COLOR }}>{c31LatestGraphRate}</span></td>
              </tr>
              <tr>
                <td>Chain Height</td>
                <td id={faderStyleId}>{latestBlockHeight}</td>
              </tr>
              <tr>
                <td><FontAwesomeIcon style={{ marginRight: 5 }} size='lg' icon={'clock'} /> Latest Pool Block</td>
                <td>{lastBlockTimeAgo} sec ago</td>
              </tr>
              <tr>
                <td><FontAwesomeIcon style={{ marginRight: 5 }} size='lg' icon={'desktop'} />Active Miners</td>
                <td>{activeWorkers}</td>
              </tr>
              <tr>
                <td><FontAwesomeIcon style={{ marginRight: 5 }} size='lg' icon={'link'} />Blocks Found</td>
                <td>{totalPoolBlocksMined} ({`${cumulativeBlockShare} %`})</td>
              </tr>
              <tr>
                <td>Pool {BLOCK_RANGE}-Block Average </td>
                <td><span style={{ color: C31_COLOR }}>C31 = {c31PoolPeriodAverage} gps</span></td>
              </tr>
              <tr>
                <td>Average Miner Graph Rate</td>
                <td>{averageMinerGraphRate} gps</td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
    )
  }
}
