import { useState, useContext, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Yup from "yup";
import { Formik } from "formik";
import Toast from "react-native-toast-message";
import { AntDesign } from "@expo/vector-icons";
import { ExclamationCircleIcon } from "react-native-heroicons/solid";
import AuthGlobal from "../../context/store/AuthGlobal";
import { loginUser } from "../../context/actions/userAction";

const Login = () => {


    return (

      <View className="flex-row w-full h-full">
      <View className="flex-1 bg-blue-500 justify-center items-center">
        <Image
          className="w-2/3 h-2/3"
          resizeMode="contain"
          source={require("../../assets/images/rafiki_login.png")}
        />
      </View>

      <View className="flex-1 bg-white justify-center items-center">
        <Image
          className="w-40 h-40 mb-8"
          resizeMode="contain"
          source={require("../../assets/images/jicus.jpg")}
        />
        <View className="w-3/4">
          <Text className="text-base text-black font-medium">Email</Text>
          <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border">

          <TextInput
          className="flex-1 text-black font-semibold text-base"
           placeholder="Enter your email"
          placeholderTextColor="#7B7B8B"
          />
          </View>
          <Text className="text-base text-black font-medium">Password</Text>
          <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border">

          <TextInput
          className="flex-1 text-black font-semibold text-base"
           placeholder="Enter your password"
          placeholderTextColor="#7B7B8B"
          />
          </View>
        </View>
      </View>
    </View>

    );
};

export default Login;