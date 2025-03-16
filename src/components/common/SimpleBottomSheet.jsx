import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  Modal,
  Pressable,
  StatusBar
} from 'react-native';

const { width, height } = Dimensions.get('window');

const SimpleBottomSheet = ({ visible, onClose, title, children, currentTheme }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <StatusBar backgroundColor="rgba(0,0,0,0.5)" barStyle="light-content" />
      <View style={styles.modalContainer}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View 
          style={[
            styles.bottomSheet, 
            { backgroundColor: currentTheme.dark ? '#121212' : '#FFFFFF' }
          ]}
        >
          <View style={[styles.handle, { backgroundColor: currentTheme.dark ? '#444' : '#DDD' }]} />
          <Text style={[styles.bottomSheetTitle, { color: currentTheme.colors.text }]}>
            {title}
          </Text>
          {children}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  bottomSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: height * 0.02,
    paddingBottom: height * 0.05,
    maxHeight: height * 0.7,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  handle: {
    width: width * 0.15,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: height * 0.02,
    opacity: 0.5,
  },
  bottomSheetTitle: {
    fontSize: width * 0.045,
    fontFamily: 'Nunito-Bold',
    textAlign: 'center',
    marginBottom: height * 0.02,
  },
});

export default SimpleBottomSheet; 