import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ProductContainer from "../screens/product/ProductContainer";




const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Products"
        component={ProductContainer}
        options={{
          headerShown: false,
        }}
      />

     
     
    </Stack.Navigator>
  );
}

export default function HomeNavigator() {
  return <MyStack />;
}