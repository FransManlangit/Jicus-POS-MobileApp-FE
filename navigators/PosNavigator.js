import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import PosContainer from "../screens/pos/Pos";




const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="POS"
        component={PosContainer}
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