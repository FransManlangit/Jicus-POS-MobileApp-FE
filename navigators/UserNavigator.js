import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AuthGlobal from "../context/store/AuthGlobal";


//Screens
import Login from "../screens/user/Login";


const Stack = createStackNavigator();


const UserNavigator = (props) => {
    const context = useContext(AuthGlobal);
     console.log(context, "context authenticated USER");
  
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { flex: 1 },
        }}
      >
      
      {context.stateUser.isAuthenticated ? (
        <>
         
         
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            options={{ headerShown: false }}
            component={Login}
          ></Stack.Screen>
         
         
        </>
      )}
        
       
      </Stack.Navigator>
    );
  };
  
  export default UserNavigator;