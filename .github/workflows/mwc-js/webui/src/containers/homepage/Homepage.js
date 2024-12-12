import React, { Component } from 'react'
import { Col, Container, Row, Card, CardBody } from 'reactstrap'
import { NetworkDataConnector } from '../../redux/connectors/NetworkDataConnector.js'
import { MWCPoolDataConnector } from '../../redux/connectors/MWCPoolDataConnector.js'
import { NetworkRecentBlocksConnector } from '../../redux/connectors/NetworkRecentBlocksConnector.js'

export class HomepageComponent extends Component {
  render () {
    return (
      <Container className='dashboard'>
        <Row>
          <Col xs={12} md={12} lg={12} xl={12}>
            <h3 className='page-title'>Dashboard</h3>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={12} lg={12} xl={12}>
            <Card>
              <CardBody>
                <NetworkDataConnector />
              </CardBody>
            </Card>
          </Col>
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
                <NetworkRecentBlocksConnector />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    )
  }
}
