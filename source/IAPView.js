import React from "react";
import { View, Button, StyleSheet } from "react-native";
import { Alert } from "react-native";

import IAP from "./IAP";

export default class extends React.Component {
  onPress5 = () => {
    IAP.requestSubscriptionWeek();
  };

  onPress10 = () => {
    IAP.requestSubscriptionMonth();
  };

  onPressRestore = async () => {
    IAP.restorePurchases((data) => {
      console.log("IAP restorePurchases", data);
    });
  };

  onPressTest = () => {
    IAP.getCurrentSubscription((data) => {
      console.log("IAP getCurrentSubscription", data);
    });
  };

  render() {
    if (!this.props.visible) return null;
    return (
      <View style={styles.content}>
        <View style={styles.row}>
          <Button title={"Subscription 5$"} onPress={this.onPress5} />
          <Button title={"Subscription 10$"} onPress={this.onPress10} />
        </View>
        <View style={styles.row}>
          <Button title={"RESTORE"} onPress={this.onPressRestore} />
          <Button title={"TEST"} onPress={this.onPressTest} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
  row: {
    flexDirection: "row",
  },
});
