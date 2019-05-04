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

var callbags = require("../callbags/callbags")

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
    this.listenerIndex = null;
    this.listenerIndey = null;
    this.searchCellsStream = null;
    let {height, width} = Dimensions.get("window");
    this.height = height;
    this.width = width;
    this.mounted = true;
  }

  async componentDidMount(){
    this.listenerIndex = fetchData.MapEventListeners.push(() => {let hil = this.props.navigation.state.params.highlightGetter(); let phi = this.props.navigation.state.params.pathHighlightGetter(); let loc = this.props.navigation.state.params.locHighlightGetter(); this.setState({myHighlight: hil, myPathHighlight: phi, myLocHighlight: loc})})-1
    this.searchCellsStream = callbags.factoryToCallback(cells => {
      this.setState({cells: cells})
    })
    this.searchCellsStream.callbag(fetchData.searchCellsStream.callbag)
    let cells = this.props.navigation.state.params.resultcells
    let map = this.props.navigation.state.params.mapGenerator()
    let hil = this.props.navigation.state.params.highlightGetter()
    let phi = this.props.navigation.state.params.pathHighlightGetter()
    let loc = this.props.navigation.state.params.locHighlightGetter()
    this.setState({
      cells: cells,
      myHighlight: hil,
      myPathHighlight: phi,
      myLocHighlight: loc
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
    fetchData.MapEventListeners[this.listenerIndex] = undefined
    fetchData.RefEventListeners[this.listenerIndey] = undefined
    this.searchCellsStream.terminate()
  }

  render() {
    const { navigate } = this.props.navigation
    return (
      <ScrollView style={styles.container}>
        <Button
          title="Check Accuracy"
          onPress={() =>
            navigate('Accuracy', {'name': 'Check Accuracy', 'asrTextGetter': this.props.navigation.state.params.asrTextGetter})
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
