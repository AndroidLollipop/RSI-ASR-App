import React from 'react';
import { ScrollView, StyleSheet, Button } from 'react-native';

var fetchData = require("../fetchData");

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
    this.state = {myMap: false, cells: false}
    this.listenerIndex = null;
    this.listenerIndey = null;
  }

  async componentDidMount(){
    this.listenerIndex = fetchData.MapEventListeners.push(async () => {let map = await this.props.navigation.state.params.mapGenerator(); this.setState({myMap: map})})-1
    this.listenerIndey = fetchData.RefEventListeners.push(async () => {let cells = await this.props.navigation.state.params.cellsGetter(); this.setState({cells: cells})})-1
    let cells = this.props.navigation.state.params.resultcells
    let map = this.props.navigation.state.params.mapGenerator()
    this.setState({
      cells: cells
    })
    this.setState({
      myMap: await map
    })
  }

  componentWillUnmount(){
    fetchData.MapEventListeners[this.listenerIndex] = undefined
    fetchData.RefEventListeners[this.listenerIndey] = undefined
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
        {this.state.cells}
        {this.state.myMap}
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
