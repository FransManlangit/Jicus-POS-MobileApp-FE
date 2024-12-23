import React from "react";
import { View, Text, Image } from "react-native";

const ProductCard = (props) => {
  const { name, price, images } = props;

  const formattedPrice = `₱${Number(price).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  return (
    <View className="bg-white shadow-md rounded-lg p-4 items-center justify-center">
      <Image
        className="w-40 h-40 rounded-lg"
        resizeMode="cover"
        source={
          images[0]?.url
            ? { uri: images[0].url }
            : require("../../assets/images/jicus.jpg")
        }
      />
      <Text className="mt-2 text-lg font-semibold text-gray-800 text-center">
        {name}
      </Text>
      <Text className="text-base font-bold text-blue-600 text-center">
        {formattedPrice}
      </Text>
    </View>
  );
};

export default ProductCard;
