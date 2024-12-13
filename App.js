import React, { useState, useEffect } from "react";
import Toast from "react-native-toast-message";
import { NavigationContainer } from "@react-navigation/native";
import { NativeBaseProvider, extendTheme } from "native-base";
import Auth from "./context/store/Auth";
import Main from "./navigators/Main";

const newColorTheme = {
  brand: {
    900: "#8287af",
    800: "#7c83db",
    700: "#b3bef6",
  },
};

const theme = extendTheme({ colors: newColorTheme });

const App = () => {
  return (
    <Auth>
      <NativeBaseProvider theme={theme}>
        <NavigationContainer>
          <Main />
          <Toast />
        </NavigationContainer>
      </NativeBaseProvider>
    </Auth>
  );
};
export default App;
