import React, { Component } from 'react'
import { Row, Table } from 'reactstrap'
import { nanoMWCToMWC } from '../../utils/utils.js'
import { CANCELED_PAYMENT_COLOR, EXPIRED_PAYMENT_COLOR } from '../../custom/custom.js'
import { FaDownload } from 'react-icons/fa'

export class LatestMinerPayments extends Component {
  componentDidMount () {
    this.getLatestMinerPaymentRange()
  }

  componentDidUpdate (prevProps) {
    const { latestBlockHeight } = this.props
    if (prevProps.latestBlockHeight !== latestBlockHeight) {
      this.getLatestMinerPaymentRange()
    }
  }

  getLatestMinerPaymentRange = () => {
    const { getLatestMinerPaymentRange } = this.props
    getLatestMinerPaymentRange()
  }

  handleDownloadFile = (txData) => {
    const element = document.createElement('a')
    const jsonData = JSON.stringify(txData)
    const file = new Blob([jsonData], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `${txData.id}.tx`
    document.body.appendChild(element) // Append anchor to body
    element.click() // Trigger click
    document.body.removeChild(element) // Remove anchor from body
  }

  render () {
    const { latestMinerPayments } = this.props
    let paymentRows = []
    if (latestMinerPayments.length) {
      latestMinerPayments.sort((a, b) => b.timestamp - a.timestamp)
      paymentRows = latestMinerPayments.map(payment => {
        let line = null
        let color = null
        if (payment.state === 'expired') {
          line = 'line-through'
          color = EXPIRED_PAYMENT_COLOR
        } else if (payment.state === 'canceled') {
          line = 'line-through'
          color = CANCELED_PAYMENT_COLOR
        }
        const textDecoration = {
          textDecorationLine: line,
          textDecorationColor: color
        }
        let txId = ''
        let txData = ''
        try {
          txData = JSON.parse(payment.tx_data)
          txId = txData ? txData.id : ''
        } catch (e) {
          console.log('Could not parse')
        }
        return (
          <tr key={payment.id}>
            <td style={textDecoration}>{payment.id}</td>
            <td style={textDecoration}>{txId}</td>
            <td style={textDecoration}>{payment.address}</td>
            <td style={textDecoration}>{nanoMWCToMWC(payment.amount)} MWC</td>
            <td style={textDecoration}>{nanoMWCToMWC(payment.fee)} MWC</td>
            <td style={textDecoration}>{payment.state}</td>
            <td style={textDecoration}>{payment.height}</td>
            <td style={textDecoration}>
              {new Date(payment.timestamp).toLocaleString()}
            </td>
            <td style={{ textAlign: 'right', ...textDecoration }}>
              {(payment.method === 'file' && payment.state === 'sent') && (
                <FaDownload
                  style={{ cursor: 'pointer' }}
                  onClick={() => this.handleDownloadFile(txData)}
                />
              )}
            </td>
          </tr>
        )
      })
    }

    return (
      <Row xs={12} md={12} lg={12} xl={12}>
        <h4 className='page-title' style={{ marginBottom: 36 }}>Recent Payouts</h4>
        <Table responsive hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Transaction ID</th>
              <th>Address</th>
              <th>Amount</th>
              <th>Fee</th>
              <th>State</th>
              <th>Block Height</th>
              <th>Time</th>
              <th style={{ textAlign: 'right' }}>File</th>
            </tr>
          </thead>
          <tbody>
            {paymentRows}
          </tbody>
        </Table>
      </Row>
    )
  }
}
