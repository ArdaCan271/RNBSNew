import { Pressable, StyleSheet, Text, View, PermissionsAndroid } from 'react-native';
import React from 'react';
import CustomContainer from '../components/CustomContainer';

import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../constants/constants';

const HomeScreen = ({ navigation }) => {

  const handlePermissionAndNavigation = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message:
            'Barcode Scanner needs access to your camera',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
        navigation.navigate('Scan')
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  return (
    <CustomContainer navigation={navigation} headerTitle={'Home'} contentStyle={styles.contentContainer}>
      <View style={styles.goToScanButtonWrapper}>
        <Pressable
          style={styles.goToScanButton}
          android_ripple={{ color: colors.primaryDark, radius: 85 }}
          onPress={handlePermissionAndNavigation}
        >
          <Ionicons name="barcode-outline" size={24} color="#fff" />
          <Text style={styles.buttonText}>Scan A Barcode</Text>
        </Pressable>
      </View>
    </CustomContainer>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    justifyContent: "flex-start",
    rowGap: 15,
    alignItems: "center",
  },
  goToScanButtonWrapper: {
    borderRadius: 10,
    overflow: "hidden",
    width: "50%",
    height: 50,
    position: "absolute",
    bottom: "35%",
    alignSelf: "center",
  },
  goToScanButton: {
    width: "100%",
    height: 50,
    backgroundColor: colors.primary,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderRadius: 10,
    overflow: "hidden",
  },
  buttonText: {
    fontSize: 20,
    color: colors.white,
  }
});

export default HomeScreen;