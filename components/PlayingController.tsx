import { MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { fomatedTime } from '../helpers';


interface PlayerControllerProps {
    loading: boolean
    isPlaying: boolean
    durationMillis?: number | undefined
    positionMillis?: number | undefined
    onSlidingComplete?: (positionMillis: number) => any
    previousDisabled?: boolean
    onPrevious?: () => any
    nextDisabled?: boolean
    onNext?: () => any
    playingDisabled?: boolean
    changePlaying?: (isPlaying: boolean) => any
}

const PlayingController: React.FC<PlayerControllerProps> = ({ 
    isPlaying, positionMillis, durationMillis,
    onSlidingComplete, onPrevious, onNext, 
    previousDisabled, nextDisabled,
    playingDisabled, changePlaying,
    loading,
}) => {
  return (
    <View style={{ alignItems: 'center', marginTop: 40, width: '100%',  }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 10 }}>
        <Text style={styles.info}>{fomatedTime(positionMillis)}</Text>
        <Text style={styles.info}>{fomatedTime(durationMillis)}</Text>
        </View>
        <Slider 
            style={{width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={durationMillis}
            value={positionMillis}
            onSlidingComplete={(value) => onSlidingComplete?.(value)}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#000000"
         />

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '75%', marginTop: 20 }}>
        <TouchableOpacity disabled={previousDisabled || loading} onPress={() => onPrevious?.()}>
            <MaterialIcons style={[(previousDisabled || loading) && { opacity: .2 }]} size={24*2} color={'white'}
            name={'skip-previous'}
            />
        </TouchableOpacity>
        <TouchableOpacity disabled={playingDisabled || loading} onPress={() => changePlaying?.(!isPlaying)}>
            <MaterialIcons style={[(playingDisabled || loading) && { opacity: .1 }]}  size={24*2.5} color={'white'}
            name={isPlaying ? 'pause-circle-filled' : 'play-circle-fill'}
            />
        </TouchableOpacity>
        <TouchableOpacity disabled={nextDisabled || loading} onPress={() => onNext?.()}>
            <MaterialIcons style={[(nextDisabled || loading) && { opacity: .1 }]} size={24*2} color={'white'}
            name={'skip-next'}
            />
        </TouchableOpacity>
        </View>
    </View>
  )
}

export default PlayingController;

const styles = StyleSheet.create({
    info: {
      fontSize: 12,
      fontWeight: '500',
      color: 'white'
    },
  });
  