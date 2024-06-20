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
import styles from '../style/styles';
const Surah = ({route, navigation}) => {
  const {ayatNumber, name, id, check , personName} = route.params;
  const [ayah, setAyah] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    getEdition();
  }, []);
  const getEdition = async () => {
    setLoading(true);
    const ayahs = await fetch(`http://api.alquran.cloud/v1/surah/${ayatNumber}/${id}`)
      .then(response => response.json())
      .then(data => data.data.ayahs);
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
                  onPress={() => {
                    
                    navigation.navigate('SurahPlayer', {
                      audio: item.audio,
                      item: item,
                      name: name,
                      personName,
                      ayatNumber
                    });
                  }}
                  >
                    <Image source={require('../assest/audio2.png')} />
                  </TouchableOpacity>
                ) : null}
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};
export default Surah;
