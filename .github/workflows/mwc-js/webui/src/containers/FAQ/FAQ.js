import React, { Component } from 'react'
import { Row, Col, Card, CardBody, Collapse } from 'reactstrap'

export class FAQComponent extends Component {
  constructor (props) {
    super(props)
    const faqs = [
      {
        question: 'What kind of payment structure does mwcpool use?',
        answer: 'FPPLNG = Full Pay Per Last N Groups, where "Full" means we include transaction fees from blocks mined, and "N Groups" means the last N blocks. If a block is found then all miners who have submitted valid shares during the 240 blocks leading up to the block reward will receive a share of the block reward.'
      },
      {
        question: 'I recently earned some mwc in my immature balance, how long until I can spend or withdraw it?',
        answer: '1440 blocks after block reward, which is typically about 24 hours. After that time period you should be able to withdraw without issue.'
      },
      {
        question: 'Where can i get help?',
        answer: 'You can join the mwc discord or telegram. Discord: https://discord.gg/vA2mPCgHBn or Telegram: https://t.me/mimblewimble_coin'
      },
      {
        question: 'How to contact the Pool Admin',
        answer: 'You can DM #vekamo on discord or https://t.me/mwc_vek on telegram.'
      }
    ]
    const renderedFAQs = faqs.map((item) => {
      return (<CollapseFAQ key={item.questions} question={item.question} answer={item.answer} />)
    })
    this.state = {
      renderedFAQs
    }
  }

  render () {
    const { renderedFAQs } = this.state
    return (
      <div>
        <Row>
          <Col xs={12} md={12} lg={12} xl={12}>
            <h3 className='page-title'>Frequently Asked Questions</h3>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={12} lg={12} xl={12}>
            <Card>
              <CardBody id='faqPage'>
                {renderedFAQs}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export class CollapseFAQ extends Component {
  constructor (props) {
    super(props)
    this.state = {
      open: true
    }
  }

  toggle = () => {
    const { isOpen } = this.state
    this.setState({
      isOpen: !isOpen
    })
  }

  render () {
    const { question, answer } = this.props
    const { isOpen } = this.state
    return (
      <div>
        <h4 onClick={this.toggle} style={{ cursor: 'pointer', marginBottom: '22px' }}>Q: {question}</h4>
        <Collapse isOpen={isOpen}>
          <p style={{ marginLeft: '12px', marginBottom: '36px', fontSize: '16px' }} >A: {answer}</p>
        </Collapse>
      </div>
    )
  }
}
