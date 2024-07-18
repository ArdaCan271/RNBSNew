import { StyleSheet, Text, View, Modal, Pressable, FlatList, Dimensions, BackHandler, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setRegion } from '../store/slices/regionOfInterestSlice';
import formatRegions from '../constants/formatRegions';
import colors from '../constants/constants';

const FormatPickerModal = ({ onOutsidePress, modalVisible }) => {
  const dispatch = useDispatch();
  const selectedRegion = useSelector((state) => state.regionOfInterest);

  useEffect(() => {
    const backAction = () => {
      onOutsidePress();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  const height = Dimensions.get('screen').height;
  const width = Dimensions.get('screen').width;

  const renderItem = ({ item }) => {
    const isSelected = item.format === selectedRegion.format;

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => {
          dispatch(setRegion(item));
          onOutsidePress();
        }}
      >
        <Text style={styles.itemText}>{item.format}</Text>
        <View style={[styles.circle, isSelected && styles.filledCircle]} />
      </TouchableOpacity>
    );
  };

  return (
    <Pressable style={styles.modalOutside} onPress={onOutsidePress}>
      <Pressable style={styles.modal}>
        <FlatList
          data={formatRegions}
          renderItem={renderItem}
          keyExtractor={(item) => item.format}
        />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  modalOutside: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: Dimensions.get('screen').height,
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  modal: {
    width: '73%',
    height: '60%',
    backgroundColor: colors.white,
    borderRadius: 10,
    elevation: 2,
    borderWidth: 5,
    borderColor: colors.primary
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  itemText: {
    fontSize: 18,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  filledCircle: {
    backgroundColor: colors.primary,
  },
});

export default FormatPickerModal;
