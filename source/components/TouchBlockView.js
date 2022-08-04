import React from "react";
import { StyleSheet, View, TouchableWithoutFeedback } from "react-native";

export default ({ progress }) => {
  let visible = progress < 0.5;
  if (!visible) return null;
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => console.log("BLOCK TOUCH")}>
        <View style={styles.content} />
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: StyleSheet.absoluteFill,
  content: {
    flex: 1,
    alignSelf: "stretch",
    backgroundColor: "transparent",
  },
});
