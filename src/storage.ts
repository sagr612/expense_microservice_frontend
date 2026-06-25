import AsyncStorage from "@react-native-async-storage/async-storage";

export const storage={
    async get(key: string, value: string) {
        await AsyncStorage.getItem(key);
    },

    async set(key: string, value: string) {
        await AsyncStorage.setItem(key, value);
    },

    async remove(key: string) {
        await AsyncStorage.removeItem(key);
    },

    async clear() {
        await AsyncStorage.clear();
    },
}