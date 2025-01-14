import jwt_decode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import baseURL from "../../assets/common/baseUrl";

export const SET_CURRENT_USER = "SET_CURRENT_USER";

export const loginUser = (user, dispatch) => {
  fetch(`${baseURL}users/login`, {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.token) {
        const token = data.token;
        AsyncStorage.setItem("jwt", token)
          .then(() => {
            const decoded = jwt_decode(token);
            dispatch(setCurrentUser(decoded, user));

            Toast.show({
              topOffset: 60,
              type: "success",
              text1: "Successfully Login",
              text2: "You can now explore our shop!",
            });
          })
          .catch((err) => {
            console.error("Error saving token to AsyncStorage:", err);
            logoutUser(dispatch);
          });
      } else {
        logoutUser(dispatch);
      }
    })
    .catch((err) => {
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Please provide correct credentials",
        text2: "",
      });

      console.error("Login error:", err);
      logoutUser(dispatch);
    });
};

export const logoutUser = (dispatch) => {
  console.log("Logging out user...");

  AsyncStorage.removeItem("jwt")
    .then(() => {
      console.log("JWT removed from AsyncStorage");
      dispatch(setCurrentUser({}));
      console.log("User state reset to empty object");
    })
    .catch((err) => {
      console.error("Error removing JWT from AsyncStorage:", err);
    });
};

export const getUserProfile = (id) => {
  fetch(`${baseURL}users/${id}`, {
    method: "GET",
    body: JSON.stringify(user),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
};

export const setCurrentUser = (decoded, user) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
    userProfile: user,
  };
};
