import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  Image 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const FoodCard = ({ item, onPress }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (onPress) {
      onPress(item);
    } else {
      navigation.navigate('foodDetails', { 
        foodItem: item 
      });
    }
  };

  // Check if the image is a URL or emoji
  const isImageUrl = (image) => {
    return typeof image === 'string' && 
           (image.startsWith('http') || image.startsWith('https'));
  };

  const isEmoji = (image) => {
    return typeof image === 'string' && image.length <= 3;
  };

  return (
    <TouchableOpacity style={styles.foodCard} onPress={handlePress}>
      <View style={styles.cardImage}>
        {isImageUrl(item.image) ? (
          <Image
            source={{ uri: item.image }}
            style={styles.foodImage}
            resizeMode="cover"
            onError={(error) => {
              console.log('Image load error:', error.nativeEvent.error);
              // Fallback to emoji if image fails to load
              return (
                <View style={styles.imageFallback}>
                  <Text style={styles.foodEmoji}>🍽️</Text>
                </View>
              );
            }}
          />
        ) : isEmoji(item.image) ? (
          <Text style={styles.foodEmoji}>{item.image}</Text>
        ) : (
          <View style={styles.imageFallback}>
            <Text style={styles.foodEmoji}>🍽️</Text>
          </View>
        )}
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.foodTitle} numberOfLines={1}>
          {item.title || item.name}
        </Text>
        <View style={styles.cardDetails}>
          <Text style={styles.foodPrice}>${item.price}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingStar}>⭐</Text>
            <Text style={styles.foodRating}>{item.rating}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.viewBtn}
          onPress={handlePress}
        >
          <Text style={styles.viewBtnText}>View</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  foodCard: {
    width: (width - (width * 0.1 + width * 0.04)) / 2,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginBottom: height * 0.02,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    overflow: 'hidden',
  },
  cardImage: {
    backgroundColor: '#f8f8f8',
    height: height * 0.12,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    overflow: 'hidden',
  },
  foodImage: {
    width: '100%',
    height: '100%',
  },
  foodEmoji: {
    fontSize: width * 0.08,
  },
  imageFallback: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  cardContent: {
    padding: width * 0.04,
  },
  foodTitle: {
    fontSize: width * 0.038,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: height * 0.01,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.012,
  },
  foodPrice: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#4caf50',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: width * 0.02,
    paddingVertical: height * 0.005,
    borderRadius: 10,
  },
  ratingStar: {
    fontSize: width * 0.025,
    marginRight: width * 0.01,
  },
  foodRating: {
    fontSize: width * 0.03,
    fontWeight: 'bold',
    color: '#666',
  },
  viewBtn: {
    backgroundColor: '#4caf50',
    paddingVertical: height * 0.012,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: height * 0.005,
  },
  viewBtnText: {
    color: 'white',
    fontWeight: '600',
    fontSize: width * 0.035,
  },
});

export default FoodCard;