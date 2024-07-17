import { StyleSheet, Text, View, Button, Linking, StatusBar, Dimensions, BackHandler } from 'react-native';
import React, { useState, useEffect } from 'react';
import Clipboard from '@react-native-clipboard/clipboard';

import CustomHeader from '../components/CustomHeader';
import CustomContainer from '../components/CustomContainer';
import colors from '../constants/constants';

const navBarHeight = Dimensions.get('screen').height - Dimensions.get('window').height - StatusBar.currentHeight;

const DetailScreen = ({ navigation, route }) => {
  const { codeInfo } = route.params;

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

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
      <View style={styles.barcodeTextContainer}>
        <Text style={styles.barcodeText}>{codeInfo}</Text>
      </View>
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
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: navBarHeight,
    backgroundColor: colors.white,
  },
  barcodeTextContainer: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.gray
  },
  barcodeText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: "8%",
    color: colors.black,
    marginBottom: 15,
  },
  buttonContainer: {
    marginBottom: 15,
    width: "100%"
  },
});

export default DetailScreen;
