import { StyleSheet, Text, View, PermissionsAndroid, TouchableOpacity, Button, BackHandler } from 'react-native';
import React, { useEffect } from 'react';

const PermissionScreen = ({ navigation }) => {

  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

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
    <View style={styles.container}>
        <Button
          onPress={handlePermissionAndNavigation}
          title='Request Permission'
          color={"#404040"}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#292929"
  }
});

export default PermissionScreen;