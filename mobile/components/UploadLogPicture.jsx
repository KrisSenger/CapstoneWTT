import * as ImagePicker from 'expo-image-picker';

const UploadLogPicture = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        alert('Permission to access photos is required.');
        return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
    });

    if (result.canceled || !result.assets || !result.assets[0]?.uri) return null;

    return result.assets[0]; // Return the selected image
};

export default UploadLogPicture;