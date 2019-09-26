import React from 'react';
import logo from './logo.svg';
import './App.css';
import './bootstrap-dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table'

class BidTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    fetch('http://0.0.0.0:61125/api/v1/bids/21')
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
        console.log("state", this.state.bids)
      })
  }

  render() {
    return (
      <Table striped bordered variant="dark">
        <thead>
          <td>Bidder</td>
          <td>Bid Amount</td>
        </thead>
        <tbody>
          {this.state.bids}
        </tbody>
      </Table>
    )
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <div style={{ width: '40%' }}>
          <BidTable></BidTable>
        </div>
      </header>
    </div>
  );
}

export default App;
