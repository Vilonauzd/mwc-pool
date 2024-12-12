import React, { Component } from 'react'
import { Col, Container, Row, Card, CardBody } from 'reactstrap'
import { MWCPoolDataConnector } from '../../redux/connectors/MWCPoolDataConnector.js'
import { MWCPoolSharesSubmittedConnector } from '../../redux/connectors/MWCPoolSharesSubmittedConnector.js'
import { MWCPoolStatsTableConnector } from '../../redux/connectors/MWCPoolStatsTableConnector.js'
import { MWCPoolRecentBlocksConnector } from '../../redux/connectors/MWCPoolRecentBlocksConnector.js'

export class MWCPoolDetailsComponent extends Component {
  UNSAFE_componentWillMount () {

  }

  fetchMWCPoolData = () => {

  }

  render () {
    return (
      <Container className='dashboard'>
        <Row>
          <Col xs={12} md={12} lg={12} xl={12}>
            <h3 className='page-title'>MWCPool Details</h3>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={12} lg={12} xl={12}>
            <Card>
              <CardBody>
                <MWCPoolDataConnector />
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={12} lg={12} xl={12}>
            <Card>
              <CardBody>
                <MWCPoolSharesSubmittedConnector />
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={12} lg={12} xl={12}>
            <Card>
              <CardBody>
                <MWCPoolStatsTableConnector />
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={12} lg={12} xl={12}>
            <Card>
              <CardBody>
                <MWCPoolRecentBlocksConnector />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    )
  }
}
