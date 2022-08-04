/**
 * @format
 */

import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log(
    "Message handled in the background!",
    remoteMessage.notification.body
  );
  await AsyncStorage.setItem("remoteMessage", remoteMessage.notification.body);

  // await AsyncStorage.setItem("remoteMessage", remoteMessage.notification.body);
});
console.disableYellowBox = true;
AppRegistry.registerComponent(appName, () => App);
