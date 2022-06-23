import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, FlatList, FlatListProps, Dimensions, Image, NativeScrollEvent, NativeSyntheticEvent, Animated, ViewToken } from 'react-native';

import * as FileSystem from 'expo-file-system';

import Slider from '@react-native-community/slider';

import { Audio, AVPlaybackSource, AVPlaybackStatus, AVPlaybackStatusSuccess, InterruptionModeAndroid, InterruptionModeIOS  } from 'expo-av';

import { RootTabScreenProps } from '../types';
import { MaterialIcons } from '@expo/vector-icons';
import { useDebounce } from '../hooks/useDebounce';
import { useFocusEffect } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/elements';

const { width, height } = Dimensions.get('screen')

const data = [
  { 
    title: 'Play Dead',
    subtitle: 'NEFFEX',
    image: 'https://cdn.dribbble.com/users/3281732/screenshots/11192830/media/7690704fa8f0566d572a085637dd1eee.jpg?compress=1&resize=1200x1200',
    source: require('../assets/Music.mp3')
  },
  { 
    title: 'Immortal',
    subtitle: 'NEFFEX',
    image: 'https://cdn.dribbble.com/users/3281732/screenshots/13130602/media/592ccac0a949b39f058a297fd1faa38e.jpg?compress=1&resize=1200x1200',
    source: require('../assets/Music2.mp3')
  },
  // 'https://cdn.dribbble.com/users/3281732/screenshots/11192830/media/7690704fa8f0566d572a085637dd1eee.jpg?compress=1&resize=1200x1200',
  // 'https://cdn.dribbble.com/users/3281732/screenshots/13130602/media/592ccac0a949b39f058a297fd1faa38e.jpg?compress=1&resize=1200x1200',
  // 'https://cdn.dribbble.com/users/3281732/screenshots/9165292/media/ccbfbce040e1941972dbc6a378c35e98.jpg?compress=1&resize=1200x1200',
  // 'https://cdn.dribbble.com/users/3281732/screenshots/11205211/media/44c854b0a6e381340fbefe276e03e8e4.jpg?compress=1&resize=1200x1200',
  // 'https://cdn.dribbble.com/users/3281732/screenshots/7003560/media/48d5ac3503d204751a2890ba82cc42ad.jpg?compress=1&resize=1200x1200',
  // 'https://cdn.dribbble.com/users/3281732/screenshots/6727912/samji_illustrator.jpeg?compress=1&resize=1200x1200',
  // 'https://cdn.dribbble.com/users/3281732/screenshots/13661330/media/1d9d3cd01504fa3f5ae5016e5ec3a313.jpg?compress=1&resize=1200x1200'
];


export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [playBackStatus, setPlayBackStatus] = React.useState<AVPlaybackStatusSuccess>({} as AVPlaybackStatusSuccess)
  const [sound, setSound] = React.useState<Audio.Sound>();

  const [index, setIndex] = React.useState(0)

  const position = useDebounce(playBackStatus.positionMillis, 50)

  React.useEffect(() => {
    // FileSystem.makeDirectoryAsync(FileSystem.documentDirectory+'all_app').then(response => {
    //   console.log({ response }); 
    // })
  }, [])

  React.useEffect(() => { 
    Audio.requestPermissionsAsync() 
    Audio.setAudioModeAsync({
      shouldDuckAndroid: true,
      staysActiveInBackground: true,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      playThroughEarpieceAndroid: false,
      allowsRecordingIOS: false,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      playsInSilentModeIOS: true,
    });
  }, [])

  const onPlaybackStatusUpdate = React.useRef(async (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setPlayBackStatus(status)
      if (status.didJustFinish) {
        await handleNextMusic()
      }
    } else {
      setPlayBackStatus(status => ({ ...status, isPlaying: false }))
    }
  }).current

  function handlePlayOrStop() {
    if (!sound) {
      const source = data[index].source
      if (source) {
        changeSound(source)
      }
    } else {
      playBackStatus.isPlaying ? stopSound() : playSound()
    }
  }

  async function playSound() {
    try {
      await sound?.playAsync(); 
    } catch(err) {
      console.log(err);
    }
  }

  async function changeSound(source: AVPlaybackSource) {
    try {
        const { sound, status } = await Audio.Sound.createAsync(source, { 
            positionMillis: playBackStatus.positionMillis,
            volume: playBackStatus.volume,
            progressUpdateIntervalMillis: 50, 
            shouldPlay: true
          },
          onPlaybackStatusUpdate
        );

        if (status.isLoaded) { setPlayBackStatus(status) }

        setSound(sound);
    } catch(err) {
      console.log(err);
    }
  }

  async function stopSound() {
    try {
      await sound?.stopAsync(); 
      await sound?.setPositionAsync(playBackStatus.positionMillis); 
    } catch(err) {
      console.log(err);
    }
  }


  async function handlePositionMillis(value: number) {
    await sound?.setPositionAsync(value)
  }

  async function handleVolume(value: number) {
    await sound?.setVolumeAsync(value)
  }

  React.useEffect(() => {
    (async () => {
      const source = data[index].source
      console.log({ index });
      await sound?.unloadAsync(); 
      const status = await sound?.loadAsync(source)
      if (status?.isLoaded) {
        await playSound()
      }
    })()
  }, [index])

  async function handleNextMusic() {
    const limit = data.length -1;
    setIndex(index => index < limit ? index+1 : 0)
  }

  async function handlePreviousMusic() {
    setIndex(index => index > 0 ? index-1 : 0)
  }

  React.useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync().finally(() => {
            setSound(undefined)
          }); 
      }
      : undefined;
  }, [sound]);

  function fomatedTime(millis: number) {
    if (!millis) return '0:00'
    const minutes = Math.floor(millis / 60000);
    const seconds = Number(((millis % 60000) / 1000).toFixed(0));
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

  const imageW = width * .7;
  const imageH = imageW * 1;

  const top = useHeaderHeight()
  
  return (
    <View style={styles.container}>
      <MusicPlayList index={index} onChangeIndex={index => setIndex(index)}
        data={data}
        renderItem={({ item }) => (
          <View style={{ width, flex: 1, paddingHorizontal: 20, paddingTop: top }}>
            <View style={{ marginBottom: 40 }}>
              <Text style={styles.title}>{data[index].title}</Text>
              <Text style={styles.subtitle}>{data[index].subtitle}</Text>
            </View>
            <View style={[
              { flex: 1, alignItems: 'center' },
              { shadowColor: '#000', shadowOpacity: .5, shadowOffset: { width: 0, height: 0 }, shadowRadius: 20 }
            ]}>
              <Image source={{ uri: item.image }} style={{
                width: imageW,
                height: imageH,
                resizeMode: 'cover',
                borderRadius: 16
              }}/>
              <View style={{ alignItems: 'center', marginTop: 40, width: '100%',  }}>
                {/* <Text>{`Volume: ${Math.floor(playBackStatus.volume*100)}`}</Text>
                <Slider
                  style={{width: 200, height: 40}}
                  minimumValue={0}
                  maximumValue={1}
                  value={playBackStatus.volume}
                  onValueChange={value => handleVolume(value)}
                  minimumTrackTintColor="#FFFFFF"
                  maximumTrackTintColor="#000000"
                /> */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 10 }}>
                  <Text style={styles.info}>{fomatedTime(playBackStatus.positionMillis)}</Text>
                  <Text style={styles.info}>{fomatedTime(playBackStatus.playableDurationMillis || 0)}</Text>
                </View>
                <Slider 
                  // thumbImage={undefined}
                  // thumbTintColor='transparent'
                  // trackImage={undefined}
                  style={{width: '100%', height: 40 }}
                  minimumValue={0}
                  maximumValue={playBackStatus.playableDurationMillis}
                  value={position}
                  onSlidingComplete={(value) => handlePositionMillis(value)}
                  minimumTrackTintColor="#FFFFFF"
                  maximumTrackTintColor="#000000"
                />

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '75%', marginTop: 20 }}>
                  <TouchableOpacity disabled={index === 0} onPress={() => handlePreviousMusic()}>
                    <MaterialIcons style={[index === 0 && { opacity: .2 }]} size={24*2} color={'white'}
                      name={'skip-previous'}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePlayOrStop()}>
                    <MaterialIcons size={24*2.5} color={'white'}
                      name={playBackStatus.isPlaying ? 'pause-circle-filled' : 'play-circle-fill'}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity disabled={index === data.length-1} onPress={() => handleNextMusic()}>
                    <MaterialIcons style={[index === data.length-1 && { opacity: .1 }]} size={24*2} color={'white'}
                      name={'skip-next'}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}



interface MusicPlayListProps<ItemT = any> extends FlatListProps<ItemT> {
  onChangeIndex: (index: number) => any
  index: number
}

const MusicPlayList = React.forwardRef(({ onChangeIndex, index, ...props }: MusicPlayListProps, ref: React.ForwardedRef<FlatList>) => {
  const flatListRef = React.useRef<FlatList>(null)

  React.useEffect(() => {
    flatListRef.current?.scrollToIndex({ index, animated: true })
  }, [index])

  const scrollX = React.useRef(new Animated.Value(0)).current

  // const _onViewableItemsChanged = React.useRef(({ viewableItems, changed }: { viewableItems: ViewToken[], changed: ViewToken[], }) => {
  //     console.log("Visible items are", viewableItems);
  //     console.log("Changed in this iteration", changed);
  //     onChangeIndex?.(changed?.[0]?.index || 0)
  // }).current

  // const _viewabilityConfig = { itemVisiblePercentThreshold: 50 }

  const _onMomentumScrollEnd = React.useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    onChangeIndex?.(roundIndex)
    console.log("roundIndex:", roundIndex);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={[
        StyleSheet.absoluteFillObject,
      ]}>
        {data.map(({ image }, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width
          ]
          const opacity = scrollX.interpolate({
            inputRange, outputRange: [0, 1, 0],

          })
          return (
            <Animated.Image key={`image-${image}`} source={{ uri: image }}
              blurRadius={50}
              style={[ 
                StyleSheet.absoluteFillObject, { opacity }
              ]}
            />
          )
        })}
      </View>
      <Animated.FlatList ref={flatListRef} style={{ flex: 1 }} 
        showsHorizontalScrollIndicator={false}
        // onViewableItemsChanged={_onViewableItemsChanged}
        // viewabilityConfig={_viewabilityConfig}
        onScroll={Animated.event(
          [{nativeEvent: { contentOffset: { x: scrollX } }}],
          { useNativeDriver: true }
        )}
        onMomentumScrollEnd={_onMomentumScrollEnd}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        {...props}
      />
    </View>
  )
})

// export default MusicPlayList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20*2,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    opacity: .7
  },
  info: {
    fontSize: 12,
    fontWeight: '500',
    color: 'white'
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
