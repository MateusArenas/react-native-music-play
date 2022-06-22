import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';

import Slider from '@react-native-community/slider';

import { Audio, AVPlaybackSource, AVPlaybackStatus, AVPlaybackStatusSuccess, InterruptionModeAndroid, InterruptionModeIOS  } from 'expo-av';

import { RootTabScreenProps } from '../types';
import { MaterialIcons } from '@expo/vector-icons';
import { useDebounce } from '../hooks/useDebounce';

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [playBackStatus, setPlayBackStatus] = React.useState<AVPlaybackStatusSuccess>({} as AVPlaybackStatusSuccess)
  const [sound, setSound] = React.useState<Audio.Sound>();

  const position = useDebounce(playBackStatus.positionMillis, 50)

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
    } else {
      setPlayBackStatus(status => ({ ...status, isPlaying: false }))
    }
  }).current

  function handlePlayOrStop() {
    if (!sound) {
      changeSound(require('../assets/Music.mp3'))
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
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync(); 
          setSound(undefined)
      }
      : undefined;
  }, [sound]);

  function fomatedTime(millis: number) {
    if (!millis) return '0:00'
    const minutes = Math.floor(millis / 60000);
    const seconds = Number(((millis % 60000) / 1000).toFixed(0));
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }
  
  return (
    <View style={styles.container}>
      <Text>{`Volume: ${Math.floor(playBackStatus.volume*100)}`}</Text>
      <Slider
        style={{width: 200, height: 40}}
        minimumValue={0}
        maximumValue={1}
        value={playBackStatus.volume}
        onValueChange={value => handleVolume(value)}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: 200 }}>
        <Text>{fomatedTime(playBackStatus.positionMillis)}</Text>
        <Text>{fomatedTime(playBackStatus.playableDurationMillis || 0)}</Text>
      </View>
      <Slider
        style={{width: 200, height: 40}}
        minimumValue={0}
        maximumValue={playBackStatus.playableDurationMillis}
        value={position}
        onSlidingComplete={(value) => handlePositionMillis(value)}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
      />
      <Text>
        {playBackStatus.isPlaying ? "Stop Music" : "Play Music"}
      </Text>

      <TouchableOpacity onPress={handlePlayOrStop}>
        <MaterialIcons size={24*2.5} color={'blue'}
          name={playBackStatus.isPlaying ? 'pause-circle-filled' : 'play-circle-fill'}
        />
      </TouchableOpacity>
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
