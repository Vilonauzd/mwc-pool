
import { connect } from 'react-redux'
import { MinerPaymentComponent } from '../../containers/MinerPayment/MinerPayment.js'
import {
  fetchMinerPaymentTxSlate,
  finalizeTxSlate,
  getLatestMinerPayments,
  setPaymentMethodSetting
} from '../actions/minerDataActions.js'

const mapStateToProps = (state) => ({
  isPaymentSettingProcessing: state.minerData.isPaymentSettingProcessing,
  isTxSlateLoading: state.minerData.isTxSlateLoading,
  paymentFormFeedback: state.minerData.paymentFormFeedback,
  minerPaymentTxSlate: state.minerData.minerPaymentTxSlate,
  paymentMethod: state.minerData.paymentData.method,
  minPayout: state.minerData.paymentData.min_payout,
  enableAutoPayout: state.minerData.paymentData.enable_auto_payout,
  payoutScript: state.minerData.payoutScript,
  lastestBlockHeight: state.networkData.latestBlock.height,
  dueAmount: state.minerData.paymentData.amount
})

const mapDispatchToProps = (dispatch) => {
  return {
    fetchMinerPaymentTxSlate: () => dispatch(fetchMinerPaymentTxSlate()),
    getLatestMinerPayments: () => dispatch(getLatestMinerPayments()),
    finalizeTxSlate: (slate: any) => dispatch(finalizeTxSlate(slate)),
    setPaymentMethodSetting: (formState: any) => dispatch(setPaymentMethodSetting(formState)),
    clearTxSlate: () => dispatch({ type: 'MINER_PAYMENT_TX_SLATE_CLEAR', data: null }),
    clearPaymentFormFeedback: () => dispatch({ type: 'PAYMENT_FORM_FEEDBACK', data: null }),
    rejectZeroBalancePayment: () => dispatch({ type: 'PAYMENT_FORM_FEEDBACK', data: { color: 'danger', message: "Don't be silly... your balance is zero." } }),
    rejectEmptyRecipient: () => dispatch({ type: 'PAYMENT_FORM_FEEDBACK', data: { color: 'danger', message: 'Wallet & Port cannot be empty' } })
  }
}

export const MinerPaymentConnector = connect(mapStateToProps, mapDispatchToProps)(MinerPaymentComponent)
