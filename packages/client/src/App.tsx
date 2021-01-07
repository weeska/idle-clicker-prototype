import React, { useEffect, useState } from 'react';
import './App.css';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';

interface Info {
  level: number;
  cost: number;
  funds: number;
  lastUpdated: number;
  production: number;
}

interface Props {
  info: Info;
  onUpgrade: () => void;
}

function Clicker(props: Props) {
  return (
    <Card className="text-nowrap">
      <Card.Header>
        <Card.Title>
          Just a little more...
        </Card.Title>
        Level: {props.info.level}
      </Card.Header>
      <Card.Body>
        <Row>
          <Col>
            <Form.Label>Current Funds:</Form.Label>
          </Col>
          <Col>
            <Form.Label>{props.info.funds.toFixed(2)}</Form.Label>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Label>Production:</Form.Label>
          </Col>
          <Col>
            <Form.Label>{props.info.production.toFixed(2)}</Form.Label>
          </Col>
        </Row>
      </Card.Body>
      <Card.Footer>
        <Button onClick={props.onUpgrade}>Upgrade ({props.info.cost.toFixed(2)})</Button>
      </Card.Footer>
    </Card>
  )
}

function App() {

  const [running, setRunning] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [info, setInfo] = useState({ cost: 0, production: 0, funds: 0, lastUpdated: 0, level: 0 });

  const upgrade = async () => {
    const newInfo = {...info};
    newInfo.funds -= info.cost;
    newInfo.level += 1;
    newInfo.lastUpdated = new Date().getTime();
    await fetch('http://localhost:3001/upgrade', { method: 'POST' }).then(console.log);
    setInfo(newInfo);
  }

  useEffect(() => {
    const updateInfo = async () => {
      if (!initialized) {
        setInitialized(true);
        const info = await fetch('http://localhost:3001/info', { method: 'GET' }).then(res => res.json());
        setInfo(info);
      }
    };

    updateInfo();
  }, [info, initialized]);

  useEffect(() => {
    if(!running) {
      setInterval(() => { setInitialized(false) }, 1000);
      setRunning(true);
    }
  }, [initialized, running]);

  return (
    <div className="App">
      <header className="App-header">
        <Clicker info={info} onUpgrade={upgrade} />
      </header>
    </div>
  );
}

export default App;
