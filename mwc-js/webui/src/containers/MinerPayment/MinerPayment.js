import React, { Component } from 'react'
import { Col, Container, Row, Card, CardBody, Form, Label, Input, Alert, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import { MinerPaymentDataConnector } from '../../redux/connectors/MinerPaymentDataConnector.js'
import { LatestMinerPaymentsConnector } from '../../redux/connectors/LatestMinerPaymentsConnector.js'
import classnames from 'classnames'
import Blob from 'blob'
import Spinner from 'react-spinkit'
import ReactGA from 'react-ga'
// import Switch from '@mui/material/Switch'
// import FormControlLabel from '@mui/material/FormControlLabel'

export class MinerPaymentComponent extends Component {
  constructor (props) {
    super(props)
    const { paymentMethod, paymentType, enableAutoPayout, minPayout } = props
    console.log(enableAutoPayout)
    this.state = {
      paymentMethod: paymentMethod || 'mwcmqs',
      paymentType: paymentType || 'manual',
      recipient: '',
      enableAutoPayout: enableAutoPayout || false,
      minPayout: minPayout || 0.5
    }
    ReactGA.initialize('UA-132063819-1')
    ReactGA.pageview(window.location.pathname + window.location.search)
  }

  numbers
  renderSpinner = (height) => {
    return <Spinner name='circle' color='white' fadeIn='none' style={{ marginLeft: 'auto', marginRight: 'auto', height }} />
  }

  onAutoPayoutchange = (event) => {
    const isChecked = event.target.checked
    this.setState({
      enableAutoPayout: isChecked
    })
  }

  onPaymentTypeChange = (paymentType) => {
    const { clearPaymentFormFeedback, clearTxSlate } = this.props
    let { recipient } = this.state
    const { paymentMethod } = this.state
    clearPaymentFormFeedback()
    clearTxSlate()
    if (paymentType === 'manual') {
      paymentType = 'manual'
      recipient = ''
    } else if (paymentType === 'automatic') {
      paymentType = 'automatic'
      recipient = ''
    }
    this.setState({
      paymentType,
      paymentMethod,
      recipient
    })
  }

  onPaymentMethodChange = (value) => {
    const { clearPaymentFormFeedback, clearTxSlate } = this.props
    clearPaymentFormFeedback()
    clearTxSlate()
    this.setState({
      paymentMethod: value
    })
  }

  onChangeTextInput = (event) => {
    this.setState({
      recipient: event.target.value
    })
  }

  componentDidMount = () => {
    const { getLatestMinerPayments } = this.props
    getLatestMinerPayments()
  }

  renderPayoutOptions = () => {
    const { paymentType, paymentMethod } = this.state
    return (
      <div style={{ marginBottom: '20px' }}>
        <legend className='col-form-label' style={{ marginBottom: '10px' }}>Payment Method:</legend>
        <button type="button" className={`btn btn-${paymentMethod === 'mwcmqs' ? 'light' : 'dark'}`}
          onClick={() => this.onPaymentMethodChange('mwcmqs')}>
            MWCMQS
        </button>
        <button type="button" className={`btn btn-${paymentMethod === 'http' ? 'light' : 'dark'}`}
          onClick={() => this.onPaymentMethodChange('http')}>
            HTTP
        </button>
        { paymentType === 'manual' && <button type="button" className={`btn btn-${paymentMethod === 'get_tx_slate' ? 'light' : 'dark'}`}
          onClick={() => this.onPaymentMethodChange('get_tx_slate')}>
            FILE
        </button>
        }
      </div>
    )
  }

  handleDownloadFile = (txData) => {
    const jsonData = JSON.parse(txData)
    const element = document.createElement('a')
    const file = new Blob([JSON.stringify(jsonData)], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `${jsonData.id}.tx`
    document.body.appendChild(element) // Append anchor to body
    element.click() // Trigger click
    document.body.removeChild(element) // Remove anchor from body
  }

  renderManualPayoutForm = () => {
    const { isTxSlateLoading, minerPaymentTxSlate } = this.props
    const { paymentMethod, paymentType, recipient } = this.state
    let showAlert = false
    if (paymentMethod === 'get_tx_slate' && minerPaymentTxSlate && minerPaymentTxSlate.message) {
      showAlert = true
    }
    if (paymentType !== 'none') {
      switch (paymentMethod) {
        case 'http':
          return (
            <div>
              <Label for="http">Enter your wallet HTTP address:</Label>
              <Alert color='danger' style={{ textAlign: 'center', position: 'relative', marginTop: '16px', marginBottom: '26px' }}><strong>We do NOT recommend sending directly to an exchange, and you do so at your own risk! If you send to an exchange please consider including the port number.</strong></Alert>
              <Input
                onChange={this.onChangeTextInput}
                type="text"
                name="http"
                id="http"
                placeholder="http://xxxxxxxx"
                className='form-control'
                value={recipient}
              />
            </div>
          )
        case 'mwcmqs':
          return (
            <div>
              <Label for="mwcmqs">Enter your wallet MWCMQS address:</Label>
              <Alert color='danger' style={{ textAlign: 'center', position: 'relative', marginTop: '16px', marginBottom: '26px' }}><strong>We do NOT recommend sending directly to an exchange, and you do so at your own risk! If you send to an exchange please consider including the port number.</strong></Alert>
              <Input
                onChange={this.onChangeTextInput}
                type="text"
                name="mwcmqs"
                id="mwcmqs"
                placeholder="mwcmqs://xxxxxxxx"
                className='form-control'
                value={recipient}
              />
            </div>
          )
        case 'get_tx_slate':
          return (
            minerPaymentTxSlate && minerPaymentTxSlate.success === true && (
              <div style={{ textAlign: 'center', marginTop: showAlert ? '10px' : '20px' }}>
                {showAlert ? (
                  <div>
                    <Alert style={{ display: 'block' }} color={minerPaymentTxSlate.color}>{minerPaymentTxSlate.message}</Alert>
                  </div>
                ) : (
                  <div>
                    <Label for="get_tx_slate">Download the Transaction Slate and Upload to Wallet:</Label><br />
                    {!isTxSlateLoading && (
                      <a href='#' onClick={() => this.handleDownloadFile(minerPaymentTxSlate.data)} style={{ fontWeight: 'bold' }}>Download</a>
                    )}
                  </div>
                )}
              </div>
            )
          )
      }
    } else {
      return null
    }
  }

  renderAutomaticPayoutForm = () => {
    const { paymentMethod, paymentType, recipient } = this.state
    if (paymentType !== 'none') {
      switch (paymentMethod) {
        case 'http':
          return (
            <div>
              <Label for="http">Enter your wallet HTTP address:</Label>
              <Input
                onChange={this.onChangeTextInput}
                type="text"
                name="http"
                id="http"
                placeholder="http://xxxxxxxx"
                className='form-control'
                value={recipient}
              />
            </div>
          )
        case 'mwcmqs':
          return (
            <div>
              <Label for="mwcmqs">Enter your wallet MWCMQS address:</Label>
              <Input
                onChange={this.onChangeTextInput}
                type="text"
                name="mwcmqs"
                id="mwcmqs"
                placeholder="mwcmqs://xxxxxxxx"
                className='form-control'
                value={recipient}
              />
            </div>
          )
      }
    } else {
      return null
    }
  }

  onSubmit = (e) => {
    e.preventDefault()
    // const { isTxSlateLoading, minerPaymentTxSlate } = this.props
    const { fetchMinerPaymentTxSlate } = this.props
    const { setPaymentMethodSetting, rejectZeroBalancePayment, dueAmount, rejectEmptyRecipient } = this.props
    if (this.state.recipient.trim() === '' && this.state.paymentMethod !== 'get_tx_slate') {
      rejectEmptyRecipient()
      return
    } else if (dueAmount <= 0) {
      rejectZeroBalancePayment()
      return
    }

    if (this.state.paymentMethod === 'get_tx_slate') {
      fetchMinerPaymentTxSlate()
    } else {
      setPaymentMethodSetting(this.state)
    }
  }

  uploadFile = (e) => {
    // Trigger the file input
    e.preventDefault()
    this.fileInput.click()
  }

  handleFileChange = (event) => {
    const { finalizeTxSlate } = this.props
    const file = event.target.files[0]
    const reader = new FileReader()
    reader.onload = function (event) {
      const fileContent = event.target.result
      try {
        const jsonData = JSON.parse(fileContent)
        // Call the finalizeTxSlate function with the parsed JSON data
        finalizeTxSlate(jsonData)
      } catch (error) {
        console.error('Error parsing JSON:', error)
      }
    }
    reader.readAsText(file)
  }

  renderManualPayoutForms = () => {
    const { paymentType, paymentMethod } = this.state
    const { isPaymentSettingProcessing, paymentFormFeedback } = this.props
    const isFormShown = paymentType !== 'manual' || (paymentType === 'manual' && (paymentMethod === 'http' || paymentMethod === 'mwcmqs' || paymentMethod === 'get_tx_slate'))
    return (
      <Card>
        <CardBody>
          <Form className='minerPaymentForm'>
            {this.renderPayoutOptions()}
            {paymentMethod !== 'get_tx_slate' && this.renderManualPayoutForm()}
            {isFormShown && (
              paymentMethod === 'get_tx_slate' ? (
                <div style={{ marginTop: '30px' }}>
                  <Alert color='warning' style={{ textAlign: 'center', position: 'relative', marginTop: '16px', marginBottom: '26px' }}>
                    <strong>
                      1. Request: Download the file .tx <br />
                      2. Upload the .tx file to your wallet/exchange <br />
                      3. Finalize: Upload the .response file from the wallet/exchange
                    </strong>
                  </Alert>
                  <div style={{ textAlign: 'center' }}>
                    <button className="btn btn-outline-secondary account__btn account__btn--small" style={{ width: '120px' }} onClick={this.onSubmit} disabled={isPaymentSettingProcessing || this.state.paymentMethod === 'null'}>
                      {isPaymentSettingProcessing ? this.renderSpinner('21px') : 'Request'}
                    </button>
                    <input type="file" id="file-upload" ref={(input) => { this.fileInput = input }} style={{ display: 'none' }} onChange={this.handleFileChange} />
                    <button className="btn btn-primary account__btn account__btn--small" style={{ width: '120px' }} onClick={this.uploadFile} disabled={isPaymentSettingProcessing || this.state.paymentMethod === 'null'}>
                      {isPaymentSettingProcessing ? this.renderSpinner('21px') : 'Finalize'}
                    </button>
                  </div>
                  <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    {paymentFormFeedback && <Alert style={{ display: 'block' }} color={paymentFormFeedback.color}>{paymentFormFeedback.message}</Alert>}
                  </div>
                </div>
              ) : (
                <div style={{ marginTop: '30px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <button className="btn btn-primary account__btn account__btn--small" style={{ width: '104px' }} onClick={this.onSubmit} disabled={isPaymentSettingProcessing || this.state.paymentMethod === 'null' || this.state.recipient === ''}>
                      {isPaymentSettingProcessing ? this.renderSpinner('21px') : 'Submit'}
                    </button>
                  </div>
                  <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    {paymentFormFeedback && <Alert style={{ display: 'block' }} color={paymentFormFeedback.color}>{paymentFormFeedback.message}</Alert>}
                  </div>
                </div>
              )
            )}
            {paymentMethod === 'get_tx_slate' && this.renderManualPayoutForm()}
          </Form>
        </CardBody>
      </Card>
    )
  }

  minPayoutSelect = (number) => {
    this.setState({
      minPayout: number
    })
  }

  renderAutomaticPayoutForms = () => {
    const { paymentType, paymentMethod, enableAutoPayout } = this.state
    const { isPaymentSettingProcessing, paymentFormFeedback } = this.props
    const isFormShown = paymentType !== 'manual' || (paymentType === 'manual' && (paymentMethod === 'http' || paymentMethod === 'mwcmqs' || paymentMethod === 'get_tx_slate'))
    console.log('enable', enableAutoPayout)
    return (
      <Card>
        <CardBody>
          <Form className='minerPaymentForm'>
            {/* <FormControlLabel control={<Switch onChange={this.onAutoPayoutchange} checked={enableAutoPayout} />} label="Enable Automatic Payout" /> */}
            {this.renderPayoutOptions()}
            {this.renderAutomaticPayoutForm()}
            {isFormShown && (
              <div style={{ marginTop: '30px' }}>
                <div style={{ textAlign: 'center' }}>
                  <button className="btn btn-success account__btn account__btn--small" style={{ width: '104px' }} onClick={this.onSubmit} disabled={isPaymentSettingProcessing || this.state.paymentMethod === 'null' || this.state.recipient === '' }>
                    {isPaymentSettingProcessing ? this.renderSpinner('21px') : 'Save'}
                  </button>
                </div>
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                  {paymentFormFeedback && <Alert style={{ display: 'block' }} color={paymentFormFeedback.color}>{paymentFormFeedback.message}</Alert>}
                </div>
              </div>
            )}
          </Form>
        </CardBody>
      </Card>
    )
  }

  render () {
    const { paymentType } = this.state
    return (
      <Container className='dashboard'>
        <Row>
          <Col xs={12} md={12} lg={12} xl={12}>
            <h3 className='page-title'>Miner Payment</h3>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={12} lg={6} xl={6}>
            <Card>
              <CardBody>
                <h4>Payout</h4>
                <p>MWCPool supports multiple methods of payment, including automatic payments and manual / on-demand payments. The list of payment methods is likely to grow, so stay tuned!</p>
                <Nav tabs>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: paymentType === 'manual' })}
                      onClick={() => { this.onPaymentTypeChange('manual') }}
                    >
                      Manual Payment
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: paymentType === 'automatic' })}
                      onClick={() => { this.onPaymentTypeChange('manual') }}
                    >
                      Automatic Payment
                    </NavLink>
                  </NavItem>
                </Nav>
                <TabContent activeTab={paymentType}>
                  <TabPane tabId="manual">
                    {this.renderManualPayoutForms()}
                  </TabPane>
                  <TabPane tabId="automatic">
                    {this.renderAutomaticPayoutForms()}
                  </TabPane>
                </TabContent>
              </CardBody>
            </Card>
          </Col>
          <Col xs={12} md={12} lg={6} xl={6}>
            <Card>
              <CardBody>
                <MinerPaymentDataConnector />
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={12} lg={12} xl={12}>
            <Card>
              <CardBody>
                <LatestMinerPaymentsConnector />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    )
  }
}
