
import { connect } from 'react-redux'
import { MWCPoolSharesSubmittedComponent } from '../../containers/MWCPoolData/MWCPoolSharesSubmitted.js'
import { fetchMWCPoolSharesSubmitted } from '../actions/mwcPoolDataActions.js'

const mapStateToProps = (state) => {
  return {
    sharesSubmitted: state.mwcPoolData.sharesSubmitted,
    latestBlockHeight: state.networkData.latestBlock.height || 0
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchMWCPoolSharesSubmitted: () => dispatch(fetchMWCPoolSharesSubmitted())
  }
}

export const MWCPoolSharesSubmittedConnector = connect(mapStateToProps, mapDispatchToProps)(MWCPoolSharesSubmittedComponent)
