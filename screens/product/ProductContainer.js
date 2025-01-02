import React, { useState, useCallback, useContext, useRef } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  View,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  TextInput,
  Pressable,
  Animated,
  Image,
  FlatList,
  Alert,
} from "react-native";
import { Text, Button, Select } from "native-base";
import baseURL from "../../assets/common/baseUrl";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import ProductCard from "./ProductCard";
import {
  XMarkIcon,
  PlusIcon,
  MinusIcon,
  CheckIcon,
} from "react-native-heroicons/solid";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthGlobal from "../../context/store/AuthGlobal";
import Payment from "../payment/payment"; 
import qrCodeImage from "../../assets/images/qr.png"; 

const ProductContainer = () => {
  const context = useContext(AuthGlobal);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const navigation = useNavigation();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [cashAmount, setCashAmount] = useState("");
  const [transactionComplete, setTransactionComplete] = useState(false);
  const modalOpacity = useRef(new Animated.Value(0)).current;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Retail");

  const calculateItemsPrice = () =>
    cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const calculateTaxPrice = (itemsPrice) => Number((0.05 * itemsPrice).toFixed(2));
  const calculateTotalPrice = (itemsPrice, taxPrice) => Number((itemsPrice + taxPrice).toFixed(2));

  const itemsPrice = calculateItemsPrice();
  const taxPrice = calculateTaxPrice(itemsPrice);
  const totalPrice = calculateTotalPrice(itemsPrice, taxPrice);

  const filteredProducts = products.filter((product) => {
    const productFilter = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = product.category === selectedCategory;
    return productFilter && matchesCategory;
  });

  const handleAddToCart = () => {
    const existingProductIndex = cartItems.findIndex(
      (item) => item.id === selectedProduct.id
    );

    if (existingProductIndex > -1) {
      const updatedCart = [...cartItems];
      updatedCart[existingProductIndex].quantity += quantity;
      setCartItems(updatedCart);
    } else {
      const newCartItem = { ...selectedProduct, quantity };
      setCartItems([...cartItems, newCartItem]);
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

  const handleReferenceNumberChange = (number) => {
    if (/^\d*$/.test(number) && number.length <= 13) {
      setReferenceNumber(number);
    }
  };

  const handleCashAmountChange = (amount) => {
    if (/^\d*\.?\d*$/.test(amount)) {
      setCashAmount(amount);
    }
  };


  const handleModalAnimation = (toValue) => {
    Animated.timing(modalOpacity, {
      toValue,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const handleCheckout = async () => {
    if (!selectedPaymentMethod) {
      Alert.alert("Error", "Please select a payment method.");
      return;
    }
  
    if (selectedPaymentMethod === "GCash" && referenceNumber.length !== 13) {
      Alert.alert("Error", "Reference number must be exactly 13 digits.");
      return;
    }
    
    const parsedCashAmount = parseFloat(cashAmount);
    if (selectedPaymentMethod === "Cash" && (!cashAmount || parsedCashAmount <= 0)) {
      Alert.alert("Error", "Please enter a valid cash amount.");
      return;
    }
  

    if (selectedPaymentMethod === "Cash" && parsedCashAmount < totalPrice) {
      Alert.alert("Error", "Insufficient cash. Please enter a valid amount.");
      return;
    }

  
    // Other checks (user authentication, etc.)
    if (!context.stateUser.isAuthenticated) {
      Alert.alert("Error", "User not authenticated. Please log in.");
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
        eWallet: selectedPaymentMethod === "GCash" ? "GCash" : null,
        referenceNumber: selectedPaymentMethod === "GCash" ? referenceNumber : null,
        cashAmount: selectedPaymentMethod === "Cash" ? parsedCashAmount : null,
        itemsPrice,
        taxPrice,
        totalPrice,
      };
      
      const token = await AsyncStorage.getItem("jwt");
      if (!token) {
        Alert.alert("Error", "Authentication error. Please log in again.");
        setIsLoading(false);
        return;
      }
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
  
      const response = await axios.post(`${baseURL}orders/newOrder`, order, config);
  
      if (response.status === 200 || response.status === 201) {
        setTransactionComplete(true);
        handleModalAnimation(1);
        setCartItems([]);
      }
  
      setIsLoading(false);
      setShowPaymentModal(false);
    } catch (error) {
      console.error("Order Placement Error:", error);
      Alert.alert(
        "Error",
        "Order Placement Error: " + (error?.response?.data?.message || "Something went wrong.")
      );
      setIsLoading(false);
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

  const resetCheckoutSummary = () => {
    setCartItems([]);
    setSelectedPaymentMethod("");
    setReferenceNumber("");
    setCashAmount("");
    setTransactionComplete(false);
    handleModalAnimation(0);
  };

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

      <View className="flex-1 py-6">
        {/* Search Bar and Category Filter */}
        <View className="p-4">
          <TextInput
            placeholder="Search..."
            value={searchTerm}
            onChangeText={(text) => setSearchTerm(text)}
            className="border p-2 rounded mb-4"
          />
          <View className="flex-row justify-around mb-4 py-10">
            <TouchableOpacity
              onPress={() => setSelectedCategory("Retail")}
              className={`p-2 rounded ${
                selectedCategory === "Retail" ? "bg-blue-500" : "bg-gray-200"
              }`}
            >
              <Text
                className={
                  selectedCategory === "Retail" ? "text-white" : "text-black"
                }
              >
                Retail
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedCategory("Whole Sale")}
              className={`p-2 rounded ${
                selectedCategory === "Whole Sale" ? "bg-blue-500" : "bg-gray-200"
              }`}
            >
              <Text
                className={
                  selectedCategory === "Whole Sale" ? "text-white" : "text-black"
                }
              >
                Wholesale
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Product Grid */}
        <FlatList
          data={filteredProducts}
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
      </View>

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
              <Text className="text-xl font-bold mb-2">Add to Cart</Text>
              <Text className="text-lg text-gray-600 mb-4">
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
                <Button onPress={handleAddToCart} className="bg-[#0080FF]">
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
              ₱{itemsPrice.toFixed(2)}
            </Text>
          </View>

          <View className="flex-row justify-between mb-2">
            <Text className="text-lg font-semibold">Tax:</Text>
            <Text className="text-lg font-medium">
              ₱{taxPrice.toFixed(2)}
            </Text>
          </View>

          <View className="flex-row justify-between mb-4">
            <Text className="text-lg font-semibold">Total:</Text>
            <Text className="text-xl font-bold text-red-600">
              ₱{totalPrice.toFixed(2)}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowPaymentModal(true)}
            className="bg-[#0080FF] py-3 rounded-lg"
          >
            <Text className="text-white text-center text-lg font-bold">
              TENDER
            </Text>
          </TouchableOpacity>

          {/* Payment Modal */}
          <Payment
            isVisible={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            onConfirm={handleCheckout}
            isLoading={isLoading}
            selectedPaymentMethod={selectedPaymentMethod}
            setSelectedPaymentMethod={setSelectedPaymentMethod}
            totalAmount={totalPrice}
            qrCodeImage={qrCodeImage}
            onReferenceNumberChange={handleReferenceNumberChange}
            onCashAmountChange={handleCashAmountChange}
            cashAmount={cashAmount}
          />
        </View>
      </View>

      {/* Transaction Complete Modal */}
      {transactionComplete && (
        <Modal
          transparent
          animationType="fade"
          visible={transactionComplete}
          onRequestClose={resetCheckoutSummary}
          onShow={() => handleModalAnimation(1)}
        >
          <Animated.View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              opacity: modalOpacity,
            }}
          >
            <View className="bg-white p-6 rounded-lg w-4/5 items-center">
              <Image
                source={require("../../assets/images/check.png")}
                style={{ width: 120, height: 120 }}
              />
              <Text className="text-lg font-bold mt-4 text-gray-800">
                Order Confirmed!
              </Text>
              <Text className="text-base text-gray-600 mt-2 text-center">
                Your payment has been successfully processed. Thank you for your
                order!
              </Text>
              <Pressable
                className="bg-blue-500 p-3 rounded mt-6 w-full"
                onPress={resetCheckoutSummary}
              >
                <Text className="text-white text-center text-base font-medium">
                  Confirm
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default ProductContainer;


