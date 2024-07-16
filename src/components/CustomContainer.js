import { StyleSheet, View } from 'react-native';
import React from 'react';
import CustomHeader from './CustomHeader';

const CustomContainer = ({ 
  navigation, 
  headerTitle, 
  children, 
  containerStyle = {}, 
  contentStyle = {} 
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <CustomHeader navigation={navigation} title={headerTitle} />
      <View style={[styles.contentContainer, contentStyle]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
});

export default CustomContainer;
