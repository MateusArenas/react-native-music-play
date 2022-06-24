import { MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TouchableOpacityProps, GestureResponderEvent, ColorValue } from 'react-native';
import { fomatedTime } from '../helpers';

import * as Animatable from 'react-native-animatable';


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
    isRepeat: boolean
    isShuffle: boolean
    changeShuffle: (isShuffle: boolean) => any
    changeRepeat: (isRepeat: boolean) => any
}

const PlayingController: React.FC<PlayerControllerProps> = ({ 
    isPlaying, positionMillis, durationMillis,
    onSlidingComplete, onPrevious, onNext, 
    previousDisabled, nextDisabled,
    playingDisabled, changePlaying,
    loading, isRepeat, isShuffle,
    changeRepeat, changeShuffle
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

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
          <ButtonController color={isShuffle ? '#ef5466' : 'white'} onPress={() => changeShuffle?.(!isShuffle)} 
              name={'shuffle'}
          />
          <ButtonController disabled={previousDisabled} onPress={() => onPrevious?.()} 
              name={'skip-previous'}
          />
          <ButtonController size={24*2.5} type={'playing'} disabled={playingDisabled} onPress={() => changePlaying?.(!isPlaying)}
              name={isPlaying ? 'pause-circle-filled' : 'play-circle-fill'}
          />
          <ButtonController disabled={nextDisabled} onPress={() => onNext?.()} 
              name={'skip-next'}
          />
          <ButtonController color={isRepeat ? '#ef5466' : 'white'} onPress={() => changeRepeat?.(!isRepeat)} 
              name={'repeat'}
          />
        </View>
    </View>
  )
}

interface ButtonControllerProps extends TouchableOpacityProps {
  type?: 'playing' | 'default'
  name: React.ComponentProps<typeof MaterialIcons>['name'];
  size?: number
  color?: ColorValue
}

const ButtonController: React.FC<ButtonControllerProps> = ({ name, size=28, type='default', color="white", ...props }) => {
  const playingButtonRef = React.useRef<Animatable.View>(null)


  async function onPress (event: GestureResponderEvent) {
    playingButtonRef.current?.pulse?.(400)
    props?.onPress?.(event)
  }

  return (
    <Animatable.View ref={playingButtonRef} >
        <TouchableOpacity {...props} style={{ padding: 10 }} onPress={onPress} >
            <View style={[
              { alignItems: 'center', justifyContent: 'center' },
              { shadowColor: '#000', shadowOpacity: .5, shadowOffset: { width: 0, height: 0 }, shadowRadius: 20 }  
            ]}>
              {type === 'playing' && <View style={[
                { position: 'absolute', width: size+4, height: size+4 },
                { borderWidth: 7.5, borderColor: color, borderRadius: 100, padding: 0,  },
                (props.disabled) && { opacity: .1 },
              ]}/>}
              <MaterialIcons style={[
                (props.disabled) && { opacity: .1 }, 
              ]}  size={size} color={color}
                name={name}
              />
            </View>
        </TouchableOpacity>
    </Animatable.View>
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
  