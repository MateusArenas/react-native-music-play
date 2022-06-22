import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';

export default function TabTwoScreen() {
  const [one, setOne] = React.useState<number>()
  const [two, setTwo] = React.useState<number>()
  const [middle, setMiddle] = React.useState<string>()

  function onClear () {
    setMiddle(undefined)
    setOne(undefined)
    setTwo(undefined)
  }

  function onResult () {
    if (one && middle && two) {
      const result = eval(`${one} ${middle} ${two}`)
      setOne(result)
      setMiddle(undefined)
      setTwo(undefined)
    } else {
      if (two) {
        setOne(two)
        setTwo(undefined)
      } else {
        setOne(one)
        setTwo(undefined)
      }
      setMiddle(undefined)
    }
  }

  function onChangeButtonValue(value: number) {
    if (!middle || !one) {
      setMiddle(undefined)
      setOne(old => old ? Number(`${old}${value}`) : value)
    } else {
      setTwo(old => old ? Number(`${old}${value}`) : value)
    }
  }

  function onChangeOperationValue(value: string) {
    console.log({ value });
    setMiddle(value)
  }

  const buttons = [
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
    { label: '5', value: 5 },
    { label: '6', value: 6 },
    { label: '7', value: 7 },
    { label: '8', value: 8 },
    { label: '9', value: 9 },
  ]

  const operations = [
    { label: '+', value: '+' },
    { label: '-', value: '-' },
    { label: '/', value: '/' },
  ]


  return (
    <View style={[styles.container]}>

      <View style={{ flex: 1, width: '100%'}}>

        <View style={{ minWidth: '100%', minHeight: 40, backgroundColor: 'yellow', borderRadius: 10, display: 'flex', justifyContent: 'center' }}>
          <Text style={{ fontWeight: 'bold', fontSize: 18, textAlign: 'right', padding: 20 }}>
            {two ? two : middle ? middle : one ? one : 0}
          </Text>
        </View>

        <View style={{flex: 1, width: '100%', marginVertical: 5 }}>
          <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>

            <TouchableOpacity style={{ flex: 1, margin: 5 }} onPress={() => onClear()}>
                <View style={{ padding: 20, borderRadius: 100, backgroundColor: 'orange', alignItems: 'center' }}>
                  <Text>{'AC'}</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={{ flex: 1, margin: 5 }} onPress={() => onResult()}>
                <View style={{ padding: 20, borderRadius: 100, backgroundColor: 'orange', alignItems: 'center' }}>
                  <Text>{'='}</Text>
                </View>
            </TouchableOpacity>

          </View>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View>
              {
                buttons.map(button => (
                  <TouchableOpacity onPress={() => onChangeButtonValue(button.value)}>
                    <View style={{ padding: 20, borderRadius: 100, backgroundColor: 'gray' }}>
                      <Text>{button.label}</Text>
                    </View>
                  </TouchableOpacity>
                ))
              }
            </View>
            <View>
              {
                operations.map(operation => (
                  <TouchableOpacity onPress={() => onChangeOperationValue(operation.value)}>
                    <View style={{ padding: 20, borderRadius: 100, backgroundColor: middle === operation.value ? 'white' : 'gray' }}>
                      <Text>{operation.label}</Text>
                    </View>
                  </TouchableOpacity>
                ))
              }
            </View>
          </View>
        </View>
      </View>
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
