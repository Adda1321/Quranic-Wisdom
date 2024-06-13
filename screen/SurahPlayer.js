import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Sound from 'react-native-sound';

const SurahPlayer = ({ route, navigation }) => {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const soundRef = useRef(null);

  useEffect(() => {
    // Initialize the sound
    Sound.setCategory('Playback');
    soundRef.current = new Sound('https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3', null, (error) => {
      if (error) {
        console.log('Failed to load the sound', error);
        return;
      }
      setDuration(soundRef.current.getDuration());
    });

    // Cleanup
    return () => {
      soundRef.current.release();
    };
  }, []);

  useEffect(() => {
    let interval = null;
    if (playing) {
      interval = setInterval(() => {
        soundRef.current.getCurrentTime((time) => {
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
      soundRef.current.play((success) => {
        if (!success) {
          console.log('Playback failed due to audio decoding errors');
        }
      });
    }
    setPlaying(!playing);
  };

  const seekHandler = (time) => {
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
      <TouchableOpacity style={styles.button} onPress={backwardHandler}>
        <Text style={styles.buttonText}>Back 10 sec</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={playPauseHandler}>
        <Text style={styles.buttonText}>{playing ? 'Pause' : 'Play'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={forwardHandler}>
        <Text style={styles.buttonText}>Forward 10 sec</Text>
      </TouchableOpacity>
      <Text style={styles.timeText}>{`${Math.floor(currentTime)}s / ${Math.floor(duration)}s`}</Text>
    </View>
  );
};

export default SurahPlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    margin: 10,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
  },
  timeText: {
    marginTop: 10,
    fontSize: 16,
    color: 'white',
  },
});
