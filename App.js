/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect, useRef} from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Dimensions,
  TouchableOpacity
} from 'react-native';

import Video from 'react-native-video';
import MediaControls, {PLAYER_STATES} from 'react-native-media-controls';
import Orientation, {
  useOrientationChange,
  useDeviceOrientationChange,
  useLockListener,
} from 'react-native-orientation-locker';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';


const App: () => Node = () => {
  const videoPlayer = useRef();
  const isDarkMode = useColorScheme() === 'dark';
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const [playerState, setPlayerState] = useState(PLAYER_STATES.PLAYING);
  const [videoUri, setVideoUri] = useState([
    {
      title: 'video1',
      uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    },
    {
      title: 'video2',
      uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    },
    {
      title: 'video3',
      uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    },
    {
      title: 'video4',
      uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    },
    {
      title: 'video5',
      uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    }
  ]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // const [isLocked, setLocked] = useState();
  // const [orientation, setOrientation] = useState();
  // const [deviceOrientation, setDeviceOrientation] = useState();
  // const [lock, setLock] = useState();

  useEffect(() => {
    // checkLocked();
  });

  useOrientationChange((orientation) => {
    orientation === 'LANDSCAPE-LEFT' ||
    orientation === 'LANDSCAPE-RIGHT' ||
    orientation === 'LANDSCAPE'
      ? (setFullscreen(true), StatusBar.setHidden(true))
      : (setFullscreen(false), StatusBar.setHidden(false));
  });

  useDeviceOrientationChange((orientation) => {
    orientation === 'LANDSCAPE-LEFT' ||
    orientation === 'LANDSCAPE-RIGHT' ||
    orientation === 'LANDSCAPE'
      ? (setFullscreen(true),
        Orientation.lockToPortrait(),
        // videoPlayer.presentFullscreenPlayer(),
        StatusBar.setHidden(true))
      : (setFullscreen(false),
        // videoPlayer.dismissFullscreenPlayer(),
        StatusBar.setHidden(false));
  });

  // useLockListener((o) => {
  //   setLocked(o);
  // });

  // const checkLocked = () => {
  //   const locked = Orientation.isLocked();
  //   if (locked !== isLocked) {
  //     setLocked(locked);
  //   }
  // };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const onSeek = seek => {
    videoPlayer.current.seek(seek);
  };

  const onPaused = pState => {
    //console.log('playerState:',playerState);
    setPlayerState(pState);
    setPaused(!paused);
    // this.setState({
    //   paused: !this.state.paused,
    //   playerState
    // });
  };

  const onReplay = () => {
    setPlayerState(PLAYER_STATES.PLAYING);
    // this.setState({ playerState: PLAYER_STATES.PLAYING });
    videoPlayer.current.seek(0);
  };

  const onProgress = data => {
    // const { isLoading, playerState } = this.state;
    // Video Player will continue progress even if the video already ended
    if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
      setCurrentTime(data.currentTime);
      //this.setState({ currentTime: data.currentTime });
    }
  };

  const onLoad = data => {
    setDuration(data.duration);
    setIsLoading(false);
    // this.setState({ duration: data.duration, isLoading: false });
  };

  const onLoadStart = data => {
    setIsLoading(true);
    // this.setState({ isLoading: true });
  };

  const onEnd = () => {
    playNext();
  };

  const playNext = () => {
    // playNext() method takes the first item in the this.state.playlist array and moves it to the back
    //console.log('video did just finish');
    let currentIndex = currentVideoIndex;
    currentIndex = currentIndex + 1; // increase i by one
    currentIndex = currentIndex % videoUri.length; // if we've gone too high, start from `0` again
    setCurrentVideoIndex(currentIndex); // give us back the item of where we are now
  };

  const playPrevious = () => {
    // playNext() method takes the first item in the this.state.playlist array and moves it to the back
    //console.log('video did just finish');
    let currentIndex = currentVideoIndex;
    if (currentIndex === 0) {
      // i would become 0
      currentIndex = videoUri.length; // so put it at the other end of the array
    }
    currentIndex = currentIndex - 1; // decrease by one
    setCurrentVideoIndex(currentIndex); // give us back the item of where we are now
  };

  const onFullScreen = () => {
    handleFullscreen();
  };

  const onSeeking = cTime => {
    setCurrentTime(cTime);
    // this.setState({ currentTime });
  };

  const handleFullscreen = () => {
    fullscreen ? Orientation.lockToPortrait() : Orientation.lockToLandscape();
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View>
        <Video
          //source={{uri: ""+item.src}}   // Can be a URL or a local file.
          source={{uri: videoUri[currentVideoIndex].uri}}
          resizeMode="cover"
          onEnd={onEnd}
          onLoad={onLoad}
          paused={paused}
          onProgress={onProgress}
          onLoadStart={onLoadStart}
          pictureInPicture={true}
          rate={1}
          onError={e => console.log('error: ', e)}
          // controls={true}
          // fullscreen={fullscreen}
          //poster={item.image}
          //posterResizeMode='cover'
          ref={videoPlayer}
          style={{
            width: Dimensions.get('window').width,
            height: fullscreen ? Dimensions.get('window').height : 250,
          }}
        />
        <MediaControls
          mainColor="green"
          onSeek={onSeek}
          onReplay={onReplay}
          onPaused={onPaused}
          onSeeking={onSeeking}
          duration={duration}
          // fadeOutDelay={4000}
          //toolbar={this.renderToolbar()}
          isLoading={isLoading}
          onFullScreen={onFullScreen}
          progress={currentTime}
          playerState={playerState}
          isFullScreen={fullscreen}>

          <MediaControls.Toolbar>
            <View style={styles.toolbar}>
              <Text>{videoUri[currentVideoIndex].title} </Text>

            </View>
            <TouchableOpacity
              style={{
                height: 30,
                width: 40,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#c6c6c6',
                position: 'absolute',
                bottom: 0,
                right: 0,
                left:0,
                top:0,
                borderRadius: 5,
              }}
              onPress={() => {
                playNext();
              }}>
              <Text>Skip</Text>
            </TouchableOpacity>
          </MediaControls.Toolbar>
        </MediaControls>
        {/* {(!this.state.reportGenerated) && (
          <TouchableOpacity style={{height:30, width: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: "#c6c6c6", position: 'absolute', bottom: 40, right: 15, borderRadius: 5}}
            onPress={() => {this.playNext()}}>
            <Text>Skip</Text>
          </TouchableOpacity>
        )} */}

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  toolbar: {
    // marginTop: 30,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
