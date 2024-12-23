import React, { useContext, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Button,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import AuthGlobal from "../../context/store/AuthGlobal";
import { useSelector, useDispatch } from "react-redux";
import {
  CubeIcon,
  Cog6ToothIcon,
  SquaresPlusIcon,
  ArchiveBoxIcon,
} from "react-native-heroicons/solid";
import { logoutUser } from "../../context/actions/userAction";

const UserProfile = () => {
  const navigation = useNavigation();
  const context = useContext(AuthGlobal);
  const dispatch = useDispatch();
  const [userProfile, setUserProfile] = useState("");
  const [image, setImage] = useState("");

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
        setImage("");
      };
    }, [context.stateUser.isAuthenticated])
  );
  

  console.log(context, "context");
  return (
    <SafeAreaView className="bg-white h-screen w-screen">
      <ScrollView>
      <View className="items-start justify-start">
      <View className="py-48 pl-32">
      <Image
              className="rounded-lg h-72 w-72"
              source={
                userProfile.avatar?.url
                  ? { uri: userProfile.avatar?.url }
                  : "https://res.cloudinary.com/dn638duad/image/upload/v1698419194/Beige_and_Charcoal_Modern_Travel_Itinerary_A4_Document_v9fz8j.png"
              }
            />
        </View>
      </View>


     <View className="items-end justify-end">
     <Text className="font-bold  text-2xl">
     {userProfile ? userProfile.name : ""}
            </Text>
            <Text className="text-black text-2xl text-center">
              {userProfile ? userProfile.email : ""}
            </Text>
     </View>
        <View className="pt-72">
          <TouchableOpacity
            className="bg-[#13DAE9] rounded-xl min-h-[62px] justify-center items-center"
            onPress={async () => {
              await AsyncStorage.removeItem("jwt");
              logoutUser(context.dispatch);
              navigation.navigate("Login");
            }}
          >
            <Text className="text-white font-semibold text-lg">Sign Out</Text>
          </TouchableOpacity>
        </View>
      
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserProfile;
