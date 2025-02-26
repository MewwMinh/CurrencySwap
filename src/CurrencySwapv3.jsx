import { useState, useEffect } from "react";
import {
  Select,
  Card,
  Typography,
  Row,
  Col,
  Spin,
  Layout,
  Button,
  message,
  Input,
  Form,
} from "antd";
import axios from "axios";

const { Option } = Select;
const { Title, Text } = Typography;

const Converter = () => {
  const [coins, setCoins] = useState([]);
  const [selectedFrom, setSelectedFrom] = useState("ETH");
  const [selectedTo, setSelectedTo] = useState("USD");
  const [amount, setAmount] = useState(0);
  const [rates, setRates] = useState({});
  const [result, setResult] = useState(0);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

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
    form.setFieldsValue({ amount, result });
  }, [form, amount, result]);

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
  useEffect(() => {
    setResult((amount * rates[selectedFrom]) / rates[selectedTo]);
  }, [amount, rates, selectedFrom, selectedTo]);
  const onFinish = (values) => {
    setAmount(values.amount);
    message.success("Success!");
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("Vui lòng kiểm tra lại thông tin!");
  };

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
            <Form
              form={form}
              name="convert"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <Row>
                <Col span={10}>
                  <Form.Item
                    name={"amount"}
                    rules={[
                      {
                        validator: (_, value) => {
                          if (!value)
                            return Promise.reject("Please enter a number!");
                          const num = Number(value);
                          if (isNaN(num))
                            return Promise.reject("Only numbers are allowed!");
                          if (num < 0)
                            return Promise.reject(
                              "Must be a number greater than 0!"
                            );
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input
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
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <span style={{ fontSize: "24px", color: "#1890ff" }}>⇄</span>
                </Col>
                <Col span={10}>
                  <Form.Item>
                    <Input
                      value={result}
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
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item>
                <Text style={{ display: "block", marginTop: 50 }}>
                  1 {selectedFrom} ={" "}
                  {rates[selectedFrom] / rates[selectedTo] || "-"} {selectedTo}
                </Text>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  color="#1890ff"
                  variant="solid"
                  style={{ marginTop: "30px" }}
                >
                  Convert
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
      </Card>
    </Layout>
  );
};

export default Converter;
