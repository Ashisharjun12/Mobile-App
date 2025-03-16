import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({
  id: 'incampus-storage',
  encryptionKey: 'incampus-secret-key'
});

export const MMKVStorage = {
  setItem: (key: string, value: string) => {
    storage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: (key: string) => {
    const value = storage.getString(key);
    return Promise.resolve(value);
  },
  removeItem: (key: string) => {
    storage.delete(key);
    return Promise.resolve(true);
  },
};
