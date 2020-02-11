import React, { Component } from "react";
import { Dimensions, 
    StyleSheet, 
    View, Text, WebView,
    PixelRatio
} from "react-native";
import { Svg, G, Rect } from 'react-native-svg'
import * as d3 from 'd3'
const GRAPH_MARGIN = 20
const GRAPH_BAR_WIDTH = 5
const colors = {
  axis: '#E4E4E4',
  bars: '#15AD13'
}

export default class Chart extends Component {
    
    onMessage = (m) => {
        const {
            data
        } = m.nativeEvent
        const {
            onCandleSelect
        } = this.props
        const currentData = JSON.parse(data)
        console.log({
            currentData,
            ratio: PixelRatio.getPixelSizeForLayoutSize(200)
        })
        if(typeof onCandleSelect === "function")
            onCandleSelect(currentData)
    }
    render(){
        const SVGHeight = 150
        const SVGWidth = 300
        const graphHeight = SVGHeight - 2 * GRAPH_MARGIN
        const graphWidth = SVGWidth - 2 * GRAPH_MARGIN
        const width = Dimensions.get('window').width;
        const height = Dimensions.get('window').height;
        const chartHeight = width * 1.2
        // return (
        //     <View>
        //         <Svg width={SVGWidth} height={SVGHeight}>
        //             <G>

        //             </G>
        //         </Svg>
        //     </View>
        // )
        return (
            <View>
               
                <View style={{
                    width: width,
                    height: chartHeight,
                    borderColor: "black",
                    borderWidth: 2,
                    marign: 10
                }}>
                <WebView 
                    onMessage={m => this.onMessage(m)} 
                    // source={{uri: 'https://relentless.doitsindia.com/tradeGame/test/'}}
                    source={{uri: `https://relentless.doitsindia.com/tradeapi/index.php?symbol=${this.props.symbol}&range=1mo`}}
                    style={{
                        flex: 1
                    }}
                />
                </View>
            </View>
        )
    }
}