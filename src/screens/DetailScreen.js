import { StyleSheet, Text, View, Button, Linking } from 'react-native';
import React, { useState, useEffect } from 'react';
import Clipboard from '@react-native-clipboard/clipboard';

import CustomHeader from '../components/CustomHeader';
import CustomContainer from '../components/CustomContainer';

const DetailScreen = ({ navigation, route }) => {
  const { codeInfo } = route.params;

  // const handlePress = () => {
  //   if (codeInfo.startsWith('http://') || codeInfo.startsWith('https://')) {
  //     Linking.openURL(codeInfo);
  //   } else {
  //     Clipboard.setString(codeInfo);
  //     alert('Copied to clipboard!');
  //   }
  // };

  //I want the button to display "Go to Link" if the codeInfo starts with "http://" or "https://", and "Copy Info" otherwise.
  const [buttonText, setButtonText] = useState('Copy Info');
  useEffect(() => {
    if (codeInfo.startsWith('http://') || codeInfo.startsWith('https://')) {
      setButtonText('Go to Link');
    } else {
      setButtonText('Copy Info');
    }
  }, [codeInfo]);

  const handlePress = () => {
    if (codeInfo.startsWith('http://') || codeInfo.startsWith('https://')) {
      Linking.openURL(codeInfo);
    } else {
      Clipboard.setString(codeInfo);
      alert('Copied to clipboard!');
    }
  };

  return (
    <CustomContainer 
      navigation={navigation} 
      headerTitle={'Details'}
      contentStyle={styles.container}
    >
      <Text style={styles.barcodeText}>{codeInfo}</Text>
      <View style={styles.buttonContainer}>
        <Button title={buttonText} onPress={handlePress}/>
      </View>
    </CustomContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  barcodeText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  buttonContainer: {
    marginVertical: 20,
  },
});

export default DetailScreen;
