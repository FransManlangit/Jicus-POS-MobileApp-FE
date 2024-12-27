import React, { useState, useCallback, useContext } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  View,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Text, Button, Select, FlatList } from "native-base";
import baseURL from "../../assets/common/baseUrl";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import ProductCard from "./ProductCard";
import { XMarkIcon, PlusIcon, MinusIcon, CheckIcon } from "react-native-heroicons/solid";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthGlobal from "../../context/store/AuthGlobal";

const PaymentModal = ({
  isVisible,
  onClose,
  onConfirm,
  isLoading,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
}) => {
  return (
    <Modal
      transparent
      animationType="slide"
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center ">
        <View className="bg-white p-6 rounded-lg ">
          <Text className="text-lg font-bold mb-4">Select Payment Method</Text>

          {/* Dropdown for Payment Method */}
          <Select
            selectedValue={selectedPaymentMethod}
            minWidth="200"
            accessibilityLabel="Choose Payment Method"
            placeholder="Choose Payment Method"
            onValueChange={(value) => setSelectedPaymentMethod(value)}
            _selectedItem={{
              bg: "gray.200",
              endIcon: <CheckIcon size="5" />,
            }}
            mt={1}
          >
            <Select.Item label="Cash" value="Cash" />
            <Select.Item label="G-cash" value="G-cash" />
          </Select>

          <View className="flex-row justify-end mt-4">
            <Button onPress={onClose} variant="ghost">
              Cancel
            </Button>
            <Button onPress={onConfirm} isLoading={isLoading}>
              Confirm
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const ProductContainer = () => {
  const [token, setToken] = useState("");
  const context = useContext(AuthGlobal);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const TAX_RATE = 0.12;
  const navigation = useNavigation();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  const calculateSubtotal = () =>
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const calculateTax = () => calculateSubtotal() * TAX_RATE;

  const calculateTotal = () => calculateSubtotal() + calculateTax();

  const searchProduct = (text) => {
    setProductsFiltered(
      products.filter((i) =>
        i.projectTitle.toLowerCase().includes(text.toLowerCase())
      )
    );
  };


  const handleAddToCart = () => {
    const existingProductIndex = cartItems.findIndex(
      (item) => item.id === selectedProduct.id
    );

    if (existingProductIndex > -1) {
      const updatedCart = [...cartItems];
      updatedCart[existingProductIndex].quantity += quantity;
      setCartItems(updatedCart);
      console.log(`Updated Cart:`, updatedCart[existingProductIndex]);
    } else {
      const newCartItem = { ...selectedProduct, quantity };
      setCartItems([...cartItems, newCartItem]);
      console.log(`Added new product to cart:`, newCartItem);
    }

    setShowModal(false);
    setQuantity(1);
    setSelectedProduct(null);
  };

  const removeFromCart = (index) => {
    const updatedCart = [...cartItems];
    updatedCart.splice(index, 1);
    setCartItems(updatedCart);
  };

  
  const handleCheckout = async () => {
    console.log("User Context: ", context.stateUser)
    if (!selectedPaymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    if (!context.stateUser.isAuthenticated) {
      alert("User not authenticated. Please log in.");
      return;
    }

    try {
      setIsLoading(true);

      const order = {
        user: context.stateUser.user.userId,
        orderItems: cartItems.map((item) => ({
          product: item.id,
          quantity: item.quantity,
        })),
        paymentMethod: selectedPaymentMethod,
        eWallet: selectedPaymentMethod === "G-cash" ? "G-cash" : null,
      };

      const token = await AsyncStorage.getItem("jwt");
      if (!token) {
        alert("Authentication error. Please log in again.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(`${baseURL}orders/newOrder`, order, config);

      if (response.status === 200 || response.status === 201) {
        alert("Order Placed Successfully!");
        setCartItems([]);
      }
    } catch (error) {
      console.error("Order Placement Error:", error);
      alert(
        "Order Placement Error: " +
          (error?.response?.data?.message || "Something went wrong.")
      );
    } finally {
      setIsLoading(false);
      setShowPaymentModal(false);
    }
  };


  const decrementQuantity = (index) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map((item, i) =>
        i === index
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  };

  const incrementQuantity = (index) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map((item, i) =>
        i === index ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const updateQuantity = (index, value) => {
    const numericValue = Number(value);
    if (!isNaN(numericValue) && numericValue > 0) {
      setCartItems((prevCartItems) =>
        prevCartItems.map((item, i) =>
          i === index ? { ...item, quantity: numericValue } : item
        )
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      axios
        .get(`${baseURL}products`)
        .then((res) => {
          setProducts(res.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("API products call error:", error);
        });

      return () => {
        setProducts([]);
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
      {/* Header with Menu Button */}
      <View className="absolute top-5 left-5 z-10">
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Ionicons name="menu" size={30} color="#000" />
        </TouchableOpacity>
      </View>
      {/* Product Grid */}
      <SafeAreaView className="flex-1">
        <FlatList
          data={products}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedProduct(item);
                setShowModal(true); // Show modal before adding to cart
              }}
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

      {/* Modal for Quantity */}
      {showModal && (
        <Modal
          transparent
          animationType="fade"
          visible={showModal}
          onRequestClose={() => setShowModal(false)}
        >
          <View className="flex-1 justify-center items-center">
            <View className="bg-white p-4 rounded-md h-52 w-52 shadow-md">
              <Text className="text-lg font-bold mb-2">Add to Cart</Text>
              <Text className="text-sm text-gray-600 mb-4">
                {selectedProduct.name} - ₱{selectedProduct.price}
              </Text>
              <TextInput
                placeholder="Enter quantity"
                keyboardType="numeric"
                value={quantity.toString()}
                onChangeText={(text) => setQuantity(Number(text))}
                className="border p-2 rounded mb-4"
              />
              <View className="flex-row justify-end space-x-2">
                <Button
                  onPress={() => setShowModal(false)}
                  variant="ghost"
                  colorScheme="coolGray"
                >
                  Cancel
                </Button>
                <Button onPress={handleAddToCart} colorScheme="red">
                  Add
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Cart Section */}
      <View className="w-5/12 bg-gray-50 shadow-lg rounded-lg p-6">
        <Text className="text-3xl text-center font-bold mb-6">Cart</Text>

        {/* Table Headers */}
        <View className="flex-row justify-between border-b pb-2 mb-4">
          <Text className="text-lg font-semibold flex-1 text-left">
            Item Name
          </Text>
          <Text className="text-lg font-semibold flex-1 text-center">
            Price
          </Text>
          <Text className="text-lg font-semibold flex-1 text-center">
            Quantity
          </Text>
        </View>

        {/* Cart Items */}
        <FlatList
          data={cartItems}
          renderItem={({ item, index }) => (
            <View className="flex-row justify-between items-center border-b py-3">
              {/* Item Name */}
              <Text className="flex-1 text-left text-base font-medium">
                {item.name}
              </Text>

              {/* Price */}
              <Text className="flex-1 text-center text-base font-medium">
                ₱{(item.price * item.quantity).toFixed(2)}
              </Text>

              {/* Quantity Controls */}
              <View className="flex-1 flex-row items-center justify-center gap-2">
                <TouchableOpacity
                  onPress={() => decrementQuantity(index)}
                  className="p-2 bg-gray-200 rounded-full"
                >
                  <MinusIcon size={15} color="black" />
                </TouchableOpacity>

                <TextInput
                  value={item.quantity.toString()}
                  onChangeText={(value) => updateQuantity(index, value)}
                  keyboardType="number-pad"
                  className="text-center w-12 text-base font-medium"
                />

                <TouchableOpacity
                  onPress={() => incrementQuantity(index)}
                  className="p-2 bg-gray-200 rounded-full"
                >
                  <PlusIcon size={15} color="black" />
                </TouchableOpacity>
              </View>

              {/* Remove Item */}
              <TouchableOpacity
                onPress={() => removeFromCart(index)}
                className="p-2"
              >
                <XMarkIcon size={25} color="red" />
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />

        {/* Summary Section */}
        <View className="mt-6">
          <View className="flex-row justify-between mb-2">
            <Text className="text-lg font-semibold">Subtotal:</Text>
            <Text className="text-lg font-medium">
              ₱{calculateSubtotal().toFixed(2)}
            </Text>
          </View>

          <View className="flex-row justify-between mb-2">
            <Text className="text-lg font-semibold">Tax:</Text>
            <Text className="text-lg font-medium">
              ₱{calculateTax().toFixed(2)}
            </Text>
          </View>

          <View className="flex-row justify-between mb-4">
            <Text className="text-lg font-semibold">Total:</Text>
            <Text className="text-xl font-bold text-red-600">
              ₱{calculateTotal().toFixed(2)}
            </Text>
          </View>
          <TouchableOpacity
           onPress={() => setShowPaymentModal(true)}
            className="bg-red-600 py-3 rounded-lg"
          >
            <Text className="text-white text-center text-lg font-bold">
              TENDER
            </Text>
          </TouchableOpacity>

          {/* Payment Modal */}
          <PaymentModal
            isVisible={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            onConfirm={handleCheckout}
            isLoading={isLoading}
            selectedPaymentMethod={selectedPaymentMethod}
            setSelectedPaymentMethod={setSelectedPaymentMethod}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProductContainer;
