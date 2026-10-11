
import React, {useState} from 'react';

import {
  View,
  Text,
  TextInput,
  Button,
  ToastAndroid,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';

import {launchImageLibrary} from 'react-native-image-picker';
import Api from '../../services/api';
import styles from '../../styles';
import {handleErrors} from '../../utils/handleErrors';

export default function PostCreate({navigation}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState([]);

  // Memilih gambar dari galeri
  const handleChoosePhoto = async () => {
    try {
      const response = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
      });

      if (response.didCancel) {
        return;
      }

      if (response.errorCode) {
        Alert.alert(
          'Gagal Memilih Gambar',
          response.errorMessage || response.errorCode,
        );
        return;
      }

      const selectedImage = response.assets?.[0];

      if (!selectedImage?.uri) {
        Alert.alert('Gagal', 'Gambar belum berhasil dipilih.');
        return;
      }

      setImage(selectedImage);
      setErrors([]);
    } catch (error) {
      Alert.alert(
        'Kesalahan',
        error.message || 'Galeri tidak dapat dibuka.',
      );
    }
  };

  // Menyimpan postingan
  const storePost = async () => {
    const formData = new FormData();

    formData.append('title', title);
    formData.append('content', content);

    if (image?.uri) {
      formData.append('image', {
        uri: image.uri,
        type: image.type || 'image/jpeg',
        name: image.fileName || `image-${Date.now()}.jpg`,
      });
    }

    try {
      await Api.post('/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      ToastAndroid.show(
        'Post Created Successfully!',
        ToastAndroid.LONG,
      );

      navigation.push('PostIndex');
    } catch (error) {
      if (error.response?.data) {
        handleErrors(error.response.data, setErrors);
      } else {
        Alert.alert(
          'Gagal Menyimpan',
          error.message || 'Tidak dapat terhubung ke server.',
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <View style={styles.upload}>
          <Button
            title="Choose Image"
            color="gray"
            onPress={handleChoosePhoto}
          />
        </View>

        {image?.uri && (
          <View style={{padding: 10, alignItems: 'center'}}>
            <Image
              source={{uri: image.uri}}
              style={{
                width: 200,
                height: 200,
                borderRadius: 8,
              }}
              resizeMode="contain"
            />
            <Text style={{marginTop: 8}}>
              {image.fileName || 'Gambar berhasil dipilih'}
            </Text>
          </View>
        )}

        {errors?.image && (
          <Text style={styles.error}>{errors.image}</Text>
        )}

        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />

        {errors?.title && (
          <Text style={styles.error}>{errors.title}</Text>
        )}

        <TextInput
          style={styles.textarea}
          placeholder="Content"
          value={content}
          onChangeText={setContent}
          multiline
        />

        {errors?.content && (
          <Text style={styles.error}>{errors.content}</Text>
        )}

        <View style={{padding: 10}}>
          <TouchableOpacity
            style={styles.button}
            onPress={storePost}>
            <Text style={styles.buttonText}>SAVE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
