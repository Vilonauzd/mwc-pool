import React, { Component } from 'react'
import { Row, Table, Progress } from 'reactstrap'
import _ from 'lodash'

export class MWCPoolStatsTableComponent extends Component {
  UNSAFE_componentWillMount () {
    this.fetchMWCPoolTableStats()
  }

  componentDidUpdate (prevProps) {
    const { latestBlockHeight } = this.props
    if (prevProps.latestBlockHeight !== latestBlockHeight) {
      this.fetchMWCPoolTableStats()
    }
  }

  fetchMWCPoolTableStats = () => {
    const { fetchNetworkData } = this.props
    fetchNetworkData()
  }

  render () {
    const { historicalMWCPoolData, historicalNetworkData } = this.props
    if (historicalNetworkData.length === 0) return null
    let c31Share = 0
    let poolBlock31Rate = 0
    let networkBlock31Rate = 0

    const poolBlockIndex = historicalMWCPoolData.length - 1
    const poolBlock = historicalMWCPoolData[poolBlockIndex]
    if (historicalMWCPoolData[poolBlockIndex]) {
      const poolBlock31Data = _.find(poolBlock.gps, (graph) => graph.edge_bits === 31)
      if (poolBlock31Data) {
        poolBlock31Rate = poolBlock31Data.gps.toFixed(2)
      }

      const networkBlockIndex = historicalNetworkData.length - 1
      const networkBlock = historicalNetworkData[networkBlockIndex]
      const networkBlock31Data = _.find(networkBlock.gps, (graph) => graph.edge_bits === 31)
      networkBlock31Rate = networkBlock31Data ? networkBlock31Data.gps.toFixed(2) : 0
      c31Share = Math.max(0, Math.min(100, networkBlock31Rate ? (poolBlock31Rate / networkBlock31Rate * 100) : 0)).toFixed(2)
    }

    return (
      <Row xs={12} md={12} lg={12} xl={12}>
        <h4 className='page-title' style={{ marginBottom: 36 }}>Pool Market Share</h4>
        <Table size='sm' responsive hover>
          <thead>
            <tr>
              <th>Stat</th>
              <th className='center'>Pool</th>
              <th>Network</th>
              <th>Market Share</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope='row'>Average C31 gps</th>
              <td>{poolBlock31Rate}</td>
              <td>{networkBlock31Rate}</td>
              <td>{!isNaN(c31Share) ? `${c31Share} %` : 'n/a'} <Progress color='success' value={c31Share} /></td>
            </tr>
          </tbody>
        </Table>
      </Row>
    )
  }
}
