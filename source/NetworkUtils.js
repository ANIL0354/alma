import { Dimensions } from "react-native";
import CookieManager from "@react-native-cookies/cookies";
import DeviceInfo from "react-native-device-info";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

import { print } from "./Logger";

const SECRET_CODE = "N7Ab6db&676GS^BZN7dt!BA6$7CDGkod87bGSDgdbaj";
const APP_FIRST_RUN = "INSTALL_TIME";

export const onPopupOpened = (deviceId, userAgent, appVersion, url) => {
  var urlPost = "https://www.alma-app.co/log-popups.php";
  const body = JSON.stringify({
    valid_code: SECRET_CODE,
    url: url,
  });
  fetch(urlPost, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "App-Version": appVersion,
      Auth: deviceId,
      "App-Alma-Validation-Code":
        "N7Ab6db&676GS^BZN7dt!BA6$7CDGkod87bGSDgdbaj",
      "User-Agent": userAgent,
    },
    body: body,
  })
    .then((response) => response.text())
    .then((text) => {
      console.log("onPopupOpened RESPONSE =>", text);
    })
    .catch((error) => {
      console.log("onPopupOpened ERROR =>", error);
    });
};

export const clearCache = () => {
  CookieManager.clearAll().then((success) => {
    if (!success) {
      console.log("CookieManager.clearAll() FAILED");
    }
  });
};

const getScreenSize = () => {
  const { width, height } = Dimensions.get("screen");
  return `${width}x${height}`;
};

const getInstallTime = () =>
  new Promise((resolve) => {
    AsyncStorage.getItem(APP_FIRST_RUN).then((data) => {
      installtime = parseInt(data);
      if (!installtime) {
        installtime = moment().valueOf();
        AsyncStorage.setItem(APP_FIRST_RUN, `${installtime}`);
      }
      resolve(installtime);
    });
  });

export const getFingerprint = () =>
  new Promise(async (resolve) => {
    let resolution = getScreenSize();
    let installtime = null;
    let userAgent = null;

    print("GET FINGERPRINT START");

    Promise.all([getInstallTime(), DeviceInfo.getUserAgent()]).then((data) => {
      installtime = data[0];
      userAgent = data[1];
      print("GET FINGERPRINT  DONE");
      resolve({
        installtime: installtime,
        userAgent: userAgent,
        size: resolution,
      });
    });
  });

export const parseDeepLink = (route) => {
  if (!route) return null;
  let baseUrl = "alma-app.co/action/";
  let startIndex = route.indexOf(baseUrl);
  let length = baseUrl.length;
  if (startIndex > -1) {
    let action = route.substring(startIndex + length);
    return action;
  }
  return route;
};
