import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Feather';
import Animated, {
  useAnimatedStyle,
  withTiming,
  runOnJS,
  useSharedValue,
} from 'react-native-reanimated';

const CustomHeader = ({title}: {title: string}) => {
  const navigation = useNavigation<any>();
  const opacity = useSharedValue(1);

  const handleGoBack = () => navigation.goBack();

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{scale: withTiming(opacity.value, {duration: 500})}],
  }));

  return (
    <Animated.View style={[styles.headerContainer, animatedStyle]}>
      <TouchableOpacity
        onPress={() => {
          opacity.value = withTiming(0, {duration: 200}, () => {
            opacity.value = 1;
            runOnJS(handleGoBack)();
          });
        }}
        style={styles.icon}
        hitSlop={30}>
        <Entypo name="arrow-left" color="black" size={30} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#4A90E2',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 5,
  },
  icon: {position: 'absolute', left: 10, padding: 10},
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
  },
});

export default CustomHeader;
