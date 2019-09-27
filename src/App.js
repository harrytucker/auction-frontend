import React from 'react';
import './App.css';
import './bootstrap-dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Badge from 'react-bootstrap/Badge'

class BidTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = { value: "" }

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    // callback function prevents api fetch from occurring until setState() has finished 
    this.setState({ value: event.target.value }, function () {
      // construct API url
      let api_url = 'http://127.0.0.1:61125/api/v1/bids/' + this.state.value
      fetch(api_url)
        .then(results => {
          return results.json()
        }).then(data => {
          let bids = data.map((bid) => {
            return (
              <tr>
                <td>{bid.bidder_name}</td>
                <td>£{bid.bid_amount}</td>
              </tr>
            )
          })

          this.setState({ bids: bids })
        })
    })
  }

  render() {
    return (
      <div>
        <Form>
          <Form.Label>Item Number</Form.Label>
          <Form.Control onChange={this.handleChange} name="value" value={this.state.value} type="number" min="1" step="0.1" placeholder="Item Number From Spreadsheet" required={true}></Form.Control>
          <Form.Text className="text-muted">View bids for an item</Form.Text>
        </Form>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Bidder</th>
              <th>Bid Amount</th>
            </tr>
          </thead>
          <tbody>
            {this.state.bids}
          </tbody>
        </Table>
      </div>
    )
  }
}

class BidForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { bidder_name: '', bidder_email: '', item_number: 1, bid_amount: 1, success: false }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    const target = event.target
    const value = target.value
    const name = target.name

    this.setState({
      [name]: value
    })
  }

  handleSubmit(event) {
    // construct API url
    let api_url = 'http://127.0.0.1:61125/api/v1/bids/' + this.state.item_number

    fetch(api_url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bid_amount: Number(this.state.bid_amount),
        bidder_name: this.state.bidder_name,
        bidder_email: this.state.bidder_email
      })
    }).then(results => {
      return results.json()
    }).then(data => {
      console.log(data)
      // show success badge
      this.setState({ success: true })
    })

    event.preventDefault()
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Group controlId="bidder_name">
          <Form.Label>Full Name</Form.Label>
          <Form.Control onChange={this.handleChange} name="bidder_name" value={this.state.bidder_name} type="string" placeholder="My Name" required={true}></Form.Control>
          <Form.Text className="text-muted">Please make sure to enter your full name</Form.Text>
        </Form.Group>

        <Form.Group controlId="bidder_email">
          <Form.Label>Email address</Form.Label>
          <Form.Control onChange={this.handleChange} name="bidder_email" value={this.state.bidder_email} type="email" placeholder="Enter email" required={true} />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else, this is only used to used to contact bidders.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="item_number">
          <Form.Label>Item Number</Form.Label>
          <Form.Control onChange={this.handleChange} name="item_number" type="number" placeholder="Item Number From Spreadsheet" min="1" step="0.1" required={true}></Form.Control>
          <Form.Text className="text-muted">Please refer to the excel spreadsheet for items available</Form.Text>
        </Form.Group>

        <Form.Group controlId="bid_amount">
          <Form.Label>Bid Amount (£)</Form.Label>
          {/* TODO: Set minimum to highest bid for item (may require some interception) */}
          <Form.Control onChange={this.handleChange} name="bid_amount" type="number" placeholder="1" min="1" required={true}></Form.Control>
          <Form.Text className="text-muted">Bids must be in whole numbers, no change!</Form.Text>
        </Form.Group>

        <Form.Group controlId="submitBtn">
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form.Group>
        <Form.Group>
          <Badge hidden={!this.state.success} variant="success">Bid Placed!</Badge>
          <Form.Text hidden={!this.state.success}>Please refresh the page to show your bid in the table to the left</Form.Text>
        </Form.Group>
      </Form>
    )
  }
}

function App() {
  return (
    <div className="App">
      <Navbar bg="dark" variant="dark" fixed="top">
        <Navbar.Brand href="/">
          <img
            alt=""
            src="/hpe-light.svg"
            width="200"
            height="100"
            className="d-inline-block align-center"
          />
          {' Charity Auction '}
        </Navbar.Brand>
      </Navbar>

      {/* Content Area */}
      <Container style={{ paddingTop: 180, backgroundColor: 'white' }} className={'h-100'}>
        <Row>
          <Col><BidTable></BidTable></Col>
          <Col><BidForm></BidForm></Col>
        </Row>
      </Container>
    </div >
  );
}

export default App;
