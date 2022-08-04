/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Dimensions,
  Image,
  Platform,
} from "react-native";
import { PERMISSIONS, check, request } from "react-native-permissions";
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from "react-native/Libraries/NewAppScreen";

import DeviceInfo from "react-native-device-info";
import AsyncStorage from "@react-native-async-storage/async-storage";

var { width, height } = Dimensions.get("window");

class Splash extends React.Component {
  constructor(props) {
    super(props);
  }

  // componentDidMount(){
  //   this.checkPermission();
  //          this.createNotificationListeners();
  //     setTimeout( () => {
  //               const navigate = this.props.navigation;
  //        this.props.navigation.replace('Dashboard');
  //         },2000);

  // }
  async requestAll() {
    const micStatus = await request(PERMISSIONS.IOS.MICROPHONE);
    const cameraStatus = await request(PERMISSIONS.IOS.CAMERA);
    const photoStatus = await request(PERMISSIONS.IOS.MEDIA_LIBRARY);
    // return {micStatus};
    return { micStatus, cameraStatus, photoStatus };
  }

  async componentDidMount() {
    // alert("Device ID : "+DeviceInfo.getUserAgent());

    // await this.checkPermission();
    //      await  this.createNotificationListeners();
    Promise.all([
      check(PERMISSIONS.IOS.MICROPHONE),
      check(PERMISSIONS.IOS.CAMERA),
      check(PERMISSIONS.IOS.MEDIA_LIBRARY),
    ]).then(([record_audio, camera, photo]) => {
      this.requestAll().then((statuses) => console.log("status", statuses));
    });

    setTimeout(async () => {
      var loggedIn = await AsyncStorage.getItem("loggedIn");
      var Confirm = await AsyncStorage.getItem("Confirm");
      const navigate = this.props.navigation;
      this.props.navigation.replace("Dashboard");
      //              if(loggedIn == 'true' && Confirm == "1"){

      //             const navigate = this.props.navigation;
      //          this.props.navigation.replace('Dashboard');
      //              }else if( loggedIn == 'true' && Confirm !== '1'){
      // const navigate = this.props.navigation;
      //          this.props.navigation.replace('Terms');
      //              }else{
      //  const navigate = this.props.navigation;
      //          this.props.navigation.replace('Login');
      //              }
    }, 2000);
  }

  getData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        return value;
      }
    } catch (e) {
      return null;
    }
  };

  storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      // saving error
    }
  };

  sendToken = async (token, lang) => {
    var ua = await DeviceInfo.getUserAgent();
    console.log(ua)
    // console.log("token1",ua);
    // var   user_ag = ua.replace(')','');
    // console.log("token2",ua);
    var user_ag = ua.split("DeviceId");
    var device_id = user_ag[1].replace(")", "");

    console.log("token", token);
    var urlPost =
      "https://" + lang + "-chat.alma-app.co/app/set_firebase_token";
    console.log(urlPost);
    // alert("device_id"+device_id);
    // alert("token",token);
    fetch(urlPost, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: "OS3g6zgyLBRgGTSUeV7wpOhCX6co1nudMFHtKT3UhSJKAPRM",
        token: token,
        device_id: device_id,
      }),
    })
      .then((response) => {
        const navigate = this.props.navigation;
        this.props.navigation.replace("Dashboard");
        // alert("token saved");
        // console.log("responsess",response);
        return response;
      })
      .then((responseJson) => {
        // console.log("responsess  jsonsn",responseJson);
      })
      .catch((error) => {
        const navigate = this.props.navigation;
        this.props.navigation.replace("Dashboard");
        alert(error);
        this.setState({
          isLoading: false,
        });
      });
  };

  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      await firebase.messaging().deleteToken();
      const fcmToken = await firebase.messaging().getToken();
      var token = fcmToken;
      var lang = "il";
      var saved_token = await this.getData("FirebaseToken");
      var saved_lang = await this.getData("Lang");
      if (saved_lang) {
        lang = saved_lang;
      }

      if (!saved_token || saved_token !== token) {
        this.storeData("FirebaseToken", token);
        this.sendToken(token, lang);
      } else {
        this.sendToken(token, lang);
      }
    } else {
      this.requestPermission();
    }
  }

  async requestPermission() {
    firebase
      .messaging()
      .requestPermission()
      .then(async () => {
        const fcmToken = await firebase.messaging().getToken();
        console.log("token: ", fcmToken);
      })
      .catch((error) => {
        // User has rejected permissions
      });
  }

  async createNotificationListeners() {
    // firebase.messaging().ios.registerForRemoteNotifications();
    // console.log("notification receved");
    /*
     * Triggered when a particular notification has been received in foreground
     * */
    this.notificationListener = firebase
      .notifications()
      .onNotification((notification) => {
        const { title, body } = notification;

        if (Platform.OS === "android") {
          const localNotification = new firebase.notifications.Notification()
            .setNotificationId("jh")
            .setTitle(title)
            .setBody(body)
            .setData({});
          firebase.notifications().displayNotification(localNotification);
        } else if (Platform.OS === "ios") {
          const localNotification = new firebase.notifications.Notification()
            .setNotificationId(notification.notificationId)
            .setTitle(title)
            .setSubtitle(notification.subtitle)
            .setBody(body)
            .setData(notification.data)
            .ios.setBadge(notification.ios.badge);

          firebase
            .notifications()
            .displayNotification(localNotification)
            .catch((err) => console.error(err));
        }

        // alert("notification"+title);
        // this.savenotification(title,body);
      });

    this.notificationDisplayedListener = firebase
      .notifications()
      .onNotificationDisplayed((notification) => {
        // const { title, body } = notification;
        // alert("notification receved 5");
        // this.showAlert(title, body);
      });

    /*
     * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:ss
     * */
    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened((notificationOpen) => {
        const { title, body } = notificationOpen.notification;
        // console.log("notification receved 2");
        // this.showAlert(title, body);
      });

    /* If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
     */
    this.notificationOpen = firebase
      .notifications()
      .getInitialNotification()
      .then((NotificationOpen) => {
        // .then((notificationOpen: NotificationOpen) => {
        // alert("notification receved 7");
        // alert("here"+notificationOpen);
        if (NotificationOpen) {
          // console.log("notification receved 8");
          // App was opened by a notification
          // Get the action triggered by the notification being opened
          const action = NotificationOpen.action;
          // Get information about the notification that was opened
          // const notification: Notification = notificationOpen.notification;
          // console.log("notification receved 9",notification);
        }
      });
    /*
     * Triggered for data only payload in foreground
     * */
    this.messageListener = firebase.messaging().onMessage((message) => {
      //process data message
      // alert("notification receved 4"+JSON.stringify(message._data));
      console.log("notification receved 4", message.title);
      if (Platform.OS === "android") {
        const localNotification = new firebase.notifications.Notification()
          .setNotificationId("jh")
          .setTitle("message._title")
          .setBody("message._title")
          .setData(message._data);
        firebase.notifications().displayNotification(localNotification);
      } else if (Platform.OS === "ios") {
        const localNotification = new firebase.notifications.Notification()
          .setNotificationId("jh")
          .setTitle("message._title")
          .setBody("message._title")
          .setData(message._data)
          .ios.setBadge(message.ios.badge);

        firebase
          .notifications()
          .displayNotification(localNotification)
          .catch((err) => console.error(err));
      }
    });
  }

  render() {
    return (
      <React.Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <View
            style={{
              width: width,
              height: height,
              backgroundColor: "#fff",
              justifyContent: "space-around",
              AlignItems: "center",
              AlignSelf: "center",
            }}
          >
            <View
              style={{
                width: width * 0.5,
                height: width * 0.5,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#fff",
                alignSelf: "center",
                position: "absolute",
                bottom: height * 0.6,
              }}
            >
              <Image
                source={require("./images/logoDash.png")}
                style={{
                  width: width * 0.5,
                  height: width * 0.5,
                  resizeMode: "contain",
                }}
              />
            </View>
            <Image
              source={require("./images/loading.gif")}
              style={{
                width: width * 0.2,
                height: width * 0.2,
                resizeMode: "contain",
                alignSelf: "center",
              }}
            />
          </View>
        </SafeAreaView>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: "absolute",
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "400",
    color: Colors.dark,
  },
  highlight: {
    fontWeight: "700",
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: "600",
    padding: 4,
    paddingRight: 12,
    textAlign: "right",
  },
});

export default Splash;
