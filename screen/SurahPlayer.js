import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
} from 'react-native';
import Sound from 'react-native-sound';
import Icon from 'react-native-vector-icons/FontAwesome';
import Slider from '@react-native-community/slider';

const SurahPlayer = ({route, navigation}) => {
  const {item, audio, name , personName , ayatNumber} = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [zeroDuration, setZeroDuration] = useState(false);
  const soundRef = useRef(null);
  useEffect(() => {
    // Initialize the sound
    Sound.setCategory('Playback');
    soundRef.current = new Sound(
      item.audioSecondary[0] || audio,
      // audio,
      // "https://cdn.islamic.network/quran/audio/64/ar.abdulbasitmurattal/11.mp3",
      // 'https://cdn.islamic.network/quran/audio/64/ur.khan/21.mp3',
      // 'https://cdn.islamic.network/quran/audio/64/ar.minshawimujawwad/4063.mp3',
      null,
      error => {
        if (error) {
          console.log('Failed to load the sound', error);
          return;
        }
        setIsLoading(false);
        setDuration(soundRef.current.getDuration());
        if (!soundRef.current.getDuration()) setZeroDuration(true);
      },
    );

    // Cleanup
    return () => {
      soundRef.current.release();
    };
  }, []);

  useEffect(() => {
    let interval = null;
    if (playing) {
      interval = setInterval(() => {
        soundRef.current.getCurrentTime(time => {
          setCurrentTime(time);
        });
      }, 1000);
    } else if (!playing && currentTime !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [playing, currentTime]);

  const playPauseHandler = () => {
    if (playing) {
      soundRef.current.pause();
    } else {
      soundRef.current.play(success => {
        if (!success) {
          console.log('Playback failed due to audio decoding errors');
        }
      });
    }
    setPlaying(!playing);
  };

  const seekHandler = time => {
    soundRef.current.setCurrentTime(time);
    setCurrentTime(time);
  };

  const forwardHandler = () => {
    let newTime = currentTime + 10;
    if (newTime > duration) newTime = duration;
    seekHandler(newTime);
  };

  const backwardHandler = () => {
    let newTime = currentTime - 10;
    if (newTime < 0) newTime = 0;
    seekHandler(newTime);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Surah Player</Text>
        <View style={{width: 50}} />
      </View>

      {isLoading ? (
        <ActivityIndicator style={styles.activityIndicator} size="large" />
      ) : (
        <>
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: 'https://t3.ftcdn.net/jpg/02/69/64/56/360_F_269645677_oAjFKkNrezyIeJ6TmawcwEmERIXlQgi5.jpg',
              }}
              style={styles.image}
            />
          </View>
          <View style={{paddingHorizontal: 30}}>

            <Text style={{color: 'black', fontSize: 20}}>{item.text}, {name}, {personName}, {ayatNumber}</Text>
          </View>
          <View style={styles.controlsContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={backwardHandler}
              disabled={zeroDuration}>
              <Icon
                name="rotate-left"
                type="material"
                size={30}
                color="white"
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={playPauseHandler}>
              <Icon
                name={playing ? 'pause' : 'play'}
                type="material"
                size={30}
                color="white"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={forwardHandler}
              disabled={zeroDuration}>
              <Icon
                name="rotate-right"
                type="material"
                size={30}
                color="white"
              />
            </TouchableOpacity>
          </View>
          {!zeroDuration && (
            <>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={duration}
                value={currentTime}
                onSlidingComplete={seekHandler}
                minimumTrackTintColor="#007BFF"
                maximumTrackTintColor="#000000"
                thumbTintColor="#007BFF"
              />

              <Text style={styles.timeText}>{`${Math.floor(
                currentTime,
              )}s / ${Math.floor(duration)}s`}</Text>
            </>
          )}
        </>
      )}
    </View>
  );
};

export default SurahPlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
  },
  activityIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -25}, {translateY: -25}],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    elevation: 2,
  },
  headerText: {
    color: '#007BFF',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
  button: {
    margin: 10,
    padding: 15,
    backgroundColor: '#007BFF',
    borderRadius: 50,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slider: {
    width: '80%',
    height: 40,
    marginVertical: 20,
  },
  timeText: {
    fontSize: 16,
    color: '#333333',
  },
});
