import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Camera, useCameraDevice, useCodeScanner, useFrameProcessor, useCameraDevices, useCameraFormat, useSkiaFrameProcessor, runAsync, runAtTargetFps } from 'react-native-vision-camera';
import { useResizePlugin } from 'vision-camera-resize-plugin';
import { crop } from 'vision-camera-cropper';
import { useBarcodeScanner } from "react-native-vision-camera-barcodes-scanner";

import { Worklets } from 'react-native-worklets-core';

import { Skia } from '@shopify/react-native-skia';

import { useIsFocused } from '@react-navigation/native';
import { useAppState } from '@react-native-community/hooks';

import CustomHeader from '../components/CustomHeader';
import Ionicons from 'react-native-vector-icons/Ionicons';


const ScanScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  const appState = useAppState();
  const isActive = isFocused && appState === "active";

  const devices = useCameraDevices();
  const device = devices.find(({ position }) => position === "back");

  if (!device) {
    return null;
  }

  const [isScanning, setIsScanning] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [data, setData] = useState('');

  const options = ["qr"]
  const {scanBarcodes} = useBarcodeScanner(options)

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    // coordinates in percentage
    if (isScanning) {
      runAtTargetFps(1, () => { const cropRegion = {
        left: 25,
        top: 30,
        width: 50,
        height: 15
      }
      const result = crop(frame, { cropRegion: cropRegion, includeImageBase64: true, saveAsFile: false });
      const smallFrameBase64 = result.base64;
      const data = scanBarcodes(frame, {smallFrame: smallFrameBase64});
      console.log(data, 'data')
     });
    }

  }, [isScanning]);

  // useEffect(() => {
  //   let timer;
  //   if (isScanning) {
  //     timer = setTimeout(() => {
  //       setIsScanning(false);
  //     }, 2500);
  //   }
  //   return () => clearTimeout(timer);
  // }, [isScanning]);

  const codeScanner = useCodeScanner({
    codeTypes: ['ean-8', "qr", 'ean-13'],
    onCodeScanned: (codes) => {
      console.log(codes[0].value);
      if (isScanning) {
        setIsScanning(false);
        setFlashEnabled(false);
        navigation.navigate('Detail', { codeInfo: codes[0].value });
      }
    }
  });


  const onScanPress = () => {
    setIsScanning(prevState => !prevState);
  };

  const onFlashPress = () => {
    setFlashEnabled(prevState => !prevState);
  };

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isActive}
        // codeScanner={codeScanner}
        frameProcessor={frameProcessor}
        torch={flashEnabled ? 'on' : 'off'}
      />
      <CustomHeader navigation={navigation} title={'Scan A Barcode'} />
      {isScanning && <Text style={styles.scanningText}>Scanning...</Text>}
      <TouchableOpacity style={isScanning ? styles.scanButtonScanning : styles.scanButton} onPress={onScanPress}>
        <View style={isScanning ? styles.scanButtonInnerScanning : styles.scanButtonInner}>
          <Text style={isScanning ? styles.buttonTextScanning : styles.buttonText}>{isScanning ? 'Stop' : 'Scan'}</Text>
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
    borderColor: "#DDFFE7"
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
    borderColor: "#d79898"
  },
  scanButtonInner: {
    width: 65,
    height: 65,
    borderRadius: 65,
    backgroundColor: "#98D7C2",
    justifyContent: "center",
    alignItems: "center",
  },
  scanButtonInnerScanning: {
    width: 65,
    height: 65,
    borderRadius: 65,
    backgroundColor: "#d68181",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonTextScanning: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scanningText: {
    position: 'absolute',
    top: '16%',
    alignSelf: 'center',
    fontSize: 18,
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 10,
  },
  flashButton: {
    position: 'absolute',
    bottom: '5%',
    right: '5%',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
    padding: 5,
  },
});

export default ScanScreen;
