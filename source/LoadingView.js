import React from "react";
import { View, StyleSheet, Dimensions, ActivityIndicator } from "react-native";

export default ({ visible }) => {
  if (!visible) return null;
  return (
    <View style={styles.container}>
      <ActivityIndicator size={"large"} color={"white"} />
    </View>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#00000080",
    alignItems: "center",
    justifyContent: "center",
  },
  imageLoading: {
    width: width * 0.2,
    height: height * 0.2,
    resizeMode: "contain",
    alignSelf: "center",
  },
});
