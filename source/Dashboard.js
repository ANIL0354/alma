import React, { Component } from "react";
import {
  AppState,
  View,
  StatusBar,
  TouchableOpacity,
  Platform,
  Linking,
  SafeAreaView,
  BackHandler,
  NativeEventEmitter,
  NativeModules,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareView } from "react-native-keyboard-aware-view";
import Modal from "react-native-modal";
import { Buffer } from "buffer";
import RNFetchBlob from "rn-fetch-blob";
import { WebView } from "react-native-webview";
import AudioRecorderPlayer from "react-native-audio-recorder-player";
import messaging from "@react-native-firebase/messaging";
import RNRestart from "react-native-restart";
import PushNotification from "react-native-push-notification";
import { mediaDevices } from 'react-native-webrtc';
import Peer from 'react-native-peerjs';
import VideoChatView from "./VideoChatView";
import InCallManager from 'react-native-incall-manager';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import DeviceInfo from "react-native-device-info";

const RNFS = require("react-native-fs");
const deviceInfoEmitter = new NativeEventEmitter(NativeModules.RNDeviceInfo);

import { PermissionsAndroid } from "react-native";
import { PERMISSIONS, check, request } from "react-native-permissions";

import moment, { relativeTimeRounding } from "moment";
import LogoDashView from "./LogoDashView";
import styles from "./styles";
import ErrorView from "./ErrorView";
import CustomWebView from "./CustomWebView";
import DebugView from "./DebugView";
import TouchBlockView from "./components/TouchBlockView";
import { Camera, useCameraDevices } from "react-native-vision-camera";

import {
  publishLocation,
  publishPayload,
  publishNotification,
  publishSubscription,
  publishPurchase,
  resetPublishApi,
} from "./PublishApi";

import {
  SECRET_KEY,
  DEVICE_ID,
  AudioSet,
  getData,
  storeData,
  BETA_URL,
  BETA,
  IsInterrupted,
  Event,
  Screens,
  generateUserAgent,
  DetectTopLoaderScript,
  DetectSessionIdScript,
} from "./utils";

import {
  onPopupOpened,
  clearCache,
  getFingerprint,
  parseDeepLink,
} from "./NetworkUtils";

import { uploadContacts, initContactsStatus } from "./ContactsUtils";

import { requestLocation } from "./LocationUtils";

import {
  APP_VERSION,
  CACHED_LOCATION,
  LANG,
  DEFAULT_API,
  CONNECTION_ERROR_MESSAGE1,
  CONNECTION_ERROR_MESSAGE2,
} from "./Constants";

import AllowesDefault from "./allowes.json";
const ALLOWES_PREF = "ALLOWES_PRES";

import IAP from "./IAP";

import LoadingView from "./LoadingView";

PushNotification.configure({
  onNotification: (_) => {
    PushNotification.setApplicationIconBadgeNumber(0);
  },
  onAction: (notification) => {

  },
  onRegister: function (token) {

  },
  onRegistrationError: function (err) {
    console.error(err.message, err);
  },
  requestPermissions: true,
  senderID: 1068827511523,
});

RenderLoading = () => (
  <SafeAreaView style={styles.container}>
    <View style={styles.content}>
      <View style={styles.webView}>
        <LogoDashView visible={true} />
      </View>
    </View>
  </SafeAreaView>
);

export default class extends React.PureComponent {
  audioRecorderPlayer = null;
  session_id = null;
  timerSessionId = null;
  blurVideoTimeout = null;
  sessionConnected = false;
  locationRequsted = false;

  constructor(props) {
    super(props);
    this.state = {
      isBeta: false,
      appState: AppState.currentState,
      isLoading: false,
      url: null,
      visible: true,
      modalVisible: false,
      urlSite: "",
      isRecording: false,
      isUploading: false,
      isRecordExists: false,
      recordFilePath: Platform.select({
        ios: null,
        android: RNFS.TemporaryDirectoryPath + "/sound.mp4",
      }),
      api: null,
      activeScreen: null,
      myPeerId: null,
      partnerPeerId: null,
      peerCon: null,
      settings: [],
      showOnLoad: false,
      fbAdLoading: true,
      timeStamp: moment().valueOf(),
      permissionsAllowed: false,
      error: null,
      validUrls: AllowesDefault,
      userAgent: generateUserAgent(),
      fingerprint: null,
      notificationPayload: null,
      urlPayload: null,
      location: null,
      isFirstInstall: false,
      cachedLocation: "Undefined",
      contactsStatus: "wait",
      subscription: null,
      subscriptionId: null,
      isPurchaseTransaction: false,
      errorsCount: 0,
      videosAreVisible: false,
      peerCall: null,
      blurVideo: true,
      userVideo: null,
      userFullVideo: null,
      partnerVideo: null,
      partnerFullVideo: null,
      userPeer: false,
      premiumStatus: 0,
      vipStatus: 0,
      lang: null,
      isHeadphonesConnected: false,
    };

    this.audioRecorderPlayer = new AudioRecorderPlayer();
    this.audioRecorderPlayer.setSubscriptionDuration(0.09);
  }

  cameraDevice() {
    const devices = useCameraDevices('wide-angle-camera')
    const device = devices.back

    if(!device) {
      return <></>;
    }
  
    return (
      <Camera
        style={{width: "100%", height: "100%", position: "relative"}}
        device={device}
        isActive={true}
      />
    )
  }

  initIAP = () => {
    IAP.init(async (data) => {
      if (data) {
        if (data.productId == "333" || data.productId == "444") {
          this.setState({
            subscription: data,
            isPurchaseTransaction: false,
            subscriptionId: data.transactionId, //data && data.transactionId,changes done by minal
          });
          publishSubscription(data, this.state.api, this.session_id, true);
        }
        else {
          this.setState({
            productId: data.productId,
            isPurchaseTransaction: false,
            transactionId: data.transactionId, //data && data.transactionId,changes done by minal
          });
          publishPurchase(data, this.state.api, this.session_id, true);
        }
      } else {
        IAP.validateSubscriptions(async (data) => {
          if (data.productId == "333" || data.productId == "444") {
            this.setState({
              subscription: data,
              isPurchaseTransaction: false,
              subscriptionId: data.transactionId, // data && data.transactionId,changes done by minal
            });
            publishSubscription(data, this.state.api, this.session_id, true);
          }
        });
      }

    });
  };

  refreshIAP = () => {
    IAP.getCurrentSubscription((data) => {
      this.setState({
        subscription: data,
        subscriptionId: data.transactionId, // data && data.transactionId,
      });
      publishSubscription(data, this.state.api, this.session_id, true);
    });
  };

  subscriptionIAP = (period) => {
    let isWeek = period == "week";
    this.showTransactionLoading();
    if (isWeek) IAP.requestSubscriptionWeek();
    else IAP.requestSubscriptionMonth();
  };

  purchaseIAP = (pack) => {
    this.showTransactionLoading();
    IAP.requestPurchase(pack);
  };

  restoreIAP = () => {
    this.showTransactionLoading();
    IAP.restorePurchases((data) => {
      data.restore = true;
      this.setState({
        subscription: data,
        isPurchaseTransaction: false,
        subscriptionId: data.transactionId, //data && data.transactionId,
      });
      publishSubscription(data, this.state.api, this.session_id, true);
    });
  };

  transactionTimer = null;

  showTransactionLoading() {
    this.transactionTimer && clearInterval(this.transactionTimer);
    this.transactionTimer = setTimeout(() => {
      this.hideTransactionLoading();
    }, 60000);
    this.setState({
      isPurchaseTransaction: true,
    });
  }

  hideTransactionLoading() {
    this.setState({
      isPurchaseTransaction: false,
    });
  }
  getInitialNotification() {
    messaging().onNotificationOpenedApp((remoteMessage) => {

    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        // alert(remoteMessage.notification.body);
        if (remoteMessage) {
          // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
          this.setState({
            notificationPayload: remoteMessage.data,
          });
          publishNotification(
            this.state.notificationPayload,
            this.state.api,
            this.session_id,
            true
          );
        }
        //   setLoading(false);
      });
  }

  componentDidMount = async () => {
    deviceInfoEmitter.addListener("RNDeviceInfo_headphoneConnectionDidChange", (enabled) => {
        if(enabled && !this.state.isHeadphonesConnected) {
          if(Platform.OS == "android") {
            InCallManager.setSpeakerphoneOn(false);
          }
          InCallManager.setForceSpeakerphoneOn(false);
        }
        else if(!enabled && this.state.isHeadphonesConnected) {
          if(Platform.OS == "android") {
            InCallManager.setSpeakerphoneOn(true);
          }
          InCallManager.setForceSpeakerphoneOn(true);
        }
        this.setState({
          isHeadphonesConnected: enabled
        });
    });
    this.getInitialNotification();
    AppState.addEventListener("change", this.handleAppStateChange);
    this.updateBaseUrl();

    this.setupNotifications();
    this.downloadAllowes();

    resetPublishApi();

    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );

    this.updateFingerprint();
    this.configureNotifications();
    if(Platform.OS == "android") {
     // this.getStream(() => {
        this.updateLocation(true);
     // });
    }
    else
    this.updateLocation(true);
    this.getInitialUrl();
    this.checkFirstInstall();
    this.initIAP();
    this.refreshIAP();

    initContactsStatus((value) => {
      this.setState({
        contactsStatus: value,
      });
    });

    Linking.addEventListener("url", this.handleDeepLink);
  };

  componentWillUnmount() {
    this.clearSessionTimer();
    AppState.removeEventListener("change", this.handleAppStateChange);
    this.backHandler && this.backHandler.remove();
    Linking.removeEventListener("url", this.handleDeepLink);
    IAP.release();
  }

  handleAppStateChange = (state) => {
    if(Platform.OS == "android" && this.webView) {
      this.webView.injectJavaScript(`
        if(socket) {
          socket.disconnect();
        }
      `);
    }
    if (
      this.state.appState.match(/inactive|background/) &&
      state === "active"
    ) {
      this.detectSessionId();
      this.refreshIAP();
      this.setupNotifications(); //changes by minal
    } else {
      this.setState({
        urlPayload: null,
        notificationPayload: null,
      });
    }

    resetPublishApi();

    this.setState({
      appState: state,
    });

    PushNotification.setApplicationIconBadgeNumber(0);
    this.prepareTokenAndSend();
  };

  detectSessionId() {
    this.clearSessionTimer();
    this.timerSessionId = setInterval(() => {
      this.webView && this.webView.injectJavaScript(DetectSessionIdScript);
    }, 1000);
  }

  clearSessionTimer() {
    this.timerSessionId && clearInterval(this.timerSessionId);
    this.timerSessionId = null;
  }

  toggleModal(visible, url) {
    if (url.endsWith(".pdf") && Platform.OS == "android") {
      url = `https://docs.google.com/gview?embedded=true&url=${url}`;
    }

    if (url.indexOf("https://wa.me/?") != -1 && Linking.canOpenURL(url)) {
      try {
        Linking.openURL(url);
      } catch (error) {
        console.log("Error opening url", error);
      }

      return;
    }

    this.setState({
      modalVisible: visible,
      urlSite: url,
    });

    if (visible) {
      onPopupOpened(DEVICE_ID, this.state.userAgent, APP_VERSION, url);
    }
  }

  setModalVisible(visible) {
    this.setState({
      modalVisible: visible,
    });
  }

  downloadAllowes = () => {
    getData(ALLOWES_PREF).then((data) => {
      if (data) {
        let validUrls = JSON.parse(data);
        this.setState({
          validUrls: validUrls,
        });
      }
      fetch(
        "https://www.alma-app.co/allow?valid_code=N7Ab6db%26676GS%5EBZN7dt%21BA6%247CDGkod87bGSDgdbaj"
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data && data.length) {
            storeData(ALLOWES_PREF, JSON.stringify(data));
            this.setState({
              validUrls: data,
            });
          }
        })
        .catch((error) => {
          console.log("downloadAllowes ERROR", error);
        });
    });
  };

  checkFirstInstall = () => {
    getData("IsFirstInstall").then((value) => {
      let isFirstInstall = !value;
      if (isFirstInstall) {
        storeData("IsFirstInstall", "FALSE");
      }
      this.setState({
        isFirstInstall: isFirstInstall,
      });
    });
  };

  updateContacts = (api, sessionId) => {
    uploadContacts(api, sessionId);
  };

  getInitialUrl = () => {
    Linking.getInitialURL().then((route) => {
      let urlPayload = parseDeepLink(route);

      this.setState({
        urlPayload: urlPayload,
      });
    });
  };

  configureNotifications = () => { };

  updateFingerprint = () => {
    getFingerprint().then((fingerprint) => {
      this.setState({
        fingerprint: fingerprint,
      });
    });
  };

  handleDeepLink = (e) => {
    const route = e.url.replace(/.*?:\/\//g, "");
    let urlPayload = parseDeepLink(route);
    this.setState({
      urlPayload: urlPayload,
    });
    publishPayload(urlPayload, this.state.api, this.session_id, true);
  };

  updateLocation(force = false) {
    this.locationRequsted = true;
    getData(CACHED_LOCATION).then((location) => {
      this.setState({
        cachedLocation: location || "",
      });
    });
    requestLocation().then((location) => {
      this.setState({
        location: location,
        cachedLocation: JSON.stringify(location),
      });
      storeData(CACHED_LOCATION, JSON.stringify(location));
      publishLocation(location, this.state.api, this.session_id, force);
    });
  }

  backAction = () => {
    return true;
  };

  updateBaseUrl = () => {
    getData(LANG)
      .then((value) => {
        let lang = this.state.isBeta ? "beta" : value;
        let urlPrefix = lang ? `${lang}.` : "www.";
        let url = "https://" + urlPrefix + "alma-app.co";
        // let url = "http://" + urlPrefix + "eduexl.com";

        this.setState({
          url: url,
          api: lang,
        });
        publishLocation(this.state.location, lang, this.session_id);
        publishPayload(this.state.urlPayload, lang, this.session_id);
        publishNotification(
          this.state.notificationPayload,
          lang,
          this.session_id
        );
        publishSubscription(this.state.subscription, lang, this.session_id);
      })
      .catch((error) => {
        console.log("Promise is rejected with error", error);
      });
  };

  prepareTokenAndSend = async (fcmToken) => {
    let saved_token = await getData("FirebaseToken");
    let api = this.state.api || DEFAULT_API;
    let token = fcmToken || saved_token;
    if (!saved_token || saved_token !== token) {
      storeData("FirebaseToken", token);
    }
    if (token) {
      this.sendToken(token, api);
    }
  };

  sendToken = async (token, api) => {
    let prefix = this.state.isBeta ? BETA : api;
    var urlPost =
      "https://" + prefix + "-chat.alma-app.co/app/set_firebase_token";
    const body = JSON.stringify({
      key: SECRET_KEY,
      token: token,
      device_id: DEVICE_ID,
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

      })
      .catch((error) => {
        console.log("sendToken ERROR", error);
      });
  };

  setupNotifications = async () => {
    let authStatus = await messaging().requestPermission();

    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      await messaging().registerDeviceForRemoteMessages();
    }

    const fcmToken = await messaging().getToken();
    await this.prepareTokenAndSend(fcmToken);

    // messaging().onTokenRefresh(async (token) => {
    //   await this.prepareTokenAndSend(token);
    // });
    // this.notificationListener = messaging().onMessage(async (remoteMessage) => {
    //   console.log("remoteMessage", remoteMessage);
    //   const notification = remoteMessage.notification;
    //   // alert(notification);
    //   console.log("notification", notification);
    //   console.log("remoteMessage", remoteMessage.data);
    //   if (notification) {
    //     this.setState({
    //       notificationPayload: remoteMessage.data,
    //     });
    //     publishNotification(
    //       this.state.notificationPayload,
    //       this.state.api,
    //       this.session_id,
    //       true
    //     );
    //   }
    // });

    messaging().onNotificationOpenedApp((message) => {
      if (message && message.data) {
        this.setState({
          notificationPayload: message.data,
        });
        publishNotification(
          this.state.notificationPayload,
          this.state.api,
          this.session_id,
          true
        );
      }
    });
  };

  clearTimer = () => {
    this.timer && clearInterval(this.timer);
    this.timer = null;
  };

  uploadAudio = async (base64Data, buffer, audioFilePath, sessionId) => {
    let body = JSON.stringify({
      key: SECRET_KEY,
      audio_buffer: buffer,
      session_id: sessionId,
    });

    try {
      let api = this.state.api || DEFAULT_API;
      let prefix = this.state.isBeta ? BETA : api;
      var urlPost = "https://" + prefix + "-chat.alma-app.co/app/record";

      fetch(urlPost, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      })
        .then((response) => response.text())
        .then((text) => {

        })
        .catch((error) => {
          console.log("uploadAudio ERROR =>", error);
        });
    } catch (error) {
      console.log("uploadAudio CATCH =>");
    }
  };

  stopRecording = async (sessionId) => {
    if (this.state.isRecording) {
      this.clearTimer();
      this.setState({
        isRecording: false,
      });

      try {
        let audioFilePath = await this.audioRecorderPlayer.stopRecorder();

        this.setState({
          path: audioFilePath,
        });

        if (Platform.OS == "ios") {
          if (audioFilePath && audioFilePath.indexOf("file://") >= 0) {
            audioFilePath = audioFilePath.substring(7);
          }
        }

        /*
        RNFetchBlob.fs
          .stat(audioFilePath)
          .then((stats) => {
            console.log("audioFilePath stats", stats);
          })
          .catch((err) => {
            console.log("audioFilePath ERROR =>", err);
          });
        */

        RNFetchBlob.fs
          .readFile(audioFilePath, "base64")
          .then((base64Data) => {
            var buffer = Buffer.from(base64Data, "base64");
            this.uploadAudio(base64Data, buffer, audioFilePath, sessionId);
          })
          .catch((error) => {
            this.uploadAudio(null, null, null, sessionId);
          });
      } catch (error) {
        this.uploadAudio(null, null, null, sessionId);
      }
    } else {
      this.uploadAudio(null, null, null, sessionId);
    }
  };

  cancelRecording = async () => {
    if (this.state.isRecording) {
      this.clearTimer();
      this.setState({
        isRecording: false,
      });
      await this.audioRecorderPlayer.stopRecorder();
    }
  };

  startRecording = (sessionId) => {
    // alert(sessionId);
    this.setState({
      isRecording: true,
    });
    this.clearTimer();
    this.timer = setTimeout(() => {
      this.clearTimer();
      this.stopRecording(sessionId);
    }, 20000);
    this.audioRecorderPlayer.startRecorder(
      this.state.recordFilePath,
      AudioSet,
      false
    );
  };

  handleError = () => {
    let url = this.state.url;
    let index = url.indexOf("alma-app.co");
    if (index > 0) {
      if (this.state.errorsCount >= 3) {
        this.setState({
          error: {
            title: CONNECTION_ERROR_MESSAGE1,
            message: CONNECTION_ERROR_MESSAGE2,
          },
          errorsCount: 0,
        });
      } else {
        this.setState({
          errorsCount: this.state.errorsCount + 1,
        });
      }
    }
  };

  refreshTheWeb = () => {
    this.webView && this.webView.reload();
    this.setState({
      error: null,
    });
  };

  handleLoading = (event) => {
    let url = event && event.url;
    if (url.indexOf("mailto") != -1) {
      if (Linking.canOpenURL(url)) {
        Linking.openURL(url);
        BackHandler.exitApp();
        return false;
      }
    }

    if (url) {
      let index = url.indexOf("alma-app.co");
      if (index > 0) {
        let lang = url.substring(8, index - 1);
        if (lang.length > 1) {
          if (this.state.api === BETA && lang !== BETA) {
            RNRestart.Restart();
          } else if (this.state.api != lang) {
            let urlPrefix = lang ? `${lang}.` : "www.";
            this.session_id = null;
            this.setState({
              api: lang,
              url: "https://" + urlPrefix + "alma-app.co",
            });
            this.prepareTokenAndSend();
            if (lang.indexOf(BETA) == -1) {
              storeData(LANG, lang);
            }
          }
        }
      }
    }

    if (url.includes("alma-app.co")) {
      return true;
    } else if (this.isItWidget(url)) {
      return true;
    } else if (url.includes("http") && !url.includes("alma-app.co")) {
      this.toggleModal(true, event.url);
    }
    return false;
  };

  isItWidget = (url) => {
    let type = null;
    this.state.validUrls.forEach((validUrl) => {
      if (url.includes(validUrl.url)) {
        if (validUrl.type == "negative") {
          type = "negative";
        } else if (validUrl.type == "normal" && !type) {
          type = "normal";
        }
      }
    });
    return type && type == "normal";
  };

  checkSystemPermissions = () => {
    if (Platform.OS == "ios") {
      Promise.all([check(PERMISSIONS.IOS.MICROPHONE), check(PERMISSIONS.IOS.CAMERA)]).then(() => {
        this.requestAllIOS();
      });
    } else {
      this.requestAllAndroid();
    }
  };

  requestAllIOS = async () => {
    const micStatus = await request(PERMISSIONS.IOS.MICROPHONE);
    const camStatus = await request(PERMISSIONS.IOS.CAMERA);
    let permissionsAllowed = (micStatus == "granted" && camStatus == "granted");
    this.setState({
      permissionsAllowed: permissionsAllowed,
    });
    return { micStatus, camStatus };
  };

  requestAllAndroid = async () => {
    let granted1 = false;
    let granted2 = false;
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Permissions for write access",
            message: "Give permission to your storage to write a file",
            buttonPositive: "ok",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          granted1 = true;
        }
      } catch (err) {
        console.warn(err);
      }
    }
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: "Permissions for write access",
            message: "Give permission to your storage to write a file",
            buttonPositive: "ok",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("You can use the camera");
          granted2 = true;
        } else {
          console.log("permission denied");
        }
      } catch (err) {
        console.warn(err);
      }
    }
    let permissionsAllowed = granted1 && granted2 && granted3;
    this.setState({
      permissionsAllowed: permissionsAllowed,
    });
  };

  removeLoading = () => {
    if (this.state.visible) {
      this.setLoading(false);
    }
  };

  setLoading = (value) => {
    if (this.state.visible != value) {
      this.setState({
        visible: value,
      });
    }
  };

  getStream = async (fn) => {
      let isFront = true,
          granted = true,
          value;
      if(Platform.OS == "android") {
        value = await AsyncStorage.getItem("cameraPermissions");
        if(value)
          granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
      }
      mediaDevices.enumerateDevices().then(sourceInfos => {
        let videoSourceId;
        for (let i = 0; i < sourceInfos.length; i++) {
          const sourceInfo = sourceInfos[i];
          if(sourceInfo.kind == "videoinput" && sourceInfo.facing == (isFront ? "front" : "environment")) {
            videoSourceId = sourceInfo.deviceId;
          }
        }
        mediaDevices.getUserMedia({
          audio: true,
          video: (granted ? {
            frameRate: 60,
            facingMode: (isFront ? "user" : "environment"),
            deviceId: videoSourceId,
          } : false),
        })
        .then(async (stream) => {
            if(Platform.OS == "android") {
              await AsyncStorage.setItem("cameraPermissions", "true");
            }
            this.setState({
              userVideo: stream.toURL(),
              userFullVideo: stream
            });
            fn();
        })
        .catch(error => {
          this.webView.injectJavaScript(`
            must_permissions();
          `)
        });
      });
  };
  render() {
   return <this.cameraDevice />;
    if (!this.state.url) return <RenderLoading />;
    if (!this.state.fingerprint) return <RenderLoading />;
    
    let url = this.state.isBeta ? BETA_URL : this.state.url;
    // let url = "https://www.23rjwioejwoei.com/";
    let webViewIsVisible = (this.state.error ? false : true);
    let headers = this.getHeaders();
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={"dark-content"} translucent={false} />
        <DebugView
          data={[
            //`Fingerprint:${JSON.stringify(this.state.fingerprint)}`,
            //`Notification-Payload:${this.state.notificationPayload}`,
            //`Url-Payload:${this.state.urlPayload}`,
            //`App-Place:${JSON.stringify(this.state.location)}`,
            //`App-Place-Cached:${this.state.cachedLocation}`,
            //`IsFirstInstall = ${this.state.isFirstInstall ? "TRUE" : "FALSE"}`,
            //`Progress: ${this.state.progress}`,
            //`URL: ${url}`,
            `Alma-Premium": ${this.state.subscriptionId}`,
            //`Contacts-Permissions: ${this.state.contactsStatus}`,
          ]}
          visible={false}
        />
        <View style={styles.content}>
          <View style={styles.webView}>
            {webViewIsVisible && (
              <KeyboardAwareView>
                {this.state.videosAreVisible && <VideoChatView lang={this.state.lang} webView={this.webView} premiumStatus={this.state.premiumStatus} vipStatus={this.state.vipStatus} userVideo={this.state.userVideo} userFullVideo={this.state.userFullVideo} partnerVideo={this.state.partnerVideo} partnerFullVideo={this.state.partnerFullVideo} blurVideo={this.state.blurVideo} />}
                <CustomWebView
                  onRef={(ref) => {
                    this.webView = ref;
                  }}
                  source={{
                    uri: url,
                    headers: headers,
                  }}
                  userAgent={this.state.userAgent}
                  onLoadProgress={({ nativeEvent }) => {
                    if (nativeEvent.progress == 1) {
                      this.removeLoading();
                    }
                    if (this.state.visible && this.webView) {
                      this.webView.injectJavaScript(DetectTopLoaderScript);
                    }
                    this.setState({
                      progress: nativeEvent.progress,
                    });
                  }}
                  onShouldStartLoadWithRequest={(event) => {
                    return this.handleLoading(event);
                  }}
                  onMessage={(event) => {
                    this.handleMessage(event);
                  }}
                  onError={() => this.handleError()}
                />
              </KeyboardAwareView>
            )}
            <LogoDashView visible={this.state.visible} />
            <TouchBlockView progress={this.state.progress} />
            {this.state.error && <ErrorView error={this.state.error} onPress={this.refreshTheWeb} />}
          </View>
          <Modal
            isVisible={this.state.modalVisible}
            onBackButtonPress={() => this.setModalVisible(false)}
            onBackdropPress={() => this.setModalVisible(false)}
          >
            <View style={styles.modal}>
              <View style={styles.modalTop}>
                <TouchableOpacity
                  style={styles.modalClose}
                  onPress={() => this.setModalVisible(false)}
                >
                  <FontAwesomeIcon icon={faTimes} size={20} />
                </TouchableOpacity>
              </View>
              <WebView
                source={{ uri: this.state.urlSite }}
                style={styles.modalWeb}
                scalesPageToFit={true}
              />
            </View>
          </Modal>
        </View>
        <LoadingView visible={this.state.isPurchaseTransaction} />
      </SafeAreaView>
    );
  }

  getHeaders() {
    return {
      "App-Version": APP_VERSION,
      Auth: DEVICE_ID,
      "App-Alma-Validation-Code":
        "N7Ab6db&676GS^BZN7dt!BA6$7CDGkod87bGSDgdbaj",
      Fingerprint: this.state.fingerprint
        ? JSON.stringify(this.state.fingerprint)
        : "",
      "Notification-Payload": this.state.notificationPayload
        ? JSON.stringify(this.state.notificationPayload)
        : "",
      "Url-Payload": this.state.urlPayload || "",
      "App-Place": this.state.location
        ? JSON.stringify(this.state.location)
        : this.state.cachedLocation,
      "Contacts-Permissions": this.state.contactsStatus,
      "Alma-Premium": this.state.subscriptionId
        ? JSON.stringify(this.state.subscriptionId)
        : "",
    };
  }
  closePeer = () => {
    let con = this.state.peerCon;
    this.setState({
      peerCon: null,
    });
    if (this.state.peerCall) {
      this.state.peerCall.close();
    }
    if (!con || !con.peerConnection) {
      return;
    }
    con.peerConnection.close();
    if (con.close) {
      con.close();
    }
  };
  connectPeer = () => {
    if(!this.sessionConnected && this.state.userPeer) {
      this.state.userPeer.disconnect();
    }
    this.closePeer();
    this.getStream(() => {
      let userPeer = new Peer({
        host: "peer-server.alma-app.co",
				key: "Alma9m4ix8an$cjsnzAHm",
				port: 9000,
				secure: true,
				path: "/mainAlmaApp",
        config: {
          iceServers: [
            {
              urls: [
                "stun:s1.stun.alma-app.co:3487",
                "stun:s2.stun.alma-app.co:3487",
                "stun:s3.stun.alma-app.co:3487"
              ]
            },
            {
              username: "AL8djsaldcm",
              credential: "pOSIC8jajuxcuNAI$SJX8sh#s",
              urls: [
                "turn:s1.turn.alma-app.co:3487?transport=udp",
                "turn:s1.turn.alma-app.co:3487?transport=tcp",
                "turn:s2.turn.alma-app.co:3487?transport=udp",
                "turn:s2.turn.alma-app.co:3487?transport=tcp",
                "turn:s3.turn.alma-app.co:3487?transport=udp",
                "turn:s3.turn.alma-app.co:3487?transport=tcp",
              ]
            }
          ]
        }
      });
      this.setState({
        userPeer: userPeer
      });
      userPeer.on("open", (peerId) => {
        console.log("test");
        this.setState({
          myPeerId: peerId
        });
        this.webView.injectJavaScript(`
          change_my_peer_id("${peerId}");
        `);
        if(this.state.activeScreen == Screens.VideoChat && this.sessionConnected) {
          console.log("Start waiting on connectPeer()");
          this.webView.injectJavaScript(`
            start_waiting_chat();
          `);
        }
        userPeer.on("connection", (peerConnection) => {
          console.log("Find an optional partner")
          this.setState({
            peerCon: peerConnection,
          });
          peerConnection.on("close", () => {
            console.log("Chat Done")
            clearTimeout(this.blurVideoTimeout);
            this.setState({
              blurVideo: true,
              peerCall: null,
              partnerFullVideo: null,
              partnerVideo: null,
              peerCon: null,
            });
            InCallManager.stop();
          });
        });
        userPeer.on("call", async (call) => {
          await InCallManager.checkRecordPermission();
          InCallManager.start({media: 'video'});
          InCallManager.setKeepScreenOn(true);
          if(this.state.isHeadphonesConnected) {
            if(Platform.OS == "android") {
              InCallManager.setSpeakerphoneOn(false);
            }
            InCallManager.setForceSpeakerphoneOn(false);
          }
          else {
            if(Platform.OS == "android") {
              InCallManager.setSpeakerphoneOn(true);
            }
            InCallManager.setForceSpeakerphoneOn(true);
          }
          call.answer(this.state.userFullVideo);
          call.on("stream", (partnerStream) => {
            this.blurVideoTimeout = setTimeout(() => {
              this.setState({
                blurVideo: false,
              });
            }, 2500);
            this.setState({
              peerCall: call,
              partnerFullVideo: partnerStream,
              partnerVideo: partnerStream.toURL()
            });
          });
        });
      });
    });
  };
  handleMessage = (message) => {
    var nativeData = message && message.nativeEvent && message.nativeEvent.data;
    let data = nativeData ? JSON.parse(nativeData) : null;
    if (!data) return;
    if (data.message === Event.PartnerPeerIdChanged) {
      console.log("PartnerPeerIdChanged Hook Called");
      let partnerPeerId = data.data;
      if (partnerPeerId != this.state.partnerPeerId) {
        console.log("Old:", this.state.partnerPeerId);
        if(this.state.activeScreen != Screens.VideoChat) {
          partnerPeerId = null;
          this.closePeer();
          clearTimeout(this.blurVideoTimeout);
          this.setState({
            blurVideo: true,
            peerCall: null,
            partnerFullVideo: null,
            partnerVideo: null,
            peerCon: null,
          });
          InCallManager.stop();
        }
        else if(partnerPeerId == "") {
          partnerPeerId = null;
          this.closePeer();
          clearTimeout(this.blurVideoTimeout);
          this.setState({
            blurVideo: true,
            peerCall: null,
            partnerFullVideo: null,
            partnerVideo: null,
            peerCon: null,
          });
          InCallManager.stop();
          if(this.state.activeScreen == Screens.VideoChat && this.sessionConnected && this.state.userVideo) {
            console.log("Start waiting chat on PartnerPeerIdChanged hook called");
            this.webView.injectJavaScript(`
              start_waiting_chat();
            `);
          }
        }
        this.setState({
          partnerPeerId: partnerPeerId,
        });
        if(partnerPeerId) {
          console.log("Valid Partner ID found:", partnerPeerId);
          let peerConnection = this.state.userPeer.connect(partnerPeerId);
          this.setState({
            peerCon: peerConnection,
          });
          console.log("Start connection process...", partnerPeerId);
          peerConnection.on("open", async () => {
            let call = this.state.userPeer.call(partnerPeerId, this.state.userFullVideo);
            console.log("Sending the request...");
            await InCallManager.checkRecordPermission();
            InCallManager.start({media: 'video'});
            InCallManager.setKeepScreenOn(true);
            if(this.state.isHeadphonesConnected) {
              if(Platform.OS == "android") {
                InCallManager.setSpeakerphoneOn(false);
              }
              InCallManager.setForceSpeakerphoneOn(false);
            }
            else {
              if(Platform.OS == "android") {
                InCallManager.setSpeakerphoneOn(false);
              }
              InCallManager.setForceSpeakerphoneOn(true);
            }
            call.on("stream", (partnerStream) => {
              console.log("Chat Started!");
              this.blurVideoTimeout = setTimeout(() => {
                this.setState({
                  blurVideo: false,
                });
              }, 2500);
              this.setState({
                peerCall: call,
                partnerFullVideo: partnerStream,
                partnerVideo: partnerStream.toURL()
              });
            });
          });
          peerConnection.on("close", () => {
            inConnectionProcess = true;
            console.log("Chat Done (Define on PartnerPeerIdChanged hook)");
            clearTimeout(this.blurVideoTimeout);
            this.setState({
              blurVideo: true,
              peerCall: null,
              partnerFullVideo: null,
              partnerVideo: null,
              peerCon: null,
            });
            InCallManager.stop();
          });
        }
      }
    } else if (data.message === Event.PremiumStatusChanged) {
      let premiumStatus = parseInt(data.data);
      if (premiumStatus != this.state.premiumStatus) {
        this.setState({
          premiumStatus: premiumStatus,
        });
      }
    } else if (data.message === Event.VipStatusChanged) {
      let vipStatus = parseInt(data.data);
      if (vipStatus != this.state.vipStatus) {
        this.setState({
          vipStatus: vipStatus,
        });
      }
    } else if (data.message === Event.ConnectedChanged) {
      this.sessionConnected = parseInt(data.data);
      if(!this.sessionConnected) {
        this.setState({
          videosAreVisible: false,
        });
      }
    } else if (data.message === Event.TheLangChanged) {
      let lang = data.data;
      if(lang == "beta")
        lang = "il";
      if (lang != this.state.lang) {
        this.setState({
          lang: lang,
        });
      }
    } else if (data.message === Event.ActiveScreenChanged) {
      clearCache();
      let activeScreen = data.data;
      if (activeScreen != this.state.activeScreen) {
        if (this.state.activeScreen && this.state.activeScreen.length > 0) {
          if (IsInterrupted(activeScreen, this.state.activeScreen)) {
            this.cancelRecording();
          }
        }
        if (activeScreen) {
          if (activeScreen == Screens.Chat) {
            this.checkSystemPermissions();
          }
          if(activeScreen == Screens.Chat || activeScreen == Screens.VipStart) {
            this.updateLocation((this.locationRequsted ? false : true));
          }
          if(activeScreen == Screens.VideoChat) {
            this.connectPeer();
            this.setState({
              videosAreVisible: true,
            });
          }
          else {
            this.closePeer();
            clearTimeout(this.blurVideoTimeout);
            this.setState({
              blurVideo: true,
              peerCall: null,
              partnerFullVideo: null,
              partnerVideo: null,
              peerCon: null,
              userVideo: null,
              userFullVideo: null,
              videosAreVisible: false,
            });
            InCallManager.stop();
          }
          this.setState({
            activeScreen: activeScreen,
          });
        }
      }
    } else if (data.message == Event.RecordingStateChanged) {
      publishLocation(this.state.location, this.state.api, data.session_id);

      publishPayload(this.state.urlPayload, this.state.api, data.session_id);

      publishNotification(
        this.state.notificationPayload,
        this.state.api,
        data.session_id
      );
      publishSubscription(
        this.state.subscription,
        this.state.api,
        data.session_id
      );
      this.session_id = data.session_id;
      if (data.data === "none") {
        this.cancelRecording();
      } else if (data.data == "recording") {
        if (this.state.permissionsAllowed) this.startRecording(data.session_id);
        else this.stopRecording(data.session_id);
      } else if (data.data == "sending") {
        this.stopRecording(data.session_id);
      }
    } else if (data.message == Event.LocationRequest) {
      this.updateLocation(this.locationRequsted ? false : true);
    } else if (data.message == Event.ContactsRequest) {
      this.updateContacts(this.state.api, this.session_id);
    } else if (data.message == Event.TopLoaderDetected) {
      this.removeLoading();
    } else if (data.message == Event.SessionIdDetected) {
      if (data.session_id) {
        this.clearSessionTimer();
        this.session_id = data.session_id;
        publishLocation(this.state.location, this.state.api, data.session_id);
        publishPayload(this.state.urlPayload, this.state.api, data.session_id);
        publishNotification(
          this.state.notificationPayload,
          this.state.api,
          data.session_id
        );
        publishSubscription(
          this.state.subscription,
          this.state.api,
          data.session_id
        );
      }
    } else if (data.message == Event.Subscribe) {
      this.subscriptionIAP(data.type);
    } else if (data.message == Event.Purchase) {
      this.purchaseIAP(data.type);
    } else if (data.message == Event.RestorePurchases) {
      this.restoreIAP();
    } else {
    }
  };
}
