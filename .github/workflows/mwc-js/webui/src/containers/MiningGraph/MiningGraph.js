import React, { Component } from 'react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, ReferenceLine } from 'recharts'
import { C31_COLOR } from '../../custom/custom.js'

export class MiningGraphComponent extends Component {
  constructor (props) {
    super(props)

    this.toggle = this.toggle.bind(this)
    this.state = {
      activeTab: '1'
    }
  }

  toggle (tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      })
    }
  }

  UNSAFE_componentWillMount () {
    const { getMinedBlocksAlgos } = this.props
    getMinedBlocksAlgos()
  }

  componentDidUpdate (prevProps) {
    const { latestBlockHeight, getMinedBlocksAlgos } = this.props
    if (prevProps.latestBlockHeight !== latestBlockHeight) {
      getMinedBlocksAlgos()
    }
  }

  render () {
    const { miningData, poolBlocksMined, poolBlocksOrphaned, decimals } = this.props
    // calculations for graphs
    const graphRateData = {}
    const maximums = { C31: 0 }
    miningData.forEach((block) => {
      if (block.height % 5 === 0) {
        if (block.gps) {
          block.gps.forEach((algo) => {
            if (!graphRateData[`C${algo.edge_bits}`]) {
              graphRateData[`C${algo.edge_bits}`] = []
            }
            if (maximums[`C${algo.edge_bits}`] < algo.gps) {
              maximums[`C${algo.edge_bits}`] = algo.gps
            }
            graphRateData[`C${algo.edge_bits}`].push({
              difficulty: block.difficulty,
              gps: algo.gps,
              height: block.height,
              timestamp: block.timestamp
            })
          })
        }
      }
    })
    const COLORS = {
      C31: C31_COLOR
    }
    delete graphRateData['C29']
    // const algos = Object.keys(graphRateData)
    // let graphIterator = 0
    const poolBlockLines = { c31: [] }
    for (const block in poolBlocksMined.c31BlocksWithTimestamps) {
      poolBlockLines.c31.push(poolBlocksMined.c31BlocksWithTimestamps[block])
    }
    return (
      <div id='fireworksContainer' className='mainPicture miningGraphContainer'>
        <ResponsiveContainer width='100%' height={270}>
          <LineChart isAnimationActive={false} data={graphRateData['C31']}>
            <XAxis tickCount={7} tickFormatter={(value) => new Date(value * 1000).toLocaleTimeString()} dataKey='timestamp' type={'number'} domain={['dataMin', new Date().getTime() / 1000]} />
            <Legend verticalAlign='top' height={36}/>
            <YAxis tickFormatter={(value) => parseFloat(value).toFixed(decimals)} yAxisId='left' stroke={C31_COLOR} orientation='left' dataKey={'gps'} type={'number'} domain={[0, 1.2 * maximums['C31']]} />
            <Line dot={false} yAxisId='left' stroke={C31_COLOR} dataKey='gps' name={`Graph Rate`} />
            <Tooltip content={<NetworkDataCustomTooltip />} />
            {miningData.map((block) => {
              if (poolBlocksOrphaned.indexOf(block.height) > -1) {
                return <ReferenceLine key={block.height} yAxisId={'left'} isFront x={block.timestamp} stroke={'#777'} strokeDasharray='7 7' />
              } else {
                return null
              }
            })}
            {poolBlockLines.c31.map(block => {
              return <ReferenceLine key={block.height} yAxisId={'left'} isFront x={block.timestamp} stroke={COLORS.C31} />
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
  }
}

export class NetworkDataCustomTooltip extends Component {
  render () {
    const { active } = this.props

    if (active) {
      const { payload } = this.props
      if (!payload) return null
      return (
        <div className='custom-network-data-tooltip'>
          <p>Block: {payload[0].payload.height}</p>
          <p>Timestamp: {payload[0].payload.timestamp}</p>
          <p>Time: {new Date(payload[0].payload.timestamp * 1000).toLocaleTimeString()}</p>
          <p>GPS: {payload[0].payload.gps}</p>
          <p>Difficulty: {payload[0].payload.difficulty}</p>
        </div>
      )
    }
    return null
  }
}
