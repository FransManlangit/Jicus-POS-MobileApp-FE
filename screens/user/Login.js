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
  const navigation = useNavigation();
  const context = useContext(AuthGlobal);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Please enter your Email"),
    password: Yup.string().required("Please enter your Password"),
  });

  const handleSubmit = (values) => {
    const user = {
      email: values.email.toLowerCase(),
      password: values.password,
    };
     
    if (!user.email || !user.password) {
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Warning!",
        text2: "Please fill in your credentials",
      });
    } else {
      loginUser(user, context.dispatch);
     
    }
  };

  useEffect(() => {
    if (context.stateUser.isAuthenticated) {
      navigation.navigate("POS");
    }
  }, [context.stateUser.isAuthenticated]);

  return (
    <SafeAreaView>
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => {
          const [showPassword, setShowPassword] = useState(false);

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
                  <Text className="text-base text-black font-medium">
                    Email
                  </Text>
                  <View
                    className={`w-full h-16 px-4 bg-black-100 rounded-2xl border ${
                      touched.email && errors.email
                        ? "border-red-500"
                        : "border-black-200"
                    } flex flex-row items-center`}
                  >
                    <TextInput
                      className="flex-1 text-black font-semibold text-base"
                      value={values.email}
                      placeholder="Enter your email"
                      placeholderTextColor="#7B7B8B"
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      keyboardType="email-address"
                    />
                  </View>
                  {touched.email && errors.email && (
                    <View className="flex flex-row items-center space-x-1">
                      <ExclamationCircleIcon size={15} color="red" />
                      <Text className="text-red-500">{errors.email}</Text>
                    </View>
                  )}
                </View>

                {/* Password Field */}
                <View className="w-3/4">
                  <Text className="text-base text-black font-medium">
                    Password
                  </Text>
                  <View
                    className={`w-full h-16 px-4 bg-black-100 rounded-2xl border ${
                      touched.password && errors.password
                        ? "border-red-500"
                        : "border-black-200"
                    } flex flex-row items-center`}
                  >
                    <TextInput
                      className="flex-1 text-black font-semibold text-base"
                      value={values.password}
                      placeholder="Enter your password"
                      placeholderTextColor="#7B7B8B"
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={{ paddingHorizontal: 10 }}
                    >
                      <AntDesign
                        name={showPassword ? "eye" : "eyeo"}
                        size={24}
                        color="black"
                      />
                    </TouchableOpacity>
                  </View>
                  {touched.password && errors.password && (
                    <View className="flex flex-row items-center space-x-1">
                      <ExclamationCircleIcon size={15} color="red" />
                      <Text className="text-red-500">{errors.password}</Text>
                    </View>
                  )}
                </View>
                 {/* Submit Button */}
                 <View className="pt-10 w-8/12">
                  <TouchableOpacity
                    onPress={() => handleSubmit()}
                    activeOpacity={0.7}
                    className="bg-blue-500 rounded-xl min-h-[62px] justify-center items-center"
                  >
                    <Text className="text-white font-semibold text-2xl">Login</Text>
                  </TouchableOpacity>
                </View>
             
              </View>
            </View>
          );
        }}
      </Formik>
    </SafeAreaView>
  );
};

export default Login;
