import React, { Component } from 'react'
import { Col, Container, Row, Card, CardBody } from 'reactstrap'
import { RigDataConnector } from '../../redux/connectors/RigDataConnector.js'
import { MinerSharesConnector } from '../../redux/connectors/MinerSharesConnector.js'
import { MinerBlockRewardsConnector } from '../../redux/connectors/MinerBlockRewardsConnector.js'

export class RigDetailsComponent extends Component {
  render () {
    const { username } = this.props
    return (
      <Container className='dashboard'>
        <Row>
          <Col xs={12} md={12} lg={12} xl={12}>
            <h3 className='page-title'>{username} Miner Stats</h3>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={12} lg={12} xl={12}>
            <Card>
              <CardBody>
                <RigDataConnector />
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={12} lg={12} xl={12}>
            <Card>
              <CardBody>
                <MinerSharesConnector />
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={12} lg={12} xl={12}>
            <Card>
              <CardBody>
                <MinerBlockRewardsConnector />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    )
  }
}
