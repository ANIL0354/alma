import { Platform } from "react-native";
import DeviceInfo from "react-native-device-info";
import AsyncStorage from "@react-native-async-storage/async-storage";
const randomUseragent = require("random-useragent");

import {
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  OutputFormatAndroidType,
} from "react-native-audio-recorder-player";

export const AudioSet = Platform.select({
  ios: {
    AVSampleRateKeyIOS: 44100,
    AVNumberOfChannelsKeyIOS: 1,
    AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.low,
    AVFormatIDKeyIOS: AVEncodingOption.aac,
  },
  android: {
    AudioSourceAndroid: AudioSourceAndroidType.MIC,
    OutputFormatAndroid: OutputFormatAndroidType.AAC_ADTS,
    AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
    AudioSamplingRateAndroid: 44100,
  },
});

export const MAIN_URL = "https://alma-app.co/";
export const BETA_URL =
  "https://beta.alma-app.co/?serial=ufd8783fsdj9uwsahf87wnc8g6fdtad8sa46w740acn08";

export const BETA = "beta";

export const SECRET_KEY = "OS3g6zgyLBRgGTSUeV7wpOhCX6co1nudMFHtKT3UhSJKAPRM";

export const InjectedJavaScriptFirst = `const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=1'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta);`;

export const Event = {
  TheLangChanged: "TheLangChanged",
  ConnectedChanged: "ConnectedChanged",
  ActiveScreenChanged: "ActiveScreenChanged",
  PremiumStatusChanged: "PremiumStatusChanged",
  VipStatusChanged: "VipStatusChanged",
  PartnerPeerIdChanged: "PartnerPeerIdChanged",
  BannerAd: "BannerAd",
  RecordingStateChanged: "RecordingStateChanged",
  Debug: "Debug",
  BackValue: "BackValue",
  LocationRequest: "LocationRequest",
  ContactsRequest: "ContactsRequest",
  TopLoaderDetected: "TopLoaderDetected",
  SessionIdDetected: "SessionIdDetected",
  Subscribe: "Subscribe",
  Purchase: "Purchase",
  RestorePurchases: "RestorePurchases",
};

export const InjectedJavaScript = `  

theLang = document.getElementById('the-lang');
if (theLang) {
  var data = {
    message : '${Event.TheLangChanged}',
    data: theLang.value
  };
  window.ReactNativeWebView.postMessage(JSON.stringify(data));
  if (!this.theLangObserver) {
    this.theLangObserver = new MutationObserver(function(mutations) {
      if (mutations && mutations.length > 0){
        if (mutations[0].attributeName == "value") {		
          var data = {
            message : '${Event.TheLangChanged}',
            data: theLang.value,
          };
          window.ReactNativeWebView.postMessage(JSON.stringify(data));
        }
      } 
    });
    this.theLangObserver.observe(theLang, {
      attributes: true,
      attributeFilter: ["value"]
    });
  }
}

  connected = document.getElementById('connected');
  if (connected) {
    var data = {
      message : '${Event.ConnectedChanged}',
      data: connected.value
    };
    window.ReactNativeWebView.postMessage(JSON.stringify(data));
    if (!this.connectedObserver) {
      this.connectedObserver = new MutationObserver(function(mutations) {
        if (mutations && mutations.length > 0){
          if (mutations[0].attributeName == "value") {		
            var data = {
              message : '${Event.ConnectedChanged}',
              data: connected.value,
            };
            window.ReactNativeWebView.postMessage(JSON.stringify(data));
          }
        } 
      });
      this.connectedObserver.observe(connected, {
        attributes: true,
        attributeFilter: ["value"]
      });
    }
  }

  input = document.getElementById('active-screen');
  if (input) {
    var data = {
      message : '${Event.ActiveScreenChanged}',
      data: input.value
    };
    window.ReactNativeWebView.postMessage(JSON.stringify(data));
    if (!this.inputObserver) {
      this.inputObserver = new MutationObserver(function(mutations) {
        if (mutations && mutations.length > 0){
          if (mutations[0].attributeName == "value") {		
            var data = {
              message : '${Event.ActiveScreenChanged}',
              data: input.value,
            };
            window.ReactNativeWebView.postMessage(JSON.stringify(data));
          }
        } 
      });
      this.inputObserver.observe(input, {
        attributes: true,
        attributeFilter: ["value"]
      });
    }
  }

  premiumStatus = document.getElementById('premium-status');
  if (premiumStatus) {
    var data = {
      message : '${Event.PremiumStatusChanged}',
      data: premiumStatus.value
    };
    window.ReactNativeWebView.postMessage(JSON.stringify(data));
    if (!this.premiumStatusObserver) {
      this.premiumStatusObserver = new MutationObserver(function(mutations) {
        if (mutations && mutations.length > 0){
          if (mutations[0].attributeName == "value") {		
            var data = {
              message : '${Event.PremiumStatusChanged}',
              data: premiumStatus.value,
            };
            window.ReactNativeWebView.postMessage(JSON.stringify(data));
          }
        } 
      });
      this.premiumStatusObserver.observe(premiumStatus, {
        attributes: true,
        attributeFilter: ["value"]
      });
    }
  }

  vipStatus = document.getElementById('vip-status');
  if (vipStatus) {
    var data = {
      message : '${Event.VipStatusChanged}',
      data: vipStatus.value
    };
    window.ReactNativeWebView.postMessage(JSON.stringify(data));
    if (!this.vipStatusObserver) {
      this.vipStatusObserver = new MutationObserver(function(mutations) {
        if (mutations && mutations.length > 0){
          if (mutations[0].attributeName == "value") {		
            var data = {
              message : '${Event.VipStatusChanged}',
              data: vipStatus.value,
            };
            window.ReactNativeWebView.postMessage(JSON.stringify(data));
          }
        } 
      });
      this.vipStatusObserver.observe(vipStatus, {
        attributes: true,
        attributeFilter: ["value"]
      });
    }
  }

  partnerPeerId = document.getElementById('partner-peer-id');
  if (partnerPeerId) {
    var data = {
      message : '${Event.PartnerPeerIdChanged}',
      data: partnerPeerId.value
    };
    window.ReactNativeWebView.postMessage(JSON.stringify(data));
    if (!this.partnerPeerIdObserver) {
      this.partnerPeerIdObserver = new MutationObserver(function(mutations) {
        if (mutations && mutations.length > 0){
          if (mutations[0].attributeName == "value") {		
            var data = {
              message : '${Event.PartnerPeerIdChanged}',
              data: partnerPeerId.value,
            };
            window.ReactNativeWebView.postMessage(JSON.stringify(data));
          }
        } 
      });
      this.partnerPeerIdObserver.observe(partnerPeerId, {
        attributes: true,
        attributeFilter: ["value"]
      });
    }
  }

  recording = document.getElementById('recording-state');
  if (recording) {
    var data = {
      message : '${Event.RecordingStateChanged}',
      data: recording.value,
      session_id: document.getElementById('session-id').value,
    };
    window.ReactNativeWebView.postMessage(JSON.stringify(data));
    if (!this.recordingObserver) {
      this.recordingObserver = new MutationObserver(function(mutations) {
        if (mutations && mutations.length > 0){
          if (mutations[0].attributeName == "value") {		
            var data = {
              message : '${Event.RecordingStateChanged}',
              data: recording.value,
              session_id: document.getElementById('session-id').value,
            };
            window.ReactNativeWebView.postMessage(JSON.stringify(data));
          }
        } 
      });
      this.recordingObserver.observe(recording, {
        attributes: true,
        attributeFilter: ["value"]
      });
    }
  }

  locationButtons = document.getElementsByClassName('locations-permission');
  for (var i = 0; i < locationButtons.length; i++) {
    if (!locationButtons[i].isTouchListenerAdded) {
      locationButtons[i].isTouchListenerAdded = true;
      locationButtons[i].addEventListener('touchstart', function() {
        var data = {
          message : '${Event.LocationRequest}',
        };
        window.ReactNativeWebView.postMessage(JSON.stringify(data));
      });
    }
  }

  contactsButtons = document.getElementsByClassName('contacts-permission');
  for (var i = 0; i < contactsButtons.length; i++) {
    if (!contactsButtons[i].isTouchListenerAdded) {
      contactsButtons[i].isTouchListenerAdded = true;
      contactsButtons[i].addEventListener('touchstart', function() {
        var data = {
          message : '${Event.ContactsRequest}',
        };
        window.ReactNativeWebView.postMessage(JSON.stringify(data));
      });
    }
  }

  subscriptionButtons = document.getElementsByClassName('continue-payment');
  if (subscriptionButtons && subscriptionButtons.length) {
    subscriptionButton = subscriptionButtons[0];
    if (!subscriptionButton.isTouchListenerAdded) {
      subscriptionButton.isTouchListenerAdded = true;
      subscriptionButton.addEventListener('click', function() {
        var data = {
          message : '${Event.Subscribe}',
          type: subscriptionButton.dataset.type,
        };
        window.ReactNativeWebView.postMessage(JSON.stringify(data));
      });
    }
  }

  paymentButtons = document.getElementsByClassName('continue-buy-coins');
  if (paymentButtons && paymentButtons.length) {
    paymentButton = paymentButtons[0];
    if (!paymentButton.isTouchListenerAdded) {
      paymentButton.isTouchListenerAdded = true;
      paymentButton.addEventListener('click', function() {
        var data = {
          message : '${Event.Purchase}',
          type: paymentButton.dataset.type,
        };
        console.log("click");
        window.ReactNativeWebView.postMessage(JSON.stringify(data));
      });
    }
  }

  restoreButtons = document.getElementsByClassName('restore-payment');
  for (var i = 0; i < restoreButtons.length; i++) {
    if (!restoreButtons[i].isTouchListenerAdded) {
      restoreButtons[i].isTouchListenerAdded = true;
      restoreButtons[i].addEventListener('click', function() {
        var data = {
          message : '${Event.RestorePurchases}',
        };
        window.ReactNativeWebView.postMessage(JSON.stringify(data));
      });
    }
  }
`;

export const InjectedSwapScript = `  

  swapButtons = document.getElementsByClassName('close-btn');
  var data = {
    message : '${Event.Debug}',
    count: swapButtons.length,
  };
  window.ReactNativeWebView.postMessage(JSON.stringify(data)); 
  if (swapButtons.length > 0) {
    swapButtons[0].click();
    var data = {
      message : '${Event.Debug}',
      action: "onPress",
    };
    window.ReactNativeWebView.postMessage(JSON.stringify(data)); 
  }

`;

export const InjectedVipScript = ``;

export const SplashScript = `

`;

export const DetectTopLoaderScript = `
  topLoader = document.getElementById('top-loader');
    
  if (topLoader) {
    var data = {
      message : '${Event.TopLoaderDetected}',
    };
    window.ReactNativeWebView.postMessage(JSON.stringify(data));
  }
`;

export const DetectSessionIdScript = `
  sessionId = document.getElementById('session-id');
    
  if (sessionId) {
    var data = {
      message : '${Event.SessionIdDetected}',
      session_id: sessionId.value,
    };
    window.ReactNativeWebView.postMessage(JSON.stringify(data));
  }
`;

export const TestInject = `
  testElements = document.getElementById('top-loader');

  var data = {
    message : '${Event.TopLoaderDetected}',
    count: testElements ? "TRUE" : "FALSE",
  };
  window.ReactNativeWebView.postMessage(JSON.stringify(data));
`;

export const DEVICE_ID = DeviceInfo.getUniqueId()._W;

const AGENT_IOS = `Mozilla/5.0 (iPhone; CPU iPhone OS 14_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148`;

const AGENT_ANDROID = `Mozilla/5.0 (Linux; Android 9; ZTE Blade A7 2020 Build/PPR1.180610.011; wv; Nony/17.0; DeviceId ${DEVICE_ID}) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/86.0.4240.198 Mobile Safari/537.36`;

export const UserAgent = Platform.select({
  ios: AGENT_IOS,
  android: AGENT_ANDROID,
});

export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    }
  } catch (e) {
    return null;
  }
};

export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    // saving error
  }
};

export const Screens = {
  ChatStart: "chat-start",
  Info: "sharewall-start",
  VipStart: "vip-start",
  Info2: "notifications-start",
  Settings: "settings-start",
  Chat: "chat-chat",
  VideoChat: "chat-video-chat",
  ChatWaiting: "chat-waiting",
  ChatEnd: "chat-end",
  NewPost: "nonys-newpost",
  NonyStart: "nonys-start",
};

export const IsBottomScreen = (screen) => {
  return (
    screen == Screens.ChatStart ||
    screen == Screens.Info ||
    screen == Screens.VipStart ||
    screen == Screens.Info2 ||
    screen == Screens.Settings
  );
};

export const IsInterrupted = (newScreen, oldScreen) => {
  return (
    oldScreen == Screens.Chat &&
    (newScreen == Screens.ChatWaiting || newScreen == Screens.ChatEnd)
  );
};

export const GOOGLE = "google";
export const FACEBOOK = "facebook";

const isIOS = (userAgent) => {
  if (userAgent.indexOf("iPhone;") > 0) return true;
  if (userAgent.indexOf("iPad;") > 0) return true;
  if (userAgent.indexOf("iPod touch;") > 0) return true;
  if (userAgent.indexOf("iPod;") > 0) return true;
  return false;
};

const getUserAgent = () => {
  return randomUseragent.getRandom((ua) => {
    let osName = Platform.OS === "ios" ? "iOS" : "Android";
    return ua.osName === osName;
  });
};

export const generateUserAgent = () => {
  let userAgent = getUserAgent();
  if (Platform.OS === "ios") {
    while (!isIOS(userAgent)) {
      userAgent = getUserAgent();
    }
  } else {
    while (isIOS(userAgent)) {
      userAgent = getUserAgent();
    }
  }
  return userAgent;
};
