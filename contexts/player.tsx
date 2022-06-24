import React from "react";

import { Audio, AVPlaybackSource, AVPlaybackStatus, AVPlaybackStatusSuccess, InterruptionModeAndroid, InterruptionModeIOS  } from 'expo-av';
import { useDebounce, useDebounceEffect, useDebounceHandler } from "../hooks/useDebounce";

interface PlayerContextData {
    playBackStatus: AVPlaybackStatusSuccess
    sound?: Audio.Sound
    position: number
    handlePlayOrStop: (source?: AVPlaybackSource) => Promise<any>
    handlePositionMillis: (value: number) => Promise<any>
    loading: boolean
    loadAndPlay: (source: AVPlaybackSource) => Promise<any>
}

const PlayerContext = React.createContext<PlayerContextData>({} as PlayerContextData)

export const PlayerProvider: React.FC = ({ children }) => {
    const [loading, setLoading] = React.useState(false)

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

      const [playBackStatus, setPlayBackStatus] = React.useState<AVPlaybackStatusSuccess>({} as AVPlaybackStatusSuccess)
      const [sound, setSound] = React.useState<Audio.Sound>();

      const [position, setPosition] = React.useState(playBackStatus.positionMillis)

      async function loadAndPlay (source: AVPlaybackSource) {
        try {
          setLoading(true)
          await sound?.unloadAsync(); 
          const status = await sound?.loadAsync(source, { shouldPlay: true })
          if (status?.isLoaded) {
            setPlayBackStatus(status)
          }
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false)
        }
      }
      
      const onPlaybackStatusUpdate = React.useCallback(async (status: AVPlaybackStatus) => {
        if (status.isLoaded) {
            if (!loading) {
                setPlayBackStatus({ ...status, isPlaying: true })
                useDebounceHandler(setPosition, 50)(status.positionMillis)
            }
            if (status.didJustFinish) {
                setPosition(0)
            }
        } else {
          setPlayBackStatus(status => ({ ...status, isPlaying: false }))
        }
      }, [loading])
    
      async function handlePlayOrStop(source?: AVPlaybackSource) {
        if (!sound) {
            if (source) { await changeSound(source) }
        } else {
          playBackStatus.isPlaying ? await stopSound() : await playSound()
        }
      }
    
      async function playSound() {
        try {
          setLoading(true)
          const status = await sound?.playAsync(); 
          if (status?.isLoaded) {
            setPlayBackStatus({ ...status, isPlaying: true })
          }
        } catch(err) {
          console.log(err);
        } finally {
          setLoading(false)
        }
      }
    
      async function changeSound(source: AVPlaybackSource) {
        try {
            setLoading(true)
            const { sound, status } = await Audio.Sound.createAsync(source, { 
                positionMillis: playBackStatus.positionMillis,
                volume: playBackStatus.volume,
                progressUpdateIntervalMillis: 50, 
                shouldPlay: true
              },
              onPlaybackStatusUpdate, true
            );
    
            if (status.isLoaded) { setPlayBackStatus({ ...status, isPlaying: true }) }
    
            setSound(sound);
        } catch(err) {
          console.log(err);
        } finally {
          setLoading(false)
        }
      }
    
      async function stopSound() {
        try {
          setLoading(true)
          setPosition(playBackStatus.positionMillis)
          await sound?.stopAsync(); 
          const status = await sound?.setPositionAsync(playBackStatus.positionMillis); 
          if (status?.isLoaded) {
            setPlayBackStatus({ ...status, isPlaying: false })
          }
        } catch(err) {
          console.log(err);
        } finally {
          setLoading(false)
        }
      }
    
      async function handlePositionMillis(value: number) {
        setLoading(true)
        try {
            setPosition(value)
            const status = await sound?.setPositionAsync(value)
            if (status?.isLoaded) {
                setPlayBackStatus(status)
            }
        } catch (err) {
            console.log(err);
        } finally {
             setLoading(false)
        }
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



    return (
        <PlayerContext.Provider value={{
            playBackStatus,
            sound,
            position,
            handlePlayOrStop,
            handlePositionMillis,
            loadAndPlay, loading
        }} >
            {children}
        </PlayerContext.Provider>
    )
}

export default PlayerContext
