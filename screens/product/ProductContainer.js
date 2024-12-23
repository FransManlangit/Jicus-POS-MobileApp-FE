import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  ActivityIndicator,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Text, Center, FlatList } from "native-base";
import { StatusBar } from "expo-status-bar";
import baseURL from "../../assets/common/baseUrl";
import axios from "axios";
import ProductList from "./ProductList";
import { MagnifyingGlassIcon, XMarkIcon } from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { EnvelopeIcon, BellAlertIcon } from "react-native-heroicons/solid";
import ProductCard from "./ProductCard";

const ProductContainer = () => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]); // State for cart items
  const [loading, setLoading] = useState(true);
  const [focus, setFocus] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [productsFiltered, setProductsFiltered] = useState([]);

  const searchProduct = (text) => {
    setSearchText(text);
    setProductsFiltered(
      products.filter((i) =>
        i.projectTitle.toLowerCase().includes(text.toLowerCase())
      )
    );
  };

  const addToCart = (item) => {
    setCartItems([...cartItems, item]); // Add selected product to cart
  };

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price, 0); // Calculate total
  };

  useFocusEffect(
    useCallback(() => {
      axios
        .get(`${baseURL}products`)
        .then((res) => {
          setProducts(res.data);
          setProductsFiltered(res.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("API products call error:", error);
        });

      return () => {
        setProducts([]);
        setProductsFiltered([]);
      };
    }, [])
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className="flex-1 flex-row">
      {/* Product Grid */}
      <SafeAreaView className="flex-1">
        <FlatList
          data={productsFiltered}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => addToCart(item)}
              className="flex-1"
            >
              <View className="p-2">
                <ProductCard {...item} />
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          contentContainerStyle={{ padding: 10 }}
          columnWrapperStyle={{ justifyContent: "space-between" }}
        />
      </SafeAreaView>

      {/* Cart Section */}
      <View className="w-1/3 bg-gray-50 shadow-lg p-4">
        <Text className="text-2xl text-center font-bold mb-4">Cart</Text>
        <FlatList
          data={cartItems}
          renderItem={({ item }) => (
            <View className="flex-row justify-between mb-2">
              <Text>{item.name}</Text>
              <Text>₱{item.price}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        <View className="mt-4">
          <Text className="text-lg font-semibold">
            Total: ₱{calculateTotal().toFixed(2)}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProductContainer;
