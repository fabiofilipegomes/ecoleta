import React, { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
import { Feather as Icon } from '@expo/vector-icons';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SvgUri } from 'react-native-svg';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

import Api from '../../services/api';

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
  zity: string;
  zipcode: string;
  items: number[]
}

const CollectPoints = () => {
  const navigation = useNavigation();
  const [loadingInitialPosition, setLoadingInitialPosition] = useState(true);
  const [initialPosition, setInitialPosition] = useState({
    latitude: 41.1399589,
    longitude: -8.6116372,
  });
  const [items, setItems] = useState<Item[]>([]);
  const [collectPoints, setCollectPoints] = useState<CollectPoint[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  useEffect(() => {
    async function loadPosition() {
      const {status} = await Location.requestPermissionsAsync();

      if(status !== 'granted'){
        setLoadingInitialPosition(true);
        return;
      }

      const location = await Location.getCurrentPositionAsync();
      setInitialPosition({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
      setLoadingInitialPosition(true);
    }

    loadPosition();
  }, []);

  useEffect(() => {
    async function loadApiContent(){
      const itemsResponse: any = await Api.get('items');
      setItems(itemsResponse.data);
      setSelectedItems(itemsResponse.data.map((item:any) => item.itemId));
      Alert.alert(items[0].itemId.toString());
      Api.get('collectPoints', {
        params: {
          city: 'Porto',
          zipcode: '4430',
          items: [1,2]
        }
      }).then(response => {        
        setCollectPoints(response.data);
      });
    }

    loadApiContent();
  }, []);

  function navigateBack (){
    navigation.goBack();
  }

  function navigateToDetail(collectPoint: CollectPoint){
    navigation.navigate('Detail', { collectPoint: collectPoint });
  }

  function selectItem(itemId: number){
    var itemExists = selectedItems.some(selectedItem => selectedItem == itemId);
    if(itemExists){
        const filteredItems = selectedItems.filter(selectedItem => selectedItem != itemId);
        setSelectedItems(filteredItems);
    }else{
        setSelectedItems([...selectedItems, itemId]);
    }
}

  return (
    <>
      <View style={styles.container}>
        <View style={styles.containerHeader}>
          <TouchableOpacity onPress={navigateBack}>
            <Icon name="arrow-left" size={20} color="#34cd79" />
          </TouchableOpacity>

          <Text style={styles.title}>Bem vindo.</Text>
          <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>
        </View>

        <View style={styles.mapContainer}>
          {
            loadingInitialPosition == true && (
              <MapView 
                style={styles.map} 
                initialRegion={{
                  latitude: initialPosition.latitude,
                  longitude: initialPosition.longitude,
                  latitudeDelta: 0.014,
                  longitudeDelta: 0.014
                }}
              >
                {collectPoints.map(collectPoint => (
                  <Marker 
                    key={String(collectPoint.collectPointId)}
                    style={styles.mapMarker}
                    onPress={() => {navigateToDetail(collectPoint)}}
                    coordinate={{
                      latitude: collectPoint.latitude,
                      longitude: collectPoint.longitude
                    }}
                  >
                    <View style={styles.mapMarkerContainer}>
                      <Image style={styles.mapMarkerImage}
                        source={{uri:"https://images.unsplash.com/photo-1590698232141-f1ba62deb087?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max"}} />
                      <Text style={styles.mapMarkerTitle}>{collectPoint.name}</Text>
                    </View>
                  </Marker>
                ))}
              </MapView>
            )
          }
        </View>
      </View>
      <View style={styles.itemsContainer}>
        <ScrollView 
          horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 10
          }}
        >
          {items.map(item => (
            <TouchableOpacity 
              key={String(item.itemId)} 
              style={[
                styles.item,
                selectedItems.includes(item.itemId) ? styles.selectedItem : {}
              ]} 
              onPress={() =>{selectItem(item.itemId)}}
              activeOpacity={0.7}
            >
              <SvgUri width={42} height={42} uri={item.image_url} />
            <Text style={styles.itemTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 20 + Constants.statusBarHeight,
  },

  containerHeader: {
    paddingHorizontal: 10,
  },

  title: {
    fontSize: 20,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 4,
    fontFamily: 'Roboto_400Regular',
  },

  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  mapMarker: {
    width: 90,
    height: 80, 
  },

  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: '#34CB79',
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center'
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: 'cover',
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    color: '#FFF',
    fontSize: 13,
    lineHeight: 23,
  },

  itemsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 32,
  },

  item: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'space-between',

    textAlign: 'center',
  },

  selectedItem: {
    borderColor: '#34CB79',
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    fontSize: 13,
  },
});

export default CollectPoints;