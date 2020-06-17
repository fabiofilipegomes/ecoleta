import React, { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather as Icon, FontAwesome } from '@expo/vector-icons';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import  * as MailComposer from 'expo-mail-composer';

interface Item {
  itemId: number;
  title: string;
  image_url: string;
}

interface CollectPoint {
  collectPointId: number;
  image: string;
  name: string;
  email: string;
  whatsapp: string;
  latitude: number;
  longitude: number;
  city: string;
  zipcode: string;
  image_url: string;
  items: number[]
}

interface Data {
  collectPoint: CollectPoint;
  collectPointItems: Item[];
}

const Detail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  console.log(route.params);
  const { collectPoint, collectPointItems } = route.params as Data;

  function navigateBack (){
    navigation.goBack();
  }

  function whatsapp(){
    Linking.openURL(`whatsapp://send?phone=${collectPoint.whatsapp}&text=Tenho interesse na coleta de resíduos.`);
  }

  function composeMail(){
    Linking.openURL(`mailto:${collectPoint.email}?subject=Tenho interesse na coleta de resíduos.`);
    /*MailComposer.composeAsync({
      subject: 'Interesse na coleta de resíduos',
      recipients: [collectPoint.email],
    });*/
  }

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={navigateBack}>
          <Icon name="arrow-left" size={20} color="#34cd79" />
        </TouchableOpacity>

        <Image style={styles.pointImage} source={{uri:collectPoint.image_url}} />
        <Text style={styles.pointName}>{collectPoint.name}</Text>
        <Text style={styles.pointItems}>{collectPointItems.map(item => item.title).join(', ')}</Text>

        <View style={styles.address}> 
          <Text style={styles.addressTitle}>Morada</Text>
          <Text style={styles.addressContent}>{collectPoint.city}, {collectPoint.zipcode} </Text>
        </View>

        <View style={styles.footer}>
          <RectButton style={styles.button} onPress={whatsapp}>
            <FontAwesome name="whatsapp" color="#fff" size={20} />
            <Text style={styles.buttonText}>Whatsapp</Text>
          </RectButton>
          <RectButton style={styles.button} onPress={composeMail}>
            <Icon name="mail" color="#fff" size={20} />
            <Text style={styles.buttonText}>E-mail</Text>
          </RectButton>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 20 + Constants.statusBarHeight,
  },

  pointImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 32,
  },

  pointName: {
    color: '#322153',
    fontSize: 28,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  pointItems: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  address: {
    marginTop: 32,
  },
  
  addressTitle: {
    color: '#322153',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },

  addressContent: {
    fontFamily: 'Roboto_400Regular',
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  footer: {
    marginVertical: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    paddingVertical: 20,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  
  button: {
    width: '48%',
    backgroundColor: '#34CB79',
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    marginLeft: 8,
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
  },
});

export default Detail;