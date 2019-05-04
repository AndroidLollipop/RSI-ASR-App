import React from 'react';
import { ScrollView, StyleSheet, Button, Dimensions, TouchableOpacity } from 'react-native';

import Svg,{
  Circle,
  Ellipse,
  G,
  LinearGradient,
  RadialGradient,
  Line,
  Path,
  Polygon,
  Polyline,
  Rect,
  Symbol,
  Use,
  Defs,
  Stop
} from 'react-native-svg';

var fetchData = require("../fetchData");

const callbags = require("../callbags/callbags")

export default class ResultsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.name}`,
     headerTitleStyle : {textAlign: 'center',alignSelf:'center'},
        headerStyle:{
            backgroundColor:'white',
        },
    });

  constructor(props) {
    super(props);
    this.state = {myMap: false, cells: false, myHighlight: false, myPathHighlight: false, myLocHighlight: false}
    this.searchCellsStream = null;
    let {height, width} = Dimensions.get("window");
    this.height = height;
    this.width = width;
    this.mounted = true;
  }

  async componentDidMount(){
    this.searchCellsStream = callbags.factoryPullCallback(cells => {
      this.setState({cells: cells})
    })
    this.searchCellsStream.callbag(fetchData.searchCellsStream.callbag)
    this.mapHighlightStream = callbags.factoryPullCallback(highlights => {
      if (highlights) {
        this.setState({
          myHighlight: highlights.shelfHighlight,
          myPathHighlight: highlights.pathHighlight,
          myLocHighlight: highlights.locHighlight
        })
      }
    })
    this.mapHighlightStream.callbag(fetchData.mapHighlightStream.callbag)
    let cells = this.props.navigation.state.params.resultcells
    let map = this.props.navigation.state.params.mapGenerator()
    this.setState({
      cells: cells
    })
    let myMap = await map
    //this component may have unmounted while we were waiting for map
    if (this.mounted) {
      this.setState({
        myMap: myMap,
      })
    }
  }

  componentWillUnmount(){
    this.mounted = false
    this.searchCellsStream.terminate()
    this.mapHighlightStream.terminate()
  }

  render() {
    const { navigate } = this.props.navigation
    return (
      <ScrollView style={styles.container}>
        <Button
          title="Check Accuracy"
          onPress={() =>
            navigate('Accuracy', {'name': 'Check Accuracy'})
          }
        />
        <Button
          title="Get Recommendations"
          onPress={this.props.navigation.state.params.getRec(this.props.navigation)}
        />
        {this.state.cells}
        <TouchableOpacity
          activeOpacity={1}
          onPress={this.props.navigation.state.params.mapCanvasOP}
        >
          <Svg
            height={this.width}
            width={this.width}
          >
          {this.state.myMap}
          {this.state.myHighlight}
          {this.state.myPathHighlight}
          {this.state.myLocHighlight}
          </Svg>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: '#fff',
  },
});
