import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, BackHandler, PermissionsAndroid } from 'react-native';
import { Camera, useCodeScanner, useFrameProcessor, useCameraDevices, runAtTargetFps } from 'react-native-vision-camera';
import { crop } from 'vision-camera-cropper';

import { Worklets } from 'react-native-worklets-core';

import { useIsFocused } from '@react-navigation/native';
import { useAppState } from '@react-native-community/hooks';

import CustomHeader from '../components/CustomHeader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../constants/constants';


const ScanScreen = ({ navigation }) => {

  useEffect(() => {
    handlePermissionAndNavigation();

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
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission denied');
        navigation.navigate('Permission')
      } else {
        setCameraPermission(granted)
        console.log('You can use the camera');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  const [cameraPermission, setCameraPermission] = useState('denied');

  const isFocused = useIsFocused();
  const appState = useAppState();
  const isActive = isFocused && appState === "active";

  const devices = useCameraDevices();
  const device = devices.find(({ position }) => position === "back");

  const deviceWidth = Dimensions.get('screen').width;
  const deviceHeight = Dimensions.get('screen').height;

  if (!device) {
    return null;
  }

  const [isScanning, setIsScanning] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);

  const [roi, setRoi] = useState({
    left: 10,
    width: 80,
    top: 20,
    height: 30,
  });

  const setIsScanningJS = Worklets.createRunOnJS(setIsScanning);

  const setFlashEnabledJS = Worklets.createRunOnJS(setFlashEnabled);

  const navigateJS = Worklets.createRunOnJS(navigation.navigate);

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    // coordinates in percentage
    if (isScanning) {
      const pxLeft = ((frame.width - deviceWidth) / 2) + (deviceWidth * (roi.left * 0.01));
      const percLeft = (pxLeft / frame.width) * 100;

      const calcWidth = (deviceWidth / frame.width) * roi.width;

        runAtTargetFps(5, () => {
         const cropRegion = {
          left: percLeft,
          top: roi.top,
          width: calcWidth,
          height: roi.height
        };
        const result = crop(frame, { cropRegion: cropRegion, includeImageBase64: true, saveAsFile: false, barcodeFormat: 'ean-13' });
        if (result.length > 0) {
            console.log(result[0].rawValue);
            setIsScanningJS(false);
            setFlashEnabledJS(false);
            navigateJS('Detail', { codeInfo: result[0].rawValue });
        }
      });
    }
  }, [isScanning, deviceHeight, deviceWidth, roi]);

  // useEffect(() => {
  //   let timer;
  //   if (isScanning) {
  //     timer = setTimeout(() => {
  //       setIsScanning(false);
  //     }, 4000);
  //   }
  //   return () => clearTimeout(timer);
  // }, [isScanning]);

  // const codeScanner = useCodeScanner({
  //   codeTypes: ['ean-8', "qr", 'ean-13'],
  //   onCodeScanned: (codes) => {
  //     console.log(codes[0].value);
  //     if (isScanning) {
  //       setIsScanning(false);
  //       setFlashEnabled(false);
  //       navigation.navigate('Detail', { codeInfo: codes[0].value });
  //     }
  //   }
  // });

  const onScanPress = () => {
    setIsScanning(prevState => !prevState);
  };

  const onFlashPress = () => {
    setFlashEnabled(prevState => !prevState);
  };

  return (
    <View style={styles.container}>
      {cameraPermission === PermissionsAndroid.RESULTS.GRANTED ? <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isActive}
        // codeScanner={codeScanner}
        frameProcessor={frameProcessor}
        torch={flashEnabled ? 'on' : 'off'}
      /> : null}
      <View style={isScanning ? styles.darkenTopScanning: styles.darkenTop} />
      <View style={isScanning ? styles.darkenMiddleLeftScanning : styles.darkenMiddleLeft} />
      <View style={isScanning ? styles.darkenMiddleRightScanning : styles.darkenMiddleRight} />
      <View style={isScanning ? styles.darkenBottomScanning : styles.darkenBottom} />
      <View style={isScanning ? styles.highlightMiddleScanning : styles.highlightMiddle} />
      {isScanning && <Text style={styles.scanningText}>Scanning...</Text>}
      <TouchableOpacity style={isScanning ? styles.scanButtonScanning : styles.scanButton} onPress={onScanPress}>
        <View style={isScanning ? styles.scanButtonInnerScanning : styles.scanButtonInner}>
          <Text style={styles.buttonText}>{isScanning ? 'Stop' : 'Scan'}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.flashButton} onPress={onFlashPress}>
        <Ionicons
          name={flashEnabled ? 'flash-off' : 'flash'}
          size={30}
          color="white"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    height: Dimensions.get('screen').height,
    aspectRatio: 3/4,
  },
  scanButton: {
    position: "absolute",
    bottom: "15%",
    alignSelf: "center",
    width: 85,
    height: 85,
    borderRadius: 85,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: colors.white
  },
  scanButtonScanning: {
    position: "absolute",
    bottom: "15%",
    alignSelf: "center",
    width: 85,
    height: 85,
    borderRadius: 85,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: colors.white
  },
  scanButtonInner: {
    width: 65,
    height: 65,
    borderRadius: 65,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  scanButtonInnerScanning: {
    width: 65,
    height: 65,
    borderRadius: 65,
    backgroundColor: "#ff6666",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scanningText: {
    position: 'absolute',
    top: '12%',
    alignSelf: 'center',
    fontSize: 18,
    color: colors.white,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 10,
  },
  flashButton: {
    position: 'absolute',
    bottom: '7%',
    right: '5%',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 25,
    padding: 5,
  },
  highlightMiddle: {
    position: 'absolute',
    top: '20%',
    left: '10%',
    width: '80%',
    height: '30%',
    borderColor: colors.white,
    borderWidth: 2,
  },
  highlightMiddleScanning: {
    position: 'absolute',
    top: '20%',
    left: '10%',
    width: '80%',
    height: '30%',
    borderColor: colors.primary,
    borderWidth: 2,
  },
  darkenTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '20%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  darkenTopScanning: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '20%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  darkenMiddleLeft: {
    position: 'absolute',
    top: '20%',
    left: 0,
    width: '10%',
    height: '30%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  darkenMiddleLeftScanning: {
    position: 'absolute',
    top: '20%',
    left: 0,
    width: '10%',
    height: '30%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  darkenMiddleRight: {
    position: 'absolute',
    top: '20%',
    right: 0,
    width: '10%',
    height: '30%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  darkenMiddleRightScanning: {
    position: 'absolute',
    top: '20%',
    right: 0,
    width: '10%',
    height: '30%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  darkenBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  darkenBottomScanning: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
});

export default ScanScreen;
