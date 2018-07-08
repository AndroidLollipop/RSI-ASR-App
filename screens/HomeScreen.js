import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Animated,
  Easing,
  View,
  Button,
  Dimensions
} from 'react-native';
import { WebBrowser, Audio, Permissions, FileSystem } from 'expo';

import { MonoText } from '../components/StyledText';

import {
  Cell,
  Section,
  TableView
} from 'react-native-tableview-simple';

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

var searchRanker = require("../searchRanker")

var helperFunctions = require("../helperFunctions")

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {animatedOpacity: new Animated.Value(1), isRecording: false, soundLoaded: false, audioPlaying: false, nextScreen: true, asrLoaded: false, cells: false, polygonMap: false, serverURL: fetchData.StateData.ServerURL};
    this.searchRanker = null;
    this.storeData = null;
    this.asrText = null;
    this.resultCells = null;
    this.rankingResults = null;
    this.startRecordingEnable = true;
    this.sstopRecordingEnable = false;
  }
  static navigationOptions = {
    title: "Home",
  };

  componentDidMount(){
    this.generateMap.bind(this)()
  }

  async startAudioRecording(){
    if (!this.startRecordingEnable){
      return
    }
    this.startRecordingEnable = false
    await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    await Audio.setIsEnabledAsync(true);
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    });
    this.recording = new Audio.Recording();
    try {
      await this.recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await this.recording.startAsync();
    } catch (error) {
      alert(error)
    }
    let [myResolve, myPromise] = helperFunctions.awaitreschedule()
    this.setState({
      isRecording: true
    }, () => setTimeout(() => myResolve(), 1))
    await myPromise
    this.radialAnimation = Animated.loop(
      Animated.timing(
        this.state.animatedOpacity,
        {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true
        }
      )
    )
    this.radialAnimation.start()
    this.sstopRecordingEnable = true
  }

  renderItem(x, i){
    return <Cell key={i} cellStyle="RightDetail" title={x.itemName} detail={x.friendlyLocation}/>
  }

  makeTableView(){
    this.resultCells = this.rankingResults.map(this.renderItem)
    return <TableView>
      <Section>
        {this.resultCells}
      </Section>
    </TableView>
  }

  makePolygon(x, i){
    console.log(x.map(x => x.map(x => x*this.width).join(",")).join(" "))
    return (
      <Polygon
        key={i}
        points={x.map(x => x.map(x => x*this.width).join(",")).join(" ")}
        fill="lime"
        stroke="purple"
        strokeWidth="1"
      />
    )
  }

  async generateMap(){
    this.storeData = await this.storeData
    let pma = helperFunctions.flattenList(Object.values(this.storeData["map"]["shelfMap"])).map(this.makePolygon.bind(this))
    this.setState({
      polygonMap: pma
    })
  }

  async secondScreenMapGenerator(){
    this.storeData = await this.storeData
    let pma = helperFunctions.flattenList(Object.values(this.storeData["map"]["shelfMap"])).map(this.makePolygon.bind(this))
    return <Svg
      height={this.width}
      width={this.width}
    >
    {pma}
    </Svg>
  }

  displaySearchResults(){
    var cells = this.makeTableView.bind(this)()
    this.setState({
      cells: cells
    })
    if (this.state.nextScreen){
      this.navigateto('Result', {'name': 'Search Results', 'resultcells': cells, 'mapGenerator': this.secondScreenMapGenerator.bind(this), 'asrTextGetter': () => this.asrText})
    }
  }

  async stopAudioRecording(){
    if (!this.sstopRecordingEnable){
      return
    }
    this.sstopRecordingEnable = false
    this.radialAnimation.stop()
    setTimeout(() => this.setState({ animatedOpacity: new Animated.Value(1) }), 0)
    let [myResolve, myPromise] = helperFunctions.awaitreschedule()
    this.setState({
      isRecording: false
    }, () => setTimeout(() => myResolve(), 1))
    //wait for rerender to complete before proceeding to prevent stuttering
    await myPromise
    await this.recording.stopAndUnloadAsync();
    this.startRecordingEnable = true
    const recuri = this.recording.getURI()
    const info = await FileSystem.getInfoAsync(recuri)
    const { sound, status } = await this.recording.createNewLoadedSound()
    this.sound = sound;
    this.setState({
      soundLoaded: true
    })
    var [asr, ran, storeData] = await Promise.all([fetchData.getAsrText(recuri), this.searchRanker, this.storeData]);
    this.asrText = asr
    for (var i = 0; i < fetchData.AsrEventListeners.length; i++){
      var f = fetchData.AsrEventListeners[i]
      if (f){
        f()
      }
    }
    this.searchRanker = ran
    this.storeData = storeData
    //why this weird deconstructor promise syntax?
    //believe it or not, this is basically the only way to get 2 promises to resolve simultaneously in a single asynchronous function!
    this.setState({
      asrLoaded: true
    })
    this.rankingResults = ran(asr)
    this.displaySearchResults.bind(this)()
  }

  async startPlaying(){
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    })
    this.sound.playAsync();
    this.setState({
      audioPlaying: true
    })
  }

  getRanker(){
    return searchRanker.getRanker()
  }

  stopPlaying(){
    this.sound.stopAsync();
    this.setState({
      audioPlaying: false
    })
  }

  swapScreen(){
    this.setState({
      nextScreen: !this.state.nextScreen
    })
  }

  recordingIndicator(){
    if (this.state.isRecording){
      return <Text>Recording</Text>
    }
    else{
      return <Text>Not Recording</Text>
    }
  }

  imageRecordingButton(){
    if (!this.state.isRecording){
      return <TouchableHighlight
        onPress={this.startAudioRecording.bind(this)}
        style={{height: 250, width: 250, borderRadius: 125}}>
        <Image
          style={{width: 250, height: 250}}
          source={fetchData.Images.notRecording}
          />
      </TouchableHighlight>
    }
    else{
      return <TouchableHighlight
        onPress={this.stopAudioRecording.bind(this)}
        style={{height: 250, width: 250, borderRadius: 125}}>
        <View>
          <Animated.Image
            style={{opacity: Animated.add(6, Animated.multiply(this.state.animatedOpacity, -5)), width: 250, height: 250, position: "absolute", left: 0, top: 0, transform: [{scale: this.state.animatedOpacity}]}}
            source={fetchData.Images.recording}
            />
          <Image
            style={{width: 250, height: 250, position: "absolute", left: 0, top: 0}}
            source={fetchData.Images.recording}
            />
          </View>
      </TouchableHighlight>
    }
  }

  recordingButton(){
    if (!this.state.isRecording){
      return <Button
        onPress={this.startAudioRecording.bind(this)}
        title="Find Item"
        color="#841584"
      />
    }
    else{
      return <Button
        onPress={this.stopAudioRecording.bind(this)}
        title="Stop Recording"
        color="#841584"
      />
    }
  }

  playbackButton(){
    if (this.state.soundLoaded){
      if (this.state.audioPlaying){
        return <Button
        onPress={this.stopPlaying.bind(this)}
        title="Stop Playing"
        color="#841584"
      />
      }
      else{
        return <Button
        onPress={this.startPlaying.bind(this)}
        title="Start Playing"
        color="#841584"
      />
      }
    }
  }

  resultButton(){
    if (this.state.nextScreen){
      return <Button
        onPress={this.swapScreen.bind(this)}
        title="Display results on this screen"
        color="#841584"
      />
    }
    else{
      return <Button
        onPress={this.swapScreen.bind(this)}
        title="Display results on next screen"
        color="#841584"
      />
    }
  }

  textIndicator(){
    if (this.state.asrLoaded){
      return <Text>{this.asrText}</Text>
    }
  }

  updateServerURL(text){
    this.setState({
      serverURL: text
    })
    fetchData.StateData.ServerURL = text
  }

  render() {
    const { navigate } = this.props.navigation
    this.navigateto = navigate
    let animatedOpacity = this.state.animatedOpacity
    let indicator = this.recordingIndicator()
    let recbutton = this.recordingButton()
    let playback = this.playbackButton()
    let rebutton = this.resultButton()
    let tedicator = this.textIndicator()
    this.searchRanker = this.getRanker()
    this.storeData = fetchData.getStoreData()
    let map = this.state.polygonMap
    let {height, width} = Dimensions.get("window")
    let irecbutto = this.imageRecordingButton()
    this.height = height
    this.width = width
    //YES, WE WILL EVENTUALLY IMPLEMENT CACHING
    //NOT NOW THO FOR TESTING PURPOSES
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View>
              <View style={styles.welcomeContainer}>
                <Text>{"Server URL"}</Text>
                <TextInput
                  editable={true}
                  multiline={true}
                  numberOfLines={4}
                  onChangeText={(text) => this.updateServerURL.bind(this)(text)}
                  style={{height: 50, width: this.width, backgroundColor: '#dddddd'}}
                  value={this.state.serverURL}
                  placeholder={"Server URL"}
                />
              </View>
              {recbutton}
              <View style={styles.welcomeContainer}>
                {indicator}
                {tedicator}
              </View>
              {playback}
              <View style={styles.welcomeContainer}>
                {irecbutto}
              </View>
              {rebutton}
              <Button
                title="Navigation Test"
                onPress={() =>
                  navigate('Result', {'name': 'Whenever is a mantra I live for', 'resultcells': this.state.cells, 'mapGenerator': this.secondScreenMapGenerator.bind(this), 'asrTextGetter': () => this.asrText})
                }
              />
              <Button
                title="Check Accuracy"
                onPress={() =>
                  navigate('Accuracy', {'name': 'Check Accuracy', 'asrTextGetter': () => this.asrText})
                }
              />
              {this.state.nextScreen ? false : this.state.cells}
              <View style={styles.welcomeContainer}>
                <Text>{"Map, map, I'm a map"}</Text>
              </View>
              <Svg
                height={this.width}
                width={this.width}
              >
              {map}
              </Svg>
            </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
