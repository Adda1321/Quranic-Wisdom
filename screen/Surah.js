import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import Header from '../component/Header';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from '../style/styles';
const Surah = ({route, navigation}) => {
  const {ayatNumber, name, id, check, personName} = route.params;
 
  const [ayah, setAyah] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const listenWholeSurah =  () => {
    
    navigation.navigate('SurahPlayer', {
      fullSurahAudioLink: `https://cdn.islamic.network/quran/audio-surah/128/${id}/${ayatNumber}.mp3`,
      name: name,
      personName,
      isPlayingWholeSurah:true
    })
  };
  React.useEffect(() => {
    getEdition();
  }, []);
  const getEdition = async () => {
    setLoading(true);
    const ayahs = await fetch(
      `http://api.alquran.cloud/v1/surah/${ayatNumber}/${id}`,
    )
      .then(response => response.json())
      .then(data => data.data.ayahs);
    // console.log('ayahs=========>', ayahs);
    setAyah(ayahs);
    setLoading(false);
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Header title={name} />
        {loading ? (
          <ActivityIndicator
            //visibility of Overlay Loading Spinner
            visible={loading}
            //Text with the Spinner
            textContent={'Loading...'}
            //Text style of the Spinner Text
            textStyle={styles.spinnerTextStyle}
            style={{alignSelf: 'center', marginTop: 290}}
            size="large"
          />
        ) : (
          <>
            {check == 'audio' && (
              <TouchableOpacity
                style={{
                  height: 60,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={listenWholeSurah}>
                <Text style={{color: 'black', fontWeight: '', fontSize: 25}}>
                  Listen All
                </Text>
              </TouchableOpacity>
            )}
            <FlatList
              data={ayah}
              keyExtractor={(item, index) => {
                return item.number;
              }}
              ListFooterComponentStyle={{backgroundColor: 'white'}}
              renderItem={({item, index}) => (
                <View key={item.number} style={styles.container1}>
                  <Text style={styles.englishName}>{item.text}</Text>
                  {check == 'audio' ? (
                    <TouchableOpacity
                      style={{height: 30}}
                      onPress={() => {
                        navigation.navigate('SurahPlayer', {
                          items: [item],
                          name: name,
                          personName,
                        });
                      }}>
                      <Icon
                        name="volume-up"
                        type="material"
                        size={20}
                        color="black"
                      />
                    </TouchableOpacity>
                  ) : null}
                </View>
              )}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
};
export default Surah;
