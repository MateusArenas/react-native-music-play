import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, FlatList, FlatListProps, Dimensions, Image, NativeScrollEvent, NativeSyntheticEvent, Animated, ViewToken } from 'react-native';

import Slider from '@react-native-community/slider';

import { RootTabScreenProps } from '../types';
import { MaterialIcons } from '@expo/vector-icons';
import { useDebounce } from '../hooks/useDebounce';
import { useFocusEffect } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/elements';
import PlayerContext from '../contexts/player';
import { fomatedTime } from '../helpers';
import MusicPlayList from '../components/MusicPlayList';
import PlayingController from '../components/PlayingController';

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
  { 
    title: 'Escapism',
    subtitle: 'Yung Logos',
    image: 'https://cdn.dribbble.com/users/3281732/screenshots/9165292/media/ccbfbce040e1941972dbc6a378c35e98.jpg?compress=1&resize=1200x1200',
    source: require('../assets/Music3.mp3')
  },
  { 
    title: 'Down With Your Getup',
    subtitle: 'Mini Vandals',
    image: 'https://cdn.dribbble.com/users/3281732/screenshots/11205211/media/44c854b0a6e381340fbefe276e03e8e4.jpg?compress=1&resize=1200x1200',
    source: require('../assets/Music4.mp3')
  },
  { 
    title: 'Statement',
    subtitle: 'NEFFEX',
    image: 'https://cdn.dribbble.com/users/3281732/screenshots/7003560/media/48d5ac3503d204751a2890ba82cc42ad.jpg?compress=1&resize=1200x1200',
    source: require('../assets/Music5.mp3')
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
  const [index, setIndex] = React.useState(0)

  const [repeat, setRepeat] = React.useState(false)
  const [shuffle, setShuffle] = React.useState(false)

  const { sound, position, playBackStatus, handlePlayOrStop, handlePositionMillis, loadAndPlay, loading } = React.useContext(PlayerContext)

  React.useEffect(() => {
    const source = data[index].source
    if (source) { loadAndPlay(source) }
  }, [index])

  React.useEffect(() => {
    if (playBackStatus.didJustFinish) {
      handleNextMusic()
    }
  }, [playBackStatus])

  async function handleNextMusic() {
    const random = Math.floor(Math.random() * ((data.length -1) - 0 + 1)) + 0;
    setIndex(index => index < data.length -1 ? shuffle ? random : index+1 : repeat ? 0 : index)
  }

  async function handlePreviousMusic() {
    setIndex(index => index > 0 ? index-1 : repeat ? data.length -1 : index)
  }

  const imageW = width * .7;
  const imageH = imageW * 1;

  const top = useHeaderHeight()
  
  return (
    <View style={styles.container}>
      <MusicPlayList index={index} onChangeIndex={index => setIndex(index)}
        data={data}
        renderItem={({ item, index: i }) => (
          <View style={{ width, flex: 1, paddingHorizontal: 20, paddingTop: top }}>
            <View style={{ marginBottom: 40 }}>
              <Text numberOfLines={1} style={styles.title}>{data[index].title}</Text>
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

              <PlayingController loading={loading}
                isRepeat={repeat} changeRepeat={repeat => setRepeat(repeat)}
                isShuffle={shuffle} changeShuffle={shuffle => setShuffle(shuffle)}
                isPlaying={playBackStatus.isPlaying}
                playingDisabled={index !== i}
                changePlaying={() => handlePlayOrStop(item.source)}
                durationMillis={index === i ? playBackStatus.durationMillis : 0}
                positionMillis={index === i ? position : 0}
                nextDisabled={index !== i ? true : repeat ? false : index === data.length-1}
                previousDisabled={index !== i ? true : repeat ? false : index === 0}
                onPrevious={() => handlePreviousMusic()}
                onNext={() => handleNextMusic()}
                onSlidingComplete={value => handlePositionMillis(value)}
              />

            </View>
          </View>
        )}
      />
    </View>
  );
}





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
