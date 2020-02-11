import React, { Component } from "react";
import { Text, Button, CardItem, Card, Spinner } from "native-base";
import ShareChart from "./tradingGraph/ShareChart";
import { Dimensions, StyleSheet, ScrollView } from "react-native";
import { View } from "react-native";
import Modal from "react-native-modal";
import RangeSlider from "rn-range-slider";
import { getStockChart } from "../../controller/services/rapidApi";
import Chart from "./Chart";
export default class SingleSymbolPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      symbol: this.props.symbol ? this.props.symbol : "fb",
      symbolData: [],
      chartData: null,
      symbolPriceData: [],
      loder: true,
      mapDataNew: [],
      modalStatus: false,
      day: 1,
      quantity:1,
      selectedData : null,
    };
  }
  componentDidMount() {
    this.getRapidData({
      interval: "60m",
      range: "1d",
      day: 1
    });
  }
  getRapidData = ({ interval, range, day }) => {
    this.setState({
      loder: true
    });
    getStockChart({
      interval: interval || "60m",
      symbol: this.props.symbol,
      range: range || "1d"
    })
      .then(res => {
        console.log("getStockChart", { res });
        if (res && res.data) {
          if (res.data.chart) {
            if (
              !res.data.chart.error &&
              res.data.chart.result &&
              res.data.chart.result.length > 0
            ) {
              const {
                indicators: { quote },
                timestamp,
                meta
              } = res.data.chart.result[0];
              console.log({
                timestamp
              });
              const chartData = timestamp && timestamp.map((el, i) => {
                console.log({ el });
                return {
                  x: new Date(el * 1000),
                  close: quote[0].close[i],
                  high: quote[0].high[i],
                  low: quote[0].low[i],
                  open: quote[0].open[i]
                };
              });
              this.setState({
                day,
                mapDataNew: chartData,
                loder: false
              });

              console.log({
                chartData
              });
            }
          }
        }
      })
      .catch(err => {
        console.log("getStockChart", { err });
      });
  };
  singleSymbolData = data => {
    const timeData = Object.keys(data)
      .map(el => el !== "Meta Data" && data[el] && data[el])
      .filter(el => el);
    const timeDataA = timeData[0];

    const labels = Object.keys(timeDataA).filter((e, i) => i < 7);
    const dataSet = Object.keys(timeDataA)
        .map(el => timeDataA[el]["1. open"])
        .filter((e, i) => i < 7),
      mapData = {
        labels,
        datasets: [{ data: dataSet }]
      };
    const symbolPriceData = Object.keys(timeDataA)
      .map(el => timeDataA[el])
      .filter((e, i) => i < 7);
    this.setState({
      chartData: mapData,
      symbolPriceData: symbolPriceData
    });
    const newMapData = Object.keys(timeDataA).map(el => timeDataA[el]);
    console.log({
      newMapData
    });
    var day = this.state.day;
    if (day == 1) {
      day = 20;
    }
    if (day == 5) {
      day = 5;
    }
    if (day == 6) {
      day = 30;
    }
    // day=this.state.day == 5 ? 5 : 50;

    const filteredArr = Object.keys(timeDataA).filter((a, i) => i < day);
    const mapDataNew = filteredArr.map(el => ({
      x: new Date(el),
      open: timeDataA[el]["1. open"],
      high: timeDataA[el]["2. high"],
      low: timeDataA[el]["3. low"],
      close: timeDataA[el]["4. close"]
    }));
    console.log({
      mapDataNew
    });
    this.setState({
      mapDataNew
    });
  };

  getPriceByQty = (price = 0 , qty = 1) =>{
     const totalPrice=price*qty;
     return ' $' + totalPrice.toFixed(2);
  }
  render() {
    const data = this.state.chartData;
    const { 
      symbolPriceData, 
      loder, 
      mapDataNew, day, modalStatus,quantity,
      selectedData
    } = this.state;
    const price =
      mapDataNew && mapDataNew.length > 0 ? mapDataNew.reverse()[0] : [];
    console.log({ price, mapDataNew });
    const chartConfig = {
      backgroundGradientFrom: "#ffffff",
      backgroundGradientTo: "#fcfcfc",
      color: (opacity = 5) => `rgba(0, 179, 30, ${1})`
    };
    const screenWidth = Dimensions.get("window").width + 100;
    return loder ? (
      <Spinner color="blue" />
    ) : (
      <ScrollView heading="FB">
        <Chart 
          symbol={this.state.symbol}
          onCandleSelect={selectedData => {
            this.setState({
              selectedData
            }, console.log({
              selectedData
            }))
        }} />
        {
          // new Array(100).fill("").map((el, i)=> <Text>asdf {i}</Text>)
        }
        {
          selectedData && selectedData.Close && 
          <Text>
            Rate {parseFloat(selectedData.Close).toFixed(2)}$
          </Text>
        }
        {this.state.mapDataNew && false && (
          <View>
            <ShareChart data={mapDataNew} />
            <View style={styles.socailLogin}>
              <Button
                small
                style={{
                  margin: 5
                }}
                info={day === 1}
                primary={day !== 1}
                onPress={() =>
                  this.getRapidData({
                    interval: "60m",
                    range: "1d",
                    day: 1
                  })
                }
              >
                <Text style={styles.font5}>1 Day</Text>
              </Button>

              <Button
                small
                style={{
                  margin: 5
                }}
                info={day === 5}
                primary={day !== 5}
                onPress={() =>
                  this.getRapidData({
                    interval: "1d",
                    range: "5d",
                    day: 5
                  })
                }
              >
                <Text style={styles.font5}>5 Days</Text>
              </Button>

              <Button
                small
                style={{
                  margin: 5
                }}
                info={day === 30}
                primary={day !== 30}
                onPress={() =>
                  this.getRapidData({
                    interval: "1d",
                    range: "1mo",
                    day: 30
                  })
                }
              >
                <Text style={styles.font5}>1 Month</Text>
              </Button>
            </View>
            <Card style={styles.cart_info}>
              <CardItem>
                <View style={styles.row}>
                  <View style={styles.col6}>
                    <Text style={styles.gray}>Open </Text>
                    <Text style={styles.black}>
                      {" "}
                      {price && price["open"]
                        ? "$" + price["open"].toFixed(2)
                        : "$ 00.00"}
                    </Text>
                  </View>
                  <View style={styles.col6}>
                    <Text style={styles.gray}>Close </Text>
                    <Text style={styles.black}>
                      {price && price["close"]
                        ? "$" + price["close"].toFixed(2)
                        : "$ 00.00"}
                    </Text>
                  </View>
                </View>
              </CardItem>
              <CardItem>
                <View style={styles.row}>
                  <View style={styles.col6}>
                    <Text style={styles.gray}>Height </Text>
                    <Text style={styles.black}>
                      {price && price["low"]
                        ? "$" + price["low"].toFixed(2)
                        : "$ 00.00"}
                    </Text>
                  </View>
                  <View style={styles.col6}>
                    <Text style={styles.gray}>Low </Text>
                    <Text style={styles.black}>
                      {price && price["high"]
                        ? "$" + price["high"].toFixed(2)
                        : "$ 00.00"}
                    </Text>
                  </View>
                </View>
              </CardItem>
            </Card>
            <View style={styles.row}>
              <View style={styles.col6}>
                <Button full success>
                  <Text
                   onPress={() => {
                    this.setState({ modalStatus: !modalStatus });
                  }}
                  >Buy</Text>
                </Button>
              </View>
              <View style={styles.col6}>
                <Button full danger>
                  <Text
                    onPress={() => {
                      this.setState({ modalStatus: !modalStatus });
                    }}
                  >
                    Sell
                  </Text>
                </Button>
              </View>
              <Modal isVisible={modalStatus}>
                <View style={styles.modalView}>
                  <Card style={styles.cart_info}>
                    <CardItem>
                      <View style={styles.row}>
                        <View style={styles.col6}>
                          <Text style={styles.gray}>Open </Text>
                          <Text style={styles.black}>
                            {" "}
                            {price && price["open"]
                              ? "$" + price["open"].toFixed(2)
                              : "$ 00.00"}
                          </Text>
                        </View>
                        <View style={styles.col6}>
                          <Text style={styles.gray}>Close </Text>
                          <Text style={styles.black}>
                            {price && price["close"]
                              ? "$" + price["close"].toFixed(2)
                              : "$ 00.00"}
                          </Text>
                        </View>
                      </View>
                    </CardItem>
                    <CardItem>
                      <View style={styles.row}>
                        <View style={styles.col6}>
                          <Text style={styles.gray}>Height </Text>
                          <Text style={styles.black}>
                            {price && price["low"]
                              ? "$" + price["low"].toFixed(2)
                              : "$ 00.00"}
                          </Text>
                        </View>
                        <View style={styles.col6}>
                          <Text style={styles.gray}>Low </Text>
                          <Text style={styles.black}>
                            {price && price["high"]
                              ? "$" + price["high"].toFixed(2)
                              : "$ 00.00"}
                          </Text>
                        </View>
                      </View>
                    </CardItem>
                    <CardItem>
                      <RangeSlider
                        style={{
                          width: screenWidth - 200,
                          height: 50,
                        }}
                        gravity={"center"}
                        min={0}
                        max={100}
                        step={5}
                        rangeEnabled={false}
                        selectionColor="#3df"
                        blankColor="#f618"
                        onValueChanged={(low, high, fromUser) => {
                          this.setState({quantity:low})
                        }}
                      />
                    </CardItem>
                    <CardItem>
                      <Text >Select Quantity</Text>
                    </CardItem>
                    <CardItem>
                          <Text style={styles.gray}>Total: </Text>
                          <Text style={styles.black}>
                             {quantity} { 'X' }{' '}
                             {price && price["low"] ? price["low"].toFixed(2): "$ 00.00"} = 
                              { this.getPriceByQty(price["low"],quantity) } </Text>
                    </CardItem>

                    <CardItem>
                      <View style={styles.row}>
                        <View style={styles.col6}>
                          <Button full success>
                            <Text
                            onPress={() => {
                              this.setState({ modalStatus: !modalStatus });
                            }}
                            >Close</Text>
                          </Button>
                        </View>
                        <View style={styles.col6}>
                          <Button full danger>
                            <Text
                              onPress={() => {
                                this.setState({ modalStatus: !modalStatus });
                              }}
                            >
                              Buy
                            </Text>
                          </Button>
                        </View>
                      </View>
                    </CardItem>
                  </Card>
                </View>
              </Modal>
            </View>
          </View>
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  socailLogin: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center"
  },
  floatLeft: {
    width: "10%",
    flex: 0.25,
    alignItems: "center",
    marginLeft: 5,
    textAlign: "center"
  },
  cart_info: {
    marginTop: 50
  },
  row: {
    flex: 1,
    flexDirection: "row"
  },
  col6: {
    width: "45%",
    flex: 0.5,
    alignItems: "center"
  },
  gray: {
    color: "gray"
  },
  black: {
    color: "black"
  },
  modalView: {
    flex: 1,
    padding: 10
  }
});
