import React, { Component } from 'react'
import { Table } from 'reactstrap'
import { secondsToHms, nanoMWCToMWC } from '../../utils/utils.js'
import { RATIO_POOL_FEE } from '../../constants/dataConstants.js'

export class MinerPaymentDataComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      faderStyleId: 'balanceChange1'
    }
  }

  UNSAFE_componentWillMount () {
    this.fetchMinerPaymentData()
  }

  componentDidUpdate (prevProps) {
    const { lastestBlockHeight } = this.props
    const { faderStyleId } = this.state
    if (prevProps.lastestBlockHeight !== lastestBlockHeight) {
      this.fetchMinerPaymentData()
      this.setState({
        faderStyleId: faderStyleId === 'balanceChange1' ? 'balanceChange2' : 'balanceChange1'
      })
    }
  }

  fetchMinerPaymentData = () => {
    const { fetchMinerPaymentData, fetchMinerImmatureBalance } = this.props
    fetchMinerPaymentData()
    fetchMinerImmatureBalance()
  }

  render () {
    const {
      amount,
      address,
      lastSuccess,
      failureCount,
      lastTry,
      minerImmatureBalance,
      currentTimestamp,
      totalPayoutsAmount
    } = this.props
    const { faderStyleId } = this.state
    const readableAmount = amount > 0 ? amount : 0
    const lastTryTimeAgo = lastTry ? secondsToHms(currentTimestamp - lastTry) : 'n/a'
    const lastPayoutTimeAgo = lastSuccess ? secondsToHms(currentTimestamp - lastSuccess) : 'n/a'
    const minerImmatureBalanceSyntax = (!isNaN(minerImmatureBalance) && minerImmatureBalance > 0) ? `${nanoMWCToMWC(minerImmatureBalance * RATIO_POOL_FEE).toFixed(9)} MWC` : 'n/a'
    return (
      <div>
        <h4>Payment Info</h4>
        <Table size='sm'>
          <tbody>
            <tr>
              <td>Available Balance</td>
              <td>{nanoMWCToMWC(readableAmount)} MWC</td>
            </tr>
            <tr>
              <td>Immature Balance</td>
              <td id={faderStyleId}>{minerImmatureBalanceSyntax}</td>
            </tr>
            <tr>
              <td>Total Payouts</td>
              <td>{nanoMWCToMWC(totalPayoutsAmount)} MWC</td>
            </tr>
            <tr>
              <td>Payout Address</td>
              <td>{address || 'n/a'}</td>
            </tr>
            <tr>
              <td>Last Payout</td>
              <td>{lastPayoutTimeAgo || 'n/a'}</td>
            </tr>
            <tr>
              <td>Payout Attempt Failures</td>
              <td>{failureCount}</td>
            </tr>
            <tr>
              <td>Last Auto Payout Attempt</td>
              <td>{lastTryTimeAgo}</td>
            </tr>
            <tr>
              <td>Minimum Payout</td>
              <td>0.2 MWC</td>
            </tr>
          </tbody>
        </Table>
      </div>
    )
  }
}
