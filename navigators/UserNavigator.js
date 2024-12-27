import React, { useContext } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import AuthGlobal from "../context/store/AuthGlobal";
import CustomDrawerContent from "../shared/CustomDrawer";

// Screens
import Login from "../screens/user/Login";
import ProductContainer from "../screens/product/ProductContainer";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const UserNavigator = (props) => {
  const context = useContext(AuthGlobal);

  if (!context.stateUser.isAuthenticated) {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" 
        component={Login} 
        
        />
      </Stack.Navigator>
    );
  }

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: { backgroundColor: "#fff" },
      }}
    >
      <Drawer.Screen name="Products" component={ProductContainer} />
    </Drawer.Navigator>
  );
};

export default UserNavigator;
