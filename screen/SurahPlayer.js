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
import {ScrollingText} from '../component/ScrollingText';

const SurahPlayer = ({route, navigation}) => {
  const {items, name, personName} = route.params; // Assuming 'items' is the array of ayah mp3 links
  const [isLoading, setIsLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [ayahNumber, setAyahNumber] = useState(null)
  const soundRef = useRef(null);


  useEffect(() => {
    loadAyah(currentAyahIndex);

    // Cleanup
    return () => {
      soundRef.current?.release();
    };
  }, [currentAyahIndex]);

  useEffect(() => {
    let interval = null;
    if (playing) {
      interval = setInterval(() => {
        soundRef.current.getCurrentTime(time => {
          setCurrentTime(time);
          if (time >= duration - 1) { // Slight buffer to ensure smooth transition
            nextAyah();
          }
        });
      }, 1000);
    } else if (!playing && currentTime !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [playing, currentTime]);

  const loadAyah = index => {
    setIsLoading(true);
    setAyahNumber(items[index].number)
    Sound.setCategory('Playback');
    soundRef.current = new Sound(
      items[index].audioSecondary[0] || items[index].audio,
      null,
      error => {
        if (error) {
          console.log('Failed to load the sound', error);
          return;
        }
        setIsLoading(false);
        setDuration(soundRef.current.getDuration());
        playSound(); // Autoplay the loaded ayah
      },
    );
  };

  const playSound = () => {
    soundRef.current.play(success => {
      if (!success) {
        console.log('Playback failed due to audio decoding errors');
      }
    });
    setPlaying(true);
  };

  const playPauseHandler = () => {
    if (playing) {
      soundRef.current.pause();
    } else {
      playSound();
    }
    setPlaying(!playing);
  };

  const seekHandler = time => {
    soundRef.current.setCurrentTime(time);
    setCurrentTime(time);
  };

  const nextAyah = () => {
    if (currentAyahIndex < items.length - 1) {
      setCurrentAyahIndex(currentAyahIndex + 1);
      setCurrentTime(0);
      setPlaying(false);
    }
  };

  const prevAyah = () => {
    if (currentAyahIndex > 0) {
      setCurrentAyahIndex(currentAyahIndex - 1);
      setCurrentTime(0);
      setPlaying(false);
    }
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
              source={require('../assest/quran(1).png')}
              style={styles.image}
            />
          </View>
          <View style={{
            paddingHorizontal: 30,
             flex: 1,
             justifyContent: 'center',
             alignItems: 'center',
             backgroundColor: 'white',
          }}>
            <ScrollingText
              text={` ${ayahNumber} :AyatNumber || ${name} :AyatName || ${personName} :ReciterName`}
            />
            <Text style={{color: 'black', fontSize: 20}}>{items[currentAyahIndex].text}</Text>
          </View>
          <View style={styles.controlsContainer}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={prevAyah}
              disabled={currentAyahIndex === 0}>
              <Icon
                name="step-backward"
                type="material"
                size={30}
                color="black"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={backwardHandler}
              disabled={currentTime === 0}>
              <Icon
                name="rotate-left"
                type="material"
                size={30}
                color="black"
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={playPauseHandler}>
              <Icon
                name={playing ? 'pause' : 'play'}
                type="material"
                size={30}
                color="black"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={forwardHandler}
              disabled={currentTime >= duration}>
              <Icon
                name="rotate-right"
                type="material"
                size={30}
                color="black"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={nextAyah}
              disabled={currentAyahIndex === items.length - 1}>
              <Icon
                name="step-forward"
                type="material"
                size={30}
                color="black"
              />
            </TouchableOpacity>
          </View>
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
  iconButton: {
    margin: 10,
    padding: 10,
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
