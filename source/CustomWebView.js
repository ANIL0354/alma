import React, { useState } from "react";
import { Platform, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import moment from "moment";

import { InjectedJavaScriptFirst, InjectedJavaScript } from "./utils";

import { print } from "./Logger";

let timeStamp = 0;

/*
function trimChar(string, charToRemove) {
  while (string.charAt(0) == charToRemove) {
    string = string.substring(1);
  }
  while (string.charAt(string.length - 1) == charToRemove) {
    string = string.substring(0, string.length - 1);
  }
  return string;
}
*/

const urlToTimeUrl = (url) => {
  if (url.indexOf(`${timeStamp}`) > 0) {
    if (moment().valueOf() - timeStamp > 1000) {
      timeStamp = moment().valueOf();
    }
  } else {
    timeStamp = moment().valueOf();
  }

  let index1 = url.indexOf("/?time=");
  let index2 = url.indexOf("/?moment=");
  let index3 = url.indexOf("/?");

  if (index1 > 0) {
    return url.substring(0, index1) + "/?moment=" + timeStamp;
  } else if (index2 > 0) {
    return url.substring(0, index2); //trimChar(url) + "/&moment=" + timeStamp; // url.substring(0, index2);
  } else if (index3 > 0) {
    return url + "&moment=" + timeStamp;
  } else {
    return url + "/?moment=" + timeStamp;
  }
};

export default (props) => {
  const [currentURI, setURI] = useState(props.source.uri);
  const source = { ...props.source, uri: currentURI };
  
  return (
    <WebView
      {...props}
      ref={(webView) => props.onRef(webView)}
      mediaPlaybackRequiresUserAction={false}
      allowsInlineMediaPlayback={true}
      source={source}
      onShouldStartLoadWithRequest={(request) => {

        if (request.url === currentURI) return true;
        if (!props.onShouldStartLoadWithRequest(request)) return false;

        if (Platform.OS === "ios") {
          if (request.isTopFrame && request.url.includes("alma-app.co")) {
            setURI(urlToTimeUrl(request.url));
            return false;
          }
          return true;
        }

        setURI(urlToTimeUrl(request.url));
        return true;
      }}
      startInLoadingState={false}
      allowFileAccessFromFileURLs={true}
      mixedContentMode={"always"}
      automaticallyAdjustContentInsets={false}
      scalesPageToFit={true}
      domStorageEnabled={true}
      originWhitelist={["*"]}
      scrollEnabled={false}
      useWebKit={true}
      injectedJavaScriptBeforeContentLoaded={InjectedJavaScriptFirst}
      injectedJavaScript={InjectedJavaScript}
      // onError={() => {
      //   return (
      //     <View>
      //       <Text>hiiii</Text>
      //     </View>
      //   );
      // }}


      renderError={(syntheticEvent) => {
        props.onError(syntheticEvent)
      }}
      onError={(syntheticEvent) => {
        props.onError(syntheticEvent)
      }}
    />
  );
};
