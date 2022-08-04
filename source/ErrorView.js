/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";

const imageLogo = require("./images/logoDash.png");

export default ({ error, onPress }) => {
  if (!error) return null;
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={imageLogo} style={styles.imageLogo} />
        {error.title && <Text style={styles.title}>{error.title}</Text>}
        {error.message && <Text style={styles.message}>{error.message}</Text>}
        <TouchableOpacity style={styles.button} onPress={onPress}><Text style={styles.buttonText} >Try Again</Text></TouchableOpacity>
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: StyleSheet.flatten([
    StyleSheet.absoluteFill,
    {
      justifyContent: "center",
      alignItems: "center",

      backgroundColor: "white",
    },
  ]),
  content: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 100,
  },
  title: {
    fontWeight: "bold",
    color: "black",
    marginHorizontal: 20,
    textAlign: "center",
    fontSize: 20,
  },
  message: {
    marginTop: 10,
    color: "black",
    marginHorizontal: 20,
    textAlign: "center",
    fontSize: 16,
    marginBottom: 70,
  },
  imageLogo: {
    width: width * 0.5,
    height: width * 0.5,
    resizeMode: "contain",
  },
  button: {
    backgroundColor: "#ee3e55",
    width: width * 0.5,
    height: 50,
    flex: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10
  },
  buttonText: {
    fontSize: 16,
    color: "#FFF"
  }
});
