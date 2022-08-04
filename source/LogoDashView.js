/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";

const imageLogo = require("./images/logoDash.png");
const imageLoading = require("./images/loading2.gif");

export default ({ visible }) => {
  if (!visible) return null;
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={imageLogo} style={styles.imageLogo} />
      </View>
      <Image source={imageLoading} style={styles.imageLoading} />
    </View>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: StyleSheet.flatten([
    StyleSheet.absoluteFillObject,
    {
      backgroundColor: "#ffffffff",
      justifyContent: "space-around",
      alignItems: "center",
      justifyContent: "center",
    },
  ]),
  content: {
    width: width * 0.5,
    height: height * 0.5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    alignSelf: "center",
    position: "absolute",
    bottom: "60%",
  },
  imageLogo: {
    width: width * 0.5,
    height: width * 0.5,
    resizeMode: "contain",
  },
  imageLoading: {
    width: width * 0.2,
    height: height * 0.2,
    resizeMode: "contain",
    alignSelf: "center",
  },
});
