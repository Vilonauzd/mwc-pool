import React, { Component } from 'react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip, ReferenceLine } from 'recharts'
import { randomColors } from '../../utils/utils.js'
import { C31_COLOR } from '../../custom/custom.js'

export class RigGraphComponent extends Component {
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

  randomColors = []

  UNSAFE_componentWillMount () {
    const { getMinedBlocksAlgos, fetchRigData } = this.props
    getMinedBlocksAlgos()
    setTimeout(fetchRigData, 3000)
    let i = 0
    while (i < 20) {
      this.randomColors.push(randomColors[Math.floor(Math.random() * 40)])
      i++
    }
  }

  componentDidUpdate (prevProps) {
    const { latestBlockHeight, getMinedBlocksAlgos } = this.props
    if (prevProps.latestBlockHeight !== latestBlockHeight) {
      getMinedBlocksAlgos()
    }
  }

  render () {
    const { rigGpsData, rigWorkers, poolBlocksMined, poolBlocksOrphaned, decimals } = this.props
    // calculations for graphs
    // const graphRateData = {}
    // const maximums = { C31: 0 }
    const COLORS = {
      C31: C31_COLOR
    }
    // const algos = Object.keys(rigGpsData)
    // let graphIterator = 0
    const poolBlockLines = { c31: [] }
    for (const block in poolBlocksMined.c31BlocksWithTimestamps) {
      poolBlockLines.c31.push(poolBlocksMined.c31BlocksWithTimestamps[block])
    }
    let rigWorkerIterator = 0
    console.log('re-rendering graph')
    return (
      <div id='fireworksContainer' className='mainPicture miningGraphContainer'>
        <ResponsiveContainer width='100%' height={270}>
          <LineChart isAnimationActive={false} data={rigGpsData.c31}>
            <XAxis tickCount={7} tickFormatter={(value) => new Date(value * 1000).toLocaleTimeString()} dataKey='timestamp' type={'number'} domain={['dataMin', new Date().getTime() / 1000]} />
            <Legend verticalAlign='top' height={36}/>
            <YAxis tickFormatter={(value) => parseFloat(value).toFixed(decimals)} yAxisId='left' stroke={C31_COLOR} orientation='left' type={'number'} domain={[0, dataMax => (dataMax * 1.2)]} />
            {rigWorkers.map(rigWorkerName => {
              rigWorkerIterator++
              return <Line key={rigWorkerName} dot={false} yAxisId='left' stroke={this.randomColors[rigWorkerIterator]} dataKey={rigWorkerName} name={`${rigWorkerName}`} strokeWidth={rigWorkerName === 'Total' ? 4 : 1 } />
            })}
            <Tooltip content={<NetworkDataCustomTooltip rigWorkers={rigWorkers} />} />
            {rigGpsData.c31.map((block) => {
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
      const { payload, rigWorkers } = this.props
      if (!payload || !payload[0]) return null
      return (
        <div className='custom-network-data-tooltip'>
          <p>Block: {payload[0].payload.height}</p>
          <p>Time: {new Date(payload[0].payload.timestamp * 1000).toLocaleTimeString()}</p>
          <p>Difficulty: {payload[0].payload.difficulty}</p>
          {rigWorkers.map(rigWorkerName => {
            if (payload[0].payload[rigWorkerName]) {
              return <p key={rigWorkerName}>{rigWorkerName}: {payload[0].payload[rigWorkerName].toFixed(2)}</p>
            } else {
              return null
            }
          })}
        </div>
      )
    }

    return null
  }
}
