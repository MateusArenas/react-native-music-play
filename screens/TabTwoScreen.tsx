import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useHeaderHeight } from '@react-navigation/elements'
import React from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import ChatBot from '../components/Chatbot';

export default function TabTwoScreen() {
  const top = useHeaderHeight();
  const bottom = useBottomTabBarHeight();


  return (
    <View style={[styles.container, { }]}>

      {/* <FlatList style={{ flex: 1 }}
        data={[]}
        renderItem={() => (
          <View>
            <Text>oi</Text>
          </View>
        )}
        ListFooterComponent={
          <View style={{ flexDirection: 'row' }}>
            <TextInput placeholder='Escreva aqui...' /> 
            <Button title="Enviar" /> 
          </View>
        }
      /> */}

        <ChatBot style={{  backgroundColor: 'black' }} contentStyle={{ paddingTop: top+10, paddingBottom: top, flexGrow: 1 }}  />
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
