import React, { Component } from 'react'
import { Container, Row, Col, Card, CardBody, Table } from 'reactstrap'
import { NavLink } from 'react-router-dom'
import { FAQComponent } from '../FAQ/FAQ'
// import { MinerConfigsComponent } from '../MinerConfigs/MinerConfigs.js'
import { TutorialsComponent } from '../Instructions/Instructions.js'
import { C31_COLOR } from '../../custom/custom.js'

export class InfoComponent extends Component {
  render () {
    return (
      <Container className='dashboard'>
        <Row>
          <Col xs={12} md={12} lg={12} xl={12}>
            <h3 className='page-title'>Info</h3>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={12} lg={6} xl={6}>
            <Card>
              <CardBody id='aboutPage'>
                <h4 className='bold-text'>About mwcpool</h4><br />
                <p>
                  Welcome to MWCPool, a community-owned mining pool dedicated to helping miners efficiently mine MimbleWimble Coin (MWC).
                  At MWCPool, we believe in the power of community and collaboration. Our pool is designed to provide miners with a reliable, transparent, and rewarding platform to maximize their mining efforts.
                  Join us at MWCPool and contribute to the growth and success of MWC with a pool that truly belongs to its miners.
                  Happy mining!
                </p>
              </CardBody>
            </Card>
          </Col>
          <Col xs={12} md={12} lg={6} xl={6}>
            <Card>
              <CardBody>
                <h4>Important Info:</h4><br />
                <Table size='lg' responsive hover>
                  <thead>
                    <tr>
                      <th>Region</th>
                      <th>Difficulty</th>
                      <th>SSL</th>
                      <th>Stratum</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>USA</td>
                      <td>8</td>
                      <td>No</td>
                      <td>stratum+tcp://stratum2.mwcpool.com:2222</td>
                    </tr>
                    <tr>
                      <td>USA</td>
                      <td>32</td>
                      <td>No</td>
                      <td>stratum+ssl://stratum1.mwcpool.com:3333</td>
                    </tr>
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <TutorialsComponent />
        <div>
          <Row>
            <Col xs={12} md={12} lg={12} xl={12}>
              <h3 className='page-title' id='workerRigConfig'>Worker + Rig Configurations</h3>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={12} lg={12} xl={12}>
              <Card>
                <CardBody>
                  <p style={{ marginLeft: '12px', fontSize: '16px' }}>In order to assign multiple rigs and workers to your mwcpool account, please configure your miner to set your username with the following format: <span style={{ fontFamily: 'monospace', color: C31_COLOR }}>myUsername.myRig.myWorker</span> where "myUsername" is your mwcpool username, "myRig" is the name of your rig, and "myWorker" is the name of your (optional) worker. Please note that the three fields are separated by periods. To access the individuals stats for each rig / worker, click on the "Rig Stats" link in the sidebar of the mwcpool website.</p>
                  <br />
                  <p>Pool 1 = "vek.captainslair.rig1"</p>
                  <p>A breakdown showing individual graphs and statistics will be available by selecting the worker and rig from the dropdown on the <NavLink to='/rigs'>Rig Stats page</NavLink>.</p><br />
                  <img src='/img/worker-stats.png' style={{ maxHeight: '300px', maxWidth: '300px' }} /><br />
                  <p style={{ marginLeft: '12px', fontSize: '16px' }}>With this configuration all block rewards earned by any worker and / or rig under the given username will be credited to that user's account.</p>
                  <iframe width="560" height="315" src="https://www.youtube.com/embed/nP6lXO26-cI" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
        <FAQComponent />
      </Container>
    )
  }
}
