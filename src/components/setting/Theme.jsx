import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { List, Text, RadioButton } from 'react-native-paper';
import { useTheme } from '../../utils/context/ThemeContext';
import Navigate from '../common/Navigate';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

const { width, height } = Dimensions.get('window');

const Theme = () => {
  const { themeMode, setThemeMode, currentTheme, isDarkTheme } = useTheme();

  const handleThemeChange = (newMode) => {
    setThemeMode(newMode);
  };

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      <Navigate />
      
      <Text style={[styles.subtitle, { color: currentTheme.colors.text }]}>
        Customize your app appearance
      </Text>

      <List.Section style={styles.section}>
        <RadioButton.Group onValueChange={handleThemeChange} value={themeMode}>
          <List.Item
            title="Light Mode"
            description="Clean, light appearance"
            left={() => (
              <View style={[styles.iconContainer, { backgroundColor: isDarkTheme ? '#1E293B' : '#F1F5F9' }]}>
                <Image 
                  source={require('../../../assets/images/light.png')} 
                  style={styles.themeIcon}
                  resizeMode="contain"
                />
              </View>
            )}
            right={() => (
              <RadioButton
                value="light"
                status={themeMode === 'light' ? 'checked' : 'unchecked'}
                color="#2563EB"
              />
            )}
            titleStyle={[styles.listTitle, { color: currentTheme.colors.text }]}
            descriptionStyle={[styles.listDescription, { color: currentTheme.colors.text }]}
            style={styles.listItem}
          />

          <List.Item
            title="Dark Mode"
            description="Easier on the eyes"
            left={() => (
              <View style={[styles.iconContainer, { backgroundColor: isDarkTheme ? '#1E293B' : '#F1F5F9' }]}>
                <Image 
                  source={require('../../../assets/images/dark.png')} 
                  style={styles.themeIcon}
                  resizeMode="contain"
                />
              </View>
            )}
            right={() => (
              <RadioButton
                value="dark"
                status={themeMode === 'dark' ? 'checked' : 'unchecked'}
                color="#2563EB"
              />
            )}
            titleStyle={[styles.listTitle, { color: currentTheme.colors.text }]}
            descriptionStyle={[styles.listDescription, { color: currentTheme.colors.text }]}
            style={styles.listItem}
          />

          <List.Item
            title="System Default"
            description="Matches your system settings"
            left={() => (
              <View style={[styles.iconContainer, { backgroundColor: isDarkTheme ? '#1E293B' : '#F1F5F9' }]}>
                <Image 
                  source={isDarkTheme ? require('../../../assets/images/default.png') : require('../../../assets/images/light.png')} 
                  style={styles.themeIcon}
                  resizeMode="contain"
                />
              </View>
            )}
            right={() => (
              <RadioButton
                value="system"
                status={themeMode === 'system' ? 'checked' : 'unchecked'}
                color="#2563EB"
              />
            )}
            titleStyle={[styles.listTitle, { color: currentTheme.colors.text }]}
            descriptionStyle={[styles.listDescription, { color: currentTheme.colors.text }]}
            style={styles.listItem}
          />
        </RadioButton.Group>
      </List.Section>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
  },
  subtitle: {
    fontSize: width * 0.04,
    fontFamily: 'Nunito-Regular',
    opacity: 0.7,
    paddingHorizontal: width * 0.05,
    marginTop: height * 0.01,
    marginBottom: height * 0.02,
  },
  section: {
    backgroundColor: 'transparent',
    paddingHorizontal: width * 0.03,
    marginTop: height * 0.01,
  },
  listItem: {
    paddingVertical: responsiveHeight(1.5),
    marginVertical: responsiveHeight(0.5),
    borderRadius: 12,
  },
  listTitle: {
    fontSize: responsiveFontSize(2),
    fontFamily: 'Nunito-Bold',
  },
  listDescription: {
    fontSize: responsiveFontSize(1.6),
    fontFamily: 'Nunito-Regular',
    opacity: 0.7,
  },
  iconContainer: {
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    borderRadius: responsiveWidth(6),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: responsiveWidth(2),
  },
  themeIcon: {
    width: responsiveWidth(7),
    height: responsiveWidth(7),
  },
});

export default Theme;