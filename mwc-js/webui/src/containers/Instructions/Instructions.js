import React, { Component } from 'react'
import { Col, Container, Row, Card, CardBody } from 'reactstrap'

export class TutorialsComponent extends Component {
  render () {
    return (
      <Container className='dashboard instructions'>
        <Row>
          <Col xs={12} md={12} lg={12} xl={12}>
            <h3 className='page-title'>Tutorials</h3>
          </Col>
        </Row>
        <Card>
          <CardBody>
            <Row>
              <Col xs={12} md={12} lg={8} xl={8}>
                <h4>How to Mine MWC Tutorials</h4>
                <p>To mine with MWCPool, you need to input the username of your pool account into the username field of the G1 or G1-mini. You can input x as password. This ensures that your mined rewards are attributed to your account.</p>
              </Col>
            </Row>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Row>
              <Col xs={12} md={12} lg={10} xl={10}>
                <h4>How to Configure Pool Payouts</h4>
                <p>Coming soon...</p>
                <p>Currently, payments are processed manually.</p>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Container>
    )
  }
}

export default TutorialsComponent
