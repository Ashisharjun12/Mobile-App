import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Dimensions, FlatList } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// Simplified avatar styles with direct PNG URLs
const AVATARS = [
  {
    style: 'adventurer',
    url: 'https://api.dicebear.com/7.x/adventurer/png?seed=felix'
  },
  {
    style: 'avataaars',
    url: 'https://api.dicebear.com/7.x/avataaars/png?seed=john'
  },
  {
    style: 'bottts',
    url: 'https://api.dicebear.com/7.x/bottts/png?seed=robot'
  },
  {
    style: 'fun-emoji',
    url: 'https://api.dicebear.com/7.x/fun-emoji/png?seed=happy'
  },
  {
    style: 'pixel-art',
    url: 'https://api.dicebear.com/7.x/pixel-art/png?seed=pixel'
  },
  {
    style: 'lorelei',
    url: 'https://api.dicebear.com/7.x/lorelei/png?seed=anime'
  },
  {
    style: 'micah',
    url: 'https://api.dicebear.com/7.x/micah/png?seed=micah'
  },
  {
    style: 'big-smile',
    url: 'https://api.dicebear.com/7.x/big-smile/png?seed=smile'
  },
  {
    style: 'personas',
    url: 'https://api.dicebear.com/7.x/personas/png?seed=person'
  },
  {
    style: 'miniavs',
    url: 'https://api.dicebear.com/7.x/miniavs/png?seed=mini'
  },
  {
    style: 'open-peeps',
    url: 'https://api.dicebear.com/7.x/open-peeps/png?seed=peeps'
  },
  {
    style: 'notionists',
    url: 'https://api.dicebear.com/7.x/notionists/png?seed=notion'
  },
  {
    style: 'initials',
    url: 'https://api.dicebear.com/7.x/initials/png?seed=IC'
  },
  {
    style: 'thumbs',
    url: 'https://api.dicebear.com/7.x/thumbs/png?seed=thumb'
  },
  {
    style: 'croodles',
    url: 'https://api.dicebear.com/7.x/croodles/png?seed=doodle'
  },
  {
    style: 'avataaars-neutral',
    url: 'https://api.dicebear.com/7.x/avataaars-neutral/png?seed=neutral'
  },
  {
    style: 'big-ears',
    url: 'https://api.dicebear.com/7.x/big-ears/png?seed=ears'
  },
  {
    style: 'big-ears-neutral',
    url: 'https://api.dicebear.com/7.x/big-ears-neutral/png?seed=neutral'
  },
  {
    style: 'identicon',
    url: 'https://api.dicebear.com/7.x/identicon/png?seed=identity'
  },
  {
    style: 'shapes',
    url: 'https://api.dicebear.com/7.x/shapes/png?seed=shape'
  }
];

const AvatarSelector = ({ selectedStyle, onSelect }) => {
  const renderAvatar = ({ item }) => (
    <TouchableOpacity
      onPress={() => onSelect(item.style)}
      style={[
        styles.avatarButton,
        selectedStyle === item.style && styles.selectedAvatar
      ]}
    >
      <Image
        source={{ 
          uri: item.url,
          headers: {
            Accept: 'image/png'
          }
        }}
        style={styles.avatar}
      />
    </TouchableOpacity>
  );

  return (
    <Animated.View 
      entering={FadeInDown.springify()}
      style={styles.container}
    >
      <FlatList
        data={AVATARS}
        renderItem={renderAvatar}
        keyExtractor={(item) => item.style}
        numColumns={3}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.gridContainer}
        style={styles.flatList}
        ListFooterComponent={<View style={styles.footer} />}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.9,
    height: height * 0.45,
  },
  flatList: {
    flex: 1,
  },
  gridContainer: {
    paddingVertical: 2,
    alignItems: 'center',
  },
  avatarButton: {
    width: width * 0.22,
    height: width * 0.22,
    margin: 8,
    borderRadius: width * 0.11,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedAvatar: {
    borderWidth: 2,
    borderColor: '#2563EB',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  footer: {
    height: height * 0.15,
  }
});

export default AvatarSelector; 