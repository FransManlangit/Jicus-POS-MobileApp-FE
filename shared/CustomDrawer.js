import React, { useState, useEffect, useContext, useCallback } from "react";
import { View, Text, Pressable, Image, Alert } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AuthGlobal from "../context/store/AuthGlobal";
import { logoutUser } from "../context/actions/userAction";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseURL from "../assets/common/baseUrl";

export default function CustomDrawerContent(props) {
  const navigation = useNavigation();
  const context = useContext(AuthGlobal);
 
  const [userProfile, setUserProfile] = useState("");
  const { bottom } = useSafeAreaInsets();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Fetch User Profile when drawer is focused
  useFocusEffect(
    useCallback(() => {
      if (
        context.stateUser.isAuthenticated === false ||
        context.stateUser.isAuthenticated === null
      ) {
        navigation.navigate("Login");
      }

      const fetchData = async () => {
        try {
          const jwtToken = await AsyncStorage.getItem("jwt");
          const response = await axios.get(
            `${baseURL}users/${context.stateUser.user.userId}`,
            {
              headers: { Authorization: `Bearer ${jwtToken}` },
            }
          );

          setUserProfile(response.data);
        } catch (error) {
          console.error(error);
        }
      };

      fetchData();

      return () => {
        setUserProfile("");
      
      };
    }, [context.stateUser.isAuthenticated])
  );

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Logout Handler
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("jwt");
              logoutUser(context.dispatch);
              navigation.navigate("Login");
            } catch (error) {
              console.error("Logout error: ", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Render fallback message when the user profile is null
  return (
    <View className="flex-1 bg-white">
    {/* Top Section: Logo & User Info */}
    <View className="p-6 items-center bg-blue-100 border-b border-gray-300">
      <Image
        style={{ height: 176, width: 128, marginBottom: 16 }}
        resizeMode="contain"
        source={require("../assets/images/jicus.jpg")}
      />
      <View className="items-center gap-y-10">
      <Text className="text-3xl font-bold text-gray-800">
        {userProfile ? userProfile.name : ""}
      </Text>
      <View className="flex-row items-center gap-x-2">
      <Text className="text-xl text-gray-500">
        {currentTime.toLocaleDateString()}
      </Text>
      <Text className="text-xl text-gray-500">
        {currentTime.toLocaleTimeString()}
      </Text>
      </View>
      </View>
    </View>
  
    {/* Empty space to push logout button to the bottom */}
    <View className="flex-grow" />
  
    {/* Logout Button */}
    <Pressable
      onPress={handleLogout}
      className="flex-row py-4 items-center justify-center p-4 border-t border-gray-300 bg-red-100"
    >
      <Ionicons name="log-out-outline" size={24} color="red" />
      <Text className="text-xl font-bold text-red-600 ml-2">Logout</Text>
    </Pressable>
  </View>
  
  );
}
