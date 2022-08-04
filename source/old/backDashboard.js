/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from "react";
import {
  AppState,
  StyleSheet,
  View,
  StatusBar,
  Dimensions,
  Image,
  TouchableOpacity,
  Button,
  Text,
  TextInput,
  Keyboard,
  Animated,
  Easing,
} from "react-native";
import { KeyboardAwareView } from "react-native-keyboard-aware-view";
import { SafeAreaView } from "react-navigation";
import Modal from "react-native-modal";
import firebase from "react-native-firebase";
import { Buffer } from "buffer";
import AudioRecord from "react-native-audio-record";
import DeviceInfo from "react-native-device-info";
import RNFetchBlob from "rn-fetch-blob";
import { Colors } from "react-native/Libraries/NewAppScreen";
import AsyncStorage from "@react-native-community/async-storage";
import { WebView } from "react-native-webview";
import { PERMISSIONS, check, request } from "react-native-permissions";

import LogoDashView from "./LogoDashView";

const MAIN_URL = "https://nonychat.com/";

const SECRET_KEY = "OS3g6zgyLBRgGTSUeV7wpOhCX6co1nudMFHtKT3UhSJKAPRM";

//const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=0.95, user-scalable=1'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta);

const InjectedJavaScript = `    
  const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=0.95, maximum-scale=0.95, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta);
  document.getElementsByClassName('record')[0].addEventListener('click', function() {
      var data = {
      message : 'OnRecordStart',
      session_id: document.getElementById('session-id').value,
    };
    window.ReactNativeWebView.postMessage(JSON.stringify(data));
  });
  document.getElementsByClassName("flipper")[0].addEventListener("click", function() {
    window.ReactNativeWebView.postMessage('$*$');
  });
`;

const UserAgent =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 11_3 like Mac OS X; Nony/11.0; IEMobile/10.0; ARM; Touch; compatible; MSIE 10.0; DeviceId " +
  DeviceInfo.getUniqueId() +
  ")" +
  " AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E217";

const { width, height } = Dimensions.get("window");

class Dashboard extends React.Component {
  toggleModal(visible, url) {
    this.setState({
      modalVisible: visible,
      urlSite: url,
    });
  }

  setModalVisible(visible) {
    this.setState({
      modalVisible: visible,
      url: MAIN_URL,
    });
  }

  static navigationOptions = {
    title: "Home",
  };

  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
      isLoading: false,
      visibleHeight: height,
      url: MAIN_URL,
      BackButton: false,
      record_permission: false,
      media_lib_permission: false,
      showBaner: false,
      counter: 0,
      visible: true,
      oneShowVisible: false,
      modalVisible: false,
      urlSite: "",
      isRecording: false,
      sessionId: null,
      dimensions: null,
      expanded: true,
      webViewHeight: new Animated.Value(0),
    };
  }

  async componentDidMount() {
    StatusBar.setBarStyle("dark-content");
    Promise.all([
      check(PERMISSIONS.IOS.MICROPHONE),
      check(PERMISSIONS.IOS.CAMERA),
      check(PERMISSIONS.IOS.MEDIA_LIBRARY),
    ]).then(() => {
      this.requestAll().then((statuses) => console.log("status", statuses));
    });
    await this.checkPermission();
    await this.createNotificationListeners();
    this.getData("Lang")
      .then((value) => {
        if (value) {
          this.setState({
            url: "https://" + value + ".nonychat.com",
          });
          console.log("This site: " + value);
        }
      })
      .catch((error) => {
        console.log("Promise is rejected with error: " + error);
      });
    self = this;
    this.keyboardWillShowListener = Keyboard.addListener(
      "keyboardWillShow",
      (event) => {} //self.keyboardWillShow(event)
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardWillHide",
      (_) => {} //self.keyboardWillHide()
    );
    this.initAudioRecord();
  }

  componentWillUnmount() {
    this.keyboardWillShowListener && this.keyboardWillShowListener.remove();
    this.keyboardDidHideListener && this.keyboardDidHideListener.remove();
  }

  keyboardWillShow = (event) => {
    const { dimensions } = this.state;
    if (dimensions) {
      let height = dimensions.height - event.endCoordinates.height;
      Animated.timing(this.state.webViewHeight, {
        toValue: height,
        easing: Easing.linear,
        duration: 50,
      }).start();
      //this.state.webViewHeight.setValue(height);
    }
    StatusBar.setBarStyle("dark-content");
  };

  keyboardWillChangeFrame = (event) => {
    console.log("keyboardWillChangeFrame", event.endCoordinates.height);
  };

  keyboardWillHide = () => {
    const { dimensions } = this.state;
    if (dimensions) {
      Animated.timing(this.state.webViewHeight, {
        toValue: dimensions.height,
        easing: Easing.linear,
        duration: 150,
      }).start();
      //this.state.webViewHeight.setValue(dimensions.height);
    }
    StatusBar.setBarStyle("dark-content");
  };

  initAudioRecord = () => {
    const options = {
      sampleRate: 16000,
      channels: 1,
      bitsPerSample: 16,
      wavFile: "test.wav",
    };
    AudioRecord.init(options);
  };

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
    var user_ag = ua.split("DeviceId");
    var device_id = user_ag[1].replace(")", "");
    var urlPost =
      "https://" + lang + "-chat.nonychat.com/app/set_firebase_token";

    const body = JSON.stringify({
      key: SECRET_KEY,
      token: token,
      device_id: device_id,
    });

    fetch(urlPost, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    })
      .then((response) => response.text())
      .then((text) => {
        console.log("TEXT =>", text);
      })
      .catch(() => {
        this.props.navigation.replace("Dashboard");
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
    console.log("NOTIFICATION createNotificationListeners");
    this.notificationListener = firebase
      .notifications()
      .onNotification((notification) => {
        const { title, body } = notification;
        console.log("NOTIFICATION onNotification", notification);

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
      });

    this.notificationDisplayedListener = firebase
      .notifications()
      .onNotificationDisplayed((notification) => {
        console.log("NOTIFICATION onNotificationDisplayed", notification);
      });

    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened((notificationOpen) => {
        const { title, body } = notificationOpen.notification;
        console.log("NOTIFICATION onNotificationOpened", notification);
      });

    this.notificationOpen = firebase
      .notifications()
      .getInitialNotification()
      .then((notification) => {
        if (notification) {
        }
      });

    /*
     * Triggered for data only payload in foreground
     * */
    this.messageListener = firebase.messaging().onMessage((message) => {
      //process data message
      // alert("notification receved 4"+JSON.stringify(message._data));
      console.log("notification receved 4", message.title);
      console.log("NOTIFICATION onMessage", message);
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
    });
  }

  clearTimer = () => {
    this.timer && clearInterval(this.timer);
    this.timer = null;
    this.setState({
      counter: 0,
    });
  };

  onStart = () => {
    this.clearTimer();
    this.timer = setInterval(() => {
      console.log(this.state.counter);
      if (this.state.counter == 13) {
        this.clearTimer();
        this.toggleRecord();
      } else {
        this.setState({
          counter: this.state.counter + 1,
        });
      }
    }, 1000);
  };

  async requestAll() {
    const micStatus = await request(PERMISSIONS.IOS.MICROPHONE);
    const cameraStatus = await request(PERMISSIONS.IOS.CAMERA);
    const photoStatus = await request(PERMISSIONS.IOS.MEDIA_LIBRARY);
    return { micStatus, cameraStatus, photoStatus };
  }

  uploadAudio = async (buffer) => {
    let session_id = this.state.sessionId;
    let body = JSON.stringify({
      key: SECRET_KEY,
      audio_buffer: buffer,
      session_id: session_id,
    });

    try {
      var lang = "il";
      var saved_lang = await this.getData("Lang");

      if (saved_lang) {
        lang = saved_lang;
      }

      var urlPost = "https://" + lang + "-chat.nonychat.com/app/ios_record";

      fetch(urlPost, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      })
        .then((response) => response.text())
        .then((text) => {
          console.log("uploadAudio RESPONSE =>", text);
        })
        .catch((error) => {
          console.log("uploadAudio ERROR =>", error);
        });
    } catch (err) {
      console.log("error", err);
      alert(err);
    }
  };

  toggleRecord = async () => {
    if (this.state.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  };

  stopRecording = async () => {
    this.clearTimer();
    this.setState({
      isRecording: false,
    });
    let audioFilePath = await AudioRecord.stop();
    RNFetchBlob.fs.readFile(audioFilePath, "base64").then((base64Data) => {
      var buffer = Buffer.from(base64Data, "base64");
      this.uploadAudio(buffer);
    });
  };

  startRecording = () => {
    this.setState({
      isRecording: true,
    });
    this.onStart();
    AudioRecord.start();
  };

  handleLoading = (event) => {
    StatusBar.setBarStyle("dark-content");
    let url = event && event.url;
    if (url) {
      let index = url.indexOf("nonychat.com/");
      if (index > 0) {
        let lang = url.substring(8, index - 1);
        this.storeData("Lang", lang);
      }
    }
    if (url.includes("nonychat.com")) {
      return true;
    } else if (url.includes("widgets.outbrain.com")) {
      return false;
    } else if (url.includes("http") && !url.includes("nonychat.com")) {
      this.toggleModal(true, event.url);
    }
    return false;
  };

  handleMessage = async (message) => {
    var str = message.nativeEvent.data;
    if (str.length == 2) {
      if (message.nativeEvent.url === MAIN_URL) {
        this.storeData("Lang", str);
      }
    } else if (str.includes("$*$")) {
      var saved_token = await this.getData("FirebaseToken");
      var lang = "il";
      var saved_lang = await this.getData("Lang");
      if (saved_lang) {
        lang = saved_lang;
      }
      await this.sendToken(saved_token, lang);
    } else {
      var nativeData =
        message && message.nativeEvent && message.nativeEvent.data;
      if (nativeData) {
        let data = JSON.parse(nativeData);
        let sessionId = data.session_id;
        this.setState({
          sessionId: sessionId,
        });
      }
      this.toggleRecord();
    }
  };

  showSpinner() {
    this.setState({ oneShowVisible: true });
  }

  hideSpinner() {
    this.setState({
      visible: !this.state.oneShowVisible,
    });
  }

  onLayout = (event) => {
    if (this.state.dimensions) return;
    let { width, height } = event.nativeEvent.layout;
    this.setState({ dimensions: { width: width, height: height } });
    this.state.webViewHeight.setValue(height);
  };

  beta =
    "https://beta.nonychat.com/?serial=ufd8783fsdj9uwsahf87wnc8g6fdtad8sa46w740acn08";

  collapse = () => {
    Animated.timing(this.state.webViewHeight, {
      toValue: this.state.dimensions.height,
      duration: 1000,
    }).start();
  };

  expand = () => {
    Animated.timing(this.state.webViewHeight, {
      toValue: this.state.dimensions.height / 2,
      duration: 1000,
    }).start();
  };

  TestView = () => (
    <View>
      <View
        style={{
          flexDirection: "row",
          height: 100,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button title={"COLLAPSE"} onPress={this.collapse} />
        <Button title={"EXPAND"} onPress={this.expand} />
      </View>
      {this.state.dimensions && (
        <Text>
          WIDTH: {this.state.dimensions.width} HEIGHT:{" "}
          {this.state.dimensions.height}
        </Text>
      )}
      <TextInput
        onChangeText={(value) => this.setState({ text: value })}
        multiline={false}
        value={this.state.text}
        placeholder={"Email"}
        keyboardType={"email-address"}
        autoCompleteType={"email"}
        autoCapitalize={"none"}
        clearButtonMode={"while-editing"}
        style={styles.textInputEmail}
      />
    </View>
  );

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={"dark-content"} translucent={false} />
        <View style={styles.content} onLayout={this.onLayout}>
          <KeyboardAwareView>
            <View style={styles.webView}>
              <WebView
                ref={(ref) => {
                  this.webView = ref;
                }}
                source={{ uri: this.beta }}
                startInLoadingState={true}
                injectedJavaScript={InjectedJavaScript}
                userAgent={UserAgent}
                scalesPageToFit={false}
                automaticallyAdjustContentInsets={false}
                allowFileAccessFromFileURLs={true}
                mixedContentMode={"always"}
                onLoadStart={() => this.showSpinner()}
                onLoad={() => this.hideSpinner()}
                originWhitelist={["*"]}
                scrollEnabled={false}
                onShouldStartLoadWithRequest={(event) => {
                  return this.handleLoading(event);
                }}
                onMessage={(event) => {
                  this.handleMessage(event);
                }}
              />
              <LogoDashView visible={this.state.visible} />
            </View>
          </KeyboardAwareView>
          <Modal
            useNativeDriver={true}
            isVisible={this.state.modalVisible}
            onBackButtonPress={() => this.setModalVisible(false)}
            onBackdropPress={() => this.setModalVisible(false)}
          >
            <View style={styles.modal}>
              <View style={styles.modalTop}>
                <TouchableOpacity
                  style={{
                    height: width * 0.1,
                    width: width * 0.1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => this.setModalVisible(false)}
                >
                  <Image
                    source={require("./images/cross.png")}
                    style={{
                      height: width * 0.08,
                      width: width * 0.08,
                      resizeMode: "contain",
                    }}
                  />
                </TouchableOpacity>
              </View>
              <WebView
                ref={(ref) => {
                  this.webview = ref;
                }}
                source={{ uri: this.state.urlSite }}
                style={{ flex: 1 }}
                scalesPageToFit={true}
                onMessage={(event) => {
                  this.handleMessage(event);
                }}
              />
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingBottom: 32,
  },
  content: {
    width: "100%",
    height: "100%",
    paddingHorizontal: 4,
  },
  webView: {
    width: "100%",
    height: "100%",
    borderColor: "green",
    borderWidth: 1,
  },
  ActivityIndicatorStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  stylOld: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  styleNew: {
    flex: 1,
  },
  modal: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginTop: 15,
    marginBottom: 15,
  },
  modalTop: {
    height: 40,
    flexDirection: "row",
    marginTop: 10,
    marginLeft: 15,
  },
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
  textInputEmail: {
    alignSelf: "stretch",
    borderRadius: 4,
    backgroundColor: "green",
    color: "red",
    fontSize: 16,
    height: 48,
  },
});

export default Dashboard;
