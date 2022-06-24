import React from "react"
import { FlatListProps, FlatList, Animated, NativeSyntheticEvent, NativeScrollEvent, StyleSheet, View, Text, Dimensions } from "react-native"

const { width } = Dimensions.get('screen')

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
          { backgroundColor: 'black' }
        ]}>
          {props.data?.map?.(({ image }, index) => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width
            ]
            const opacity = scrollX.interpolate({
              inputRange, outputRange: [0, .5, 0],
  
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

  export default MusicPlayList