import * as ImagePicker from 'expo-image-picker';
import api from '../api';


const UploadLogPicture = async (logID) => {
    try {
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

        const asset = result.assets[0];
        const uri = asset.uri;
        const fileName = uri.split('/').pop();

        // Get the file extension
        const match = /\.(\w+)$/.exec(fileName ?? '');
        const fileType = match ? `image/${match[1]}` : `image`;

        const formData = new FormData();
        formData.append('logID', logID);
        formData.append('picture', {
            uri,
            name: fileName,
            type: fileType,
        });

        const response = await api.post('/api/log/picture/add/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('✅ Image uploaded:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Upload failed:', error.response?.data || error.message);
        return null;
    }
};

export default UploadLogPicture;