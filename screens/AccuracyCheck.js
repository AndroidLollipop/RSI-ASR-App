import React from 'react';
import { ScrollView, StyleSheet, Text, View, TextInput, Dimensions } from 'react-native';

var fetchData = require("../fetchData")

export default class AccuracyCheck extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.name}`,
     headerTitleStyle : {textAlign: 'center',alignSelf:'center'},
        headerStyle:{
            backgroundColor:'white',
        },
    });

  constructor(props) {
    super(props);
    this.state = {text: "", accuracyText:"0%"}
    this.latestScheduled = 0
  }

  componentDidMount() {
    if (fetchData.StateData.savedText){
      this.setState({text: fetchData.StateData.savedText})
      this.updateAccuracy.bind(this)(fetchData.StateData.savedText)
    }
  }

  updateAccuracy(text) {
    this.setState({text: text})
    fetchData.StateData.savedText = text
    this.latestScheduled++
    this.scheduleAccuracy.bind(this)(this.latestScheduled)
  }

  scheduleAccuracy(latestScheduled){
    setTimeout(() => {
      if (this.latestScheduled == latestScheduled){
        var text = this.props.navigation.state.params.asrText ? this.props.navigation.state.params.asrText.split(" ").join("") : ""
        var supposed = this.state.text.split(" ").join("")
        console.log(text)
        console.log(supposed)
        var previous = new Array()
        for (var i = 0; i <= text.length; i++){
          previous[i] = i
        }
        var min;
        for (var s = 1; s <= supposed.length; s++){
          var current = new Array()
          current[0] = s
          for (var i = 1; i <= text.length; i++){
            min = Math.min(previous[i-1], previous[i], current[i-1])+1
            if (text[i-1] == supposed[s-1]){
              min = Math.min(min, previous[i-1])
            }
            current[i] = min
          }
          previous = current
        }
        if (text.length && supposed.length){
          console.log((100*(Math.max(text.length, supposed.length)-current[text.length])/Math.max(text.length, supposed.length)).toFixed(0)+"%")
          this.setState({accuracyText: (100*(Math.max(text.length, supposed.length)-current[text.length])/Math.max(text.length, supposed.length)).toFixed(0)+"%"})
        }
        else{
          console.log(text.length)
          this.setState({accuracyText: "0%"})
        }
      }
    }, 33)
  }

  render() {
    let {height, width} = Dimensions.get("window")
    this.width = width
    this.height = height
    //fetch this per render, because window size can change when the user switches from landscape to portrait
    return (
      <ScrollView style={styles.container}>
        <View style={{alignItems: 'center'}}>
          {this.props.navigation.state.params.asrText ? <Text>{"ASR text:"}</Text> : null}
          <Text>{this.props.navigation.state.params.asrText ? this.props.navigation.state.params.asrText : "You haven't made a request! Come back here after making one"}</Text>
          <TextInput
            editable={true}
            multiline={true}
            numberOfLines={4}
            onChangeText={(text) => this.updateAccuracy.bind(this)(text)}
            style={{height: 250, width: this.width, backgroundColor: '#ffffff'}}
            value={this.state.text}
            placeholder={"What you said"}
          />
          <Text>{"Accuracy:"}</Text>
          <Text>{this.state.accuracyText}</Text>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: '#dddddd',
  },
});
