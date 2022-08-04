import { PermissionsAndroid, Platform } from "react-native";
import Geolocation from "@react-native-community/geolocation";
import { PERMISSIONS, check, request, RESULTS } from "react-native-permissions";
import { print } from "./Logger";

export const requestLocation = () =>
  new Promise((resolve) => {
    if (Platform.OS === "android") {
      resolve(checkPermissions());
    } else {
      resolve(checkIOSPermission());
    }
  });

const checkIOSPermission = () => {
  return new Promise((resolve) => {
    check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
      .then((result) => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            print(
              "PERMISSIONS This feature is not available (on this device / in this context)"
            );
            break;
          case RESULTS.DENIED:
            print(
              "PERMISSIONS The permission has not been requested / is denied but requestable"
            );
            resolve(requestIOSPermissions());
            break;
          case RESULTS.LIMITED:
            print(
              "PERMISSIONS The permission is limited: some actions are possible"
            );
            resolve(requestIOSPermissions());
            break;
          case RESULTS.GRANTED:
            print("PERMISSIONS The permission is granted");
            resolve(updateLocation());
            break;
          case RESULTS.BLOCKED:
            print(
              "PERMISSIONS The permission is denied and not requestable anymore"
            );
            break;
        }
      })
      .catch((error) => {
        // …
      });
  });
};

const checkPermissions = () =>
  new Promise((resolve) => {
    PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    ).then((response) => {
      if (!response) {
        resolve(requestPermissions());
      } else {
        resolve(updateLocation());
      }
    });
  });

const requestPermissions = () =>
  new Promise(async (resolve) => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Alma",
          message: "Your location is required for some benefits for you",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        resolve(updateLocation());
      }
    } catch (err) {
      print("PERMISSIONS requestPermissions ERROR =>", err);
    }
  });

const requestIOSPermissions = () =>
  new Promise(async (resolve) => {
    request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then((result) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          print(
            "PERMISSIONS This feature is not available (on this device / in this context)"
          );
          break;
        case RESULTS.DENIED:
          print(
            "PERMISSIONS The permission has not been requested / is denied but requestable"
          );
          break;
        case RESULTS.LIMITED:
          print(
            "PERMISSIONS The permission is limited: some actions are possible"
          );
          break;
        case RESULTS.GRANTED:
          print("PERMISSIONS The permission is granted");
          resolve(updateLocation());
          break;
        case RESULTS.BLOCKED:
          print(
            "PERMISSIONS The permission is denied and not requestable anymore"
          );
          break;
      }
    });
  });

const updateLocation = () =>
  new Promise((resolve) => {
    Geolocation.getCurrentPosition(
      (location) => {
        let data = {
          longitude: location.coords.longitude,
          latitude: location.coords.latitude,
        };
        print("updateLocation", data);
        resolve(data);
      },
      (error) => print("PERMISSIONS getCurrentPosition ERROR =>", error),
      { enableHighAccuracy: false, timeout: 10000 }
    );
  });
