import { useState, useEffect } from "react";
import {
  InputNumber,
  Select,
  Card,
  Typography,
  Row,
  Col,
  Spin,
  Layout,
} from "antd";
import axios from "axios";

const { Option } = Select;
const { Title, Text } = Typography;

const Converter = () => {
  const [coins, setCoins] = useState([]);
  const [selectedFrom, setSelectedFrom] = useState("ETH");
  const [selectedTo, setSelectedTo] = useState("USD");
  const [amount, setAmount] = useState(1);
  const [rates, setRates] = useState({});
  const [result, setResult] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(null);

  useEffect(() => {
    axios
      .get("https://interview.switcheo.com/prices.json")
      .then((res) => {
        const latestRates = {};
        res.data.forEach((item) => {
          latestRates[item.currency] = item.price;
        });
        setRates(latestRates);
        setCoins(Object.keys(latestRates));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (isUpdating === "amount") {
      setResult((amount * rates[selectedFrom]) / rates[selectedTo]);
    } else if (isUpdating === "result") {
      setAmount((result * rates[selectedTo]) / rates[selectedFrom]);
    }
  }, [amount, selectedFrom, selectedTo, rates, isUpdating, result]);

  const sFrom = (
    <Select value={selectedFrom} onChange={setSelectedFrom}>
      {coins.map((coin) => (
        <Option key={coin} value={coin}>
          <Row style={{ marginTop: "4px" }}>
            <Col span={12} style={{ marginTop: "4px" }}>
              <img
                src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${coin}.svg`}
                alt={coin}
                style={{ width: 20, marginRight: 10 }}
              />
            </Col>
            <Col span={12}>{coin}</Col>
          </Row>
        </Option>
      ))}
    </Select>
  );

  const sTo = (
    <Select value={selectedTo} onChange={setSelectedTo}>
      {coins.map((coin) => (
        <Option key={coin} value={coin}>
          <Row style={{ marginTop: "4px" }}>
            <Col span={12} style={{ marginTop: "4px" }}>
              <img
                src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${coin}.svg`}
                alt={coin}
                style={{ width: 20, marginRight: 10 }}
              />
            </Col>
            <Col span={12}>{coin}</Col>
          </Row>
        </Option>
      ))}
    </Select>
  );

  return (
    <Layout
      style={{
        margin: "auto",
        minHeight: "100vh",
        minWidth: "100vw",
        background:
          "url('https://www.transparenttextures.com/patterns/back-pattern.png'), #1890ff",
      }}
    >
      <Card
        style={{
          width: "1000px",
          margin: "auto",
          textAlign: "center",
          padding: 20,
          borderRadius: 50,
        }}
      >
        <Title level={3} style={{ paddingBottom: 50 }}>
          Currency Converter
        </Title>
        {loading ? (
          <Spin size="large" />
        ) : (
          <>
            <Row>
              <Col span={10}>
                <InputNumber
                  value={amount}
                  onChange={(value) => {
                    setAmount(value);
                    setIsUpdating("amount");
                  }}
                  size="large"
                  style={{
                    width: "350px",
                    border: "2px solid #1890ff",
                    borderRadius: 10,
                  }}
                  min={0}
                  addonAfter={
                    <div style={{ minWidth: "90px", textAlign: "center" }}>
                      {sFrom}
                    </div>
                  }
                />
              </Col>
              <Col span={4}>
                <span style={{ fontSize: "24px", color: "#1890ff" }}>⇄</span>
              </Col>
              <Col span={10}>
                <InputNumber
                  value={result}
                  onChange={(value) => {
                    setResult(value);
                    setIsUpdating("result");
                  }}
                  size="large"
                  style={{
                    width: "350px",
                    border: "2px solid #1890ff",
                    borderRadius: 10,
                  }}
                  addonAfter={
                    <div
                      style={{
                        minWidth: "90px",
                        textAlign: "center",
                      }}
                    >
                      {sTo}
                    </div>
                  }
                />
              </Col>
            </Row>
            <Text style={{ display: "block", marginTop: 50 }}>
              1 {selectedFrom} ={" "}
              {rates[selectedFrom] / rates[selectedTo] || "-"} {selectedTo}
            </Text>
          </>
        )}
      </Card>
    </Layout>
  );
};

export default Converter;
