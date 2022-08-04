import React from "react";
import { Button, View, StyleSheet, SafeAreaView } from "react-native";

import Banner from "./Banner";
import Interstitial from "./Interstitial";

export default class extends React.Component {
  showFullScreen = () => {
    Interstitial.show();
  };

  /*
   * banner (320x50, Standard Banner for Phones and Tablets)
   * largeBanner (320x100, Large Banner for Phones and Tablets)
   * mediumRectangle (300x250, IAB Medium Rectangle for Phones and Tablets)
   * fullBanner (468x60, IAB Full-Size Banner for Tablets)
   * leaderboard (728x90, IAB Leaderboard for Tablets)
   * smartBannerPortrait (Screen width x 32|50|90, Smart Banner for Phones and Tablets)
   * smartBannerLandscape (Screen width x 32|50|90, Smart Banner for Phones and Tablets)
   * */

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Button title={"Show FullScreen Ad"} onPress={this.showFullScreen} />
        <View style={styles.separator} />
        <Banner />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "space-around",
  },
  separator: {
    height: 20,
  },
  banner: {
    width: "100%",
    height: 200,
    backgroundColor: "green",
  },
});
