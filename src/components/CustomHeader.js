import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import colors from '../constants/constants';

const CustomHeader = ({ navigation, title }) => {
  const canGoBack = navigation.canGoBack();

  return (
    <View style={styles.headerContainer}>
      {canGoBack && (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <AntDesign name="caretleft" size={24} color={colors.white} />
        </TouchableOpacity>
      )}
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: colors.primaryDark,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    width: "100%",
    position: "absolute",
    top: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    left: 0,
    zIndex: 10,
  },
  backButton: {
    position: "absolute",
    left: 16
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white
  },
});

export default CustomHeader;
