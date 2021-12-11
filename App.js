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
  TouchableOpacity,
  Image
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
  // const [videoRate, setVideoRate] = useState(1);
  const [playerState, setPlayerState] = useState(PLAYER_STATES.PLAYING);
  const videoRates = [0.5, 1, 1.5, 2.0, 2.5, 3.0];
  const videoUri = [
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
  ];
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentVideoRateIndex, setCurrentVideoRateIndex] = useState(1);

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
    setCurrentVideoRateIndex(1);
  };

  const onPaused = pState => {
    //console.log('playerState:',playerState);
    setPlayerState(pState);
    setPaused(!paused);
    setCurrentVideoRateIndex(1);
  };

  const onReplay = () => {
    setPlayerState(PLAYER_STATES.PLAYING);
    videoPlayer.current.seek(0);
    setCurrentVideoRateIndex(1);
  };

  const onProgress = data => {
    // const { isLoading, playerState } = this.state;
    // Video Player will continue progress even if the video already ended
    if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
      setCurrentTime(data.currentTime);
    }
  };

  const onLoad = data => {
    setDuration(data.duration);
    setIsLoading(false);
  };

  const onLoadStart = data => {
    setIsLoading(true);
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
    setCurrentTime(0);
    setCurrentVideoRateIndex(1);
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
    setCurrentTime(0);
    setCurrentVideoRateIndex(1);
  };

  const playSpeedVideoRate = () => {
    let currentRateIndex = currentVideoRateIndex;
    currentRateIndex = currentRateIndex + 1; // increase i by one
    currentRateIndex = currentRateIndex % videoRates.length;
    setCurrentVideoRateIndex(currentRateIndex); // give us back the item of where we are now
  };

  const onFullScreen = () => {
    handleFullscreen();
  };

  const onSeeking = cTime => {
    setCurrentTime(cTime);
  };

  const handleFullscreen = () => {
    fullscreen ? Orientation.lockToPortrait() : Orientation.lockToLandscape();
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View>
        <Video
          source={{uri: videoUri[currentVideoIndex].uri}}
          resizeMode="cover"
          onEnd={onEnd}
          onLoad={onLoad}
          paused={paused}
          onProgress={onProgress}
          onLoadStart={onLoadStart}
          pictureInPicture={true}
          rate={videoRates[currentVideoRateIndex]}
          onError={e => console.log('error: ', e)}
          // controls={true}
          // fullscreen={fullscreen}
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
          isLoading={isLoading}
          onFullScreen={onFullScreen}
          progress={currentTime}
          playerState={playerState}
          isFullScreen={fullscreen}>

          <MediaControls.Toolbar>
            <View style={styles.toolbar}>
              <Text style={styles.title}>{videoUri[currentVideoIndex].title} </Text>

              <TouchableOpacity
                style={{
                  height: 40,
                  width: 40,
                  backgroundColor: 'white',
                  marginLeft: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5
                }}
                onPress={() => {
                  playPrevious();
                }}>
                <Image
                  style={{height: 25, width: 25}}
                  source={require('./Images/prev.png')}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  height: 40,
                  width: 40,
                  backgroundColor: 'white',
                  marginLeft: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5
                }}
                onPress={() => {
                  playNext();
                }}>
                <Image
                  style={{height: 25, width: 25}}
                  source={require('./Images/next.png')}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  height: 40,
                  width: 40,
                  backgroundColor: 'white',
                  marginLeft: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5
                }}
                onPress={() => {
                  playSpeedVideoRate();
                }}>
                <Image
                  style={{height: 35, width: 35}}
                  source={require('./Images/speed.png')}
                />
              </TouchableOpacity>
              {(currentVideoRateIndex != 1) && (
                <Text style={{marginLeft: 10, backgroundColor: 'white', padding: 5, borderRadius: 5, alignSelf: 'center'}}>{videoRates[currentVideoRateIndex]} x</Text>
              )}
            </View>
          </MediaControls.Toolbar>
        </MediaControls>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  toolbar: {
    // marginTop: 30,
    // backgroundColor: 'white',
    // padding: 10,
    // borderRadius: 5,
    flexDirection: 'row'
  },
  title: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center'
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
