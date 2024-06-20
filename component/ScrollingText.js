import React, {useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Animated, Dimensions} from 'react-native';

const {width} = Dimensions.get('window');

export const ScrollingText = ({text}) => {
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateScroll = () => {
      Animated.loop(
        Animated.timing(scrollX, {
          toValue: -width,
          duration: 10000, // adjust this value for speed
          useNativeDriver: true,
        }),
      ).start();
    };

    animateScroll();
  }, [scrollX]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.textContainer,
          {
            transform: [{translateX: scrollX}],
          },
        ]}>
        <Text style={styles.scrollingText}>{text}</Text>
        <Text style={styles.scrollingText}>{text}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  textContainer: {
    flexDirection: 'row',
  },
  scrollingText: {
    color: 'black',
    fontSize: 15,
    whiteSpace: 'nowrap',
    marginRight: 30, // Adjust padding to avoid sudden cutoff
  },
});
