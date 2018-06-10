import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

export default class ResultsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.name}`,
     headerTitleStyle : {textAlign: 'center',alignSelf:'center'},
        headerStyle:{
            backgroundColor:'white',
        },
    });

  render() {
    return (
      <ScrollView style={styles.container}>
        {this.props.navigation.state.params.resultcells}
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
