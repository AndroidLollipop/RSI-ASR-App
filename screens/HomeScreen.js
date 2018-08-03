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
    this.state = {shelfHighlight: null, animatedOpacity: new Animated.Value(1), isRecording: false, soundLoaded: false, audioPlaying: false, nextScreen: true, asrLoaded: false, cells: false, polygonMap: false, serverURL: fetchData.StateData.ServerURL};
    this.searchRanker = null;
    this.storeData = null;
    this.asrText = null;
    this.resultCells = null;
    this.rankingResults = null;
    this.startRecordingEnable = true;
    this.sstopRecordingEnable = false;
    this.listenerIndex = null;
  }
  static navigationOptions = {
    title: "Home",
  };

  componentDidMount(){ //componentDidMount runs immediately after this component finishes rendering for the first time
    this.generateMap.bind(this)()
    this.listenerIndex = fetchData.RefEventListeners.push(
      async () => {
        this.storeData = await fetchData.getStoreData()
        this.searchRanker = await this.getRanker()
        this.refreshSearchResults.bind(this)()
        for (var i = 0; i < fetchData.AsrEventListeners.length; i++){
          var f = fetchData.AsrEventListeners[i]
          if (f){
            f()
          }
        }
    })-1
  }

  componentWillUnmount(){
    fetchData.RefEventListeners[this.listenerIndex] = undefined
  }

  async startAudioRecording(){ //start animations and start audio recording
    if (!this.startRecordingEnable){ //this ensures that only 1 execution context can enter the following critical section at any time
      return
    }
    this.startRecordingEnable = false
    await Permissions.askAsync(Permissions.AUDIO_RECORDING); //get user permission
    await Audio.setIsEnabledAsync(true);
    await Audio.setAudioModeAsync({ //audio recording boilerplate straight from documentation
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
    this.setState({ //update button state
      //we don't want to mislead the user by starting the animation and swapping the buttons before the recording actually begins
      //the alternative would be to warm up a recording in the background and to truncate it to the appropriate length after the user ends a recording
      //but the complexity of implementing that is not worth the 0.5 seconds it saves
      isRecording: true
    })
    this.radialAnimation = Animated.loop( //start the ripple
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
    this.sstopRecordingEnable = true //allow an execution context to enter the stop recording critical section
  }

  async renderItemOP(x){
    try{
      fetchData.StateData.SelectedShelf = (await this.storeData)["map"]["shelfMap"][x.shelfLocation][x.shelfColumn]
    }
    catch(e){
      fetchData.StateData.SelectedShelf = null
    }
    for (var i = 0; i < fetchData.MapEventListeners.length; i++){
      var f = fetchData.MapEventListeners[i]
      if (f){
        f()
      }
    }
    this.generateMap()
  }

  renderItem(x, i){ //render each cell
    return <Cell key={i} cellStyle="RightDetail" title={x.itemName} detail={x.friendlyLocation} onPress = {() => this.renderItemOP.bind(this)(x)}/>
  }

  makeTableView(){ //create result table
    this.resultCells = this.rankingResults.map(this.renderItem.bind(this))
    return <TableView>
      <Section>
        {this.resultCells}
      </Section>
    </TableView>
  }

  makePolygon(x, i){ //render each shelf
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

  makeHighlight(x, i){
    return (
      <Polygon
        key={i}
        points={x.map(x => x.map(x => x*this.width).join(",")).join(" ")}
        fill="red"
        stroke="purple"
        strokeWidth="1"
      />
    )
  }

  async generateMap(){ //render result map
    var savedSD = fetchData.StateData.SelectedShelf
    //we must save selectedShelf before we yield
    //this really should be a function call parameter but idc
    this.storeData = await this.storeData
    let pma = helperFunctions.flattenList(Object.values(this.storeData["map"]["shelfMap"])).map(this.makePolygon.bind(this)) //formatting shelf data and mapping each shelf to a polygon
    try {
      let hil = this.makeHighlight(savedSD, pma.length)
      this.setState({
        shelfHighlight: hil
      })
    }
    catch(e){
      this.setState({
        shelfHighlight: null
      })
    }
    this.setState({
      polygonMap: pma
    })
  }

  async secondScreenMapGenerator(){ //map for resultsscreen
    var savedSD = fetchData.StateData.SelectedShelf
    //we must save selectedShelf before we yield
    //this really should be a function call parameter but idc
    this.storeData = await this.storeData
    let pma = helperFunctions.flattenList(Object.values(this.storeData["map"]["shelfMap"])).map(this.makePolygon.bind(this))
    var hil = null;
    try {
      hil = this.makeHighlight(savedSD, pma.length)
    }
    catch(e){
    }
    return <Svg
      height={this.width}
      width={this.width}
    >
    {pma}
    {hil}
    </Svg>
  }

  displaySearchResults(){ //called by stopAudioRecording
    this.renderItemOP.bind(this)(this.rankingResults[0])
    var cells = this.makeTableView.bind(this)()
    this.setState({
      cells: cells
    })
    if (this.state.nextScreen){
      this.navigateto('Result', {'name': 'Search Results', 'cellsGetter': this.resultCellsGetter.bind(this), 'mapGenerator': this.secondScreenMapGenerator.bind(this), 'asrTextGetter': () => this.asrText})
    }
  }

  resultCellsGetter(){
    return this.state.cells
  }

  refreshSearchResults(){
    if (!this.rankingResults){
      return
    }
    this.rankingResults = this.searchRanker(this.asrText)
    var cells = this.makeTableView.bind(this)()
    this.setState({
      cells: cells
    })
  }

  async stopAudioRecording(){
    if (!this.sstopRecordingEnable){ //this ensures that only 1 execution context can enter the following critical section at any time
      return
    }
    this.sstopRecordingEnable = false
    this.radialAnimation.stop()
    setTimeout(() => this.setState({ animatedOpacity: new Animated.Value(1) }), 0)
    //immediately setState-ing doesn't work as Animation.stop() is asynchronous and doesn't provide a completion callback or promise
    this.setState({
      isRecording: false
    })
    //wait for rerender to complete before proceeding to prevent stuttering
    await this.recording.stopAndUnloadAsync();
    const rec = this.recording
    this.startRecordingEnable = true //allow an execution context to enter the start audio recording critical section
    const recuri = rec.getURI()
    const info = await FileSystem.getInfoAsync(recuri)
    const { sound, status } = await rec.createNewLoadedSound()
    this.sound = sound;
    this.setState({
      soundLoaded: true
    })
    var [asr, ran, storeData] = await Promise.all([fetchData.getAsrText(recuri), this.searchRanker, this.storeData]);
    this.asrText = asr
    for (var i = 0; i < fetchData.AsrEventListeners.length; i++){ //updates accuracycheck screen
      var f = fetchData.AsrEventListeners[i]
      if (f){
        f()
      }
    }
    this.searchRanker = ran
    this.storeData = storeData
    this.setState({ //enable playback controls
      asrLoaded: true
    })
    this.rankingResults = ran(asr) //get search rankings
    this.displaySearchResults.bind(this)() //display search results
  }

  async startPlaying(){ //debug control, will be removed in final app
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

  stopPlaying(){ //debug control, will be removed in final app
    this.sound.stopAsync();
    this.setState({
      audioPlaying: false
    })
  }

  swapScreen(){ //debug option, will be removed in final app
    this.setState({
      nextScreen: !this.state.nextScreen
    })
  }

  recordingIndicator(){ //ui
    if (this.state.isRecording){
      return <Text>Recording</Text>
    }
    else{
      return <Text>Not Recording</Text>
    }
  }

  imageRecordingButton(){ //ui
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
            style={{opacity: Animated.add(6, Animated.multiply(this.state.animatedOpacity, -5)), width: 250, height: 250, left: 0, top: 0, transform: [{scale: this.state.animatedOpacity}]}}
            source={fetchData.Images.animationRipple}
            />
          <Image
            style={{width: 250, height: 250, position: "absolute", left: 0, top: 0}}
            source={fetchData.Images.recording}
            />
          </View>
      </TouchableHighlight>
    }
  }

  recordingButton(){ //ui
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

  playbackButton(){ //ui
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

  resultButton(){ //ui
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

  textIndicator(){ //ui
    if (this.state.asrLoaded){
      return <Text>{this.asrText}</Text>
    }
  }

  updateServerURL(text){ //server selection, will be removed in final app
    this.setState({
      serverURL: text
    })
    fetchData.StateData.ServerURL = text
  }

  render() { //ui
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
    let hil = this.state.shelfHighlight
    let {height, width} = Dimensions.get("window")
    let irecbutto = this.imageRecordingButton()
    this.height = height
    this.width = width
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
                <View>
                  <Image
                    style={{width: 250, height: 250, position: "absolute", left: 0, top: 0}}
                    source={fetchData.Images.notRecording}
                    />
                  {irecbutto}
                </View>
              </View>
              {rebutton}
              <Button
                onPress={() => {this.renderItemOP.bind(this)({})}}
                title="Clear map highlight"
                color="#841584"
              />
              <Button
                title="Navigation Test"
                onPress={() =>
                  navigate('Result', {'name': 'Whenever is a mantra I live for', 'cellsGetter': this.resultCellsGetter.bind(this), 'mapGenerator': this.secondScreenMapGenerator.bind(this), 'asrTextGetter': () => this.asrText})
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
              {hil}
              </Svg>
            </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({ //stylesheet
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
