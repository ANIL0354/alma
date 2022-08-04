// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  * @flow
//  */

// import React from 'react';
// import {
//   SafeAreaView,
//   StyleSheet,
//   ScrollView,
//   View,
//   Text,
//   StatusBar,
// } from 'react-native';

// import {
//   Header,
//   LearnMoreLinks,
//   Colors,
//   DebugInstructions,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';

// import firebase from 'react-native-firebase';
// class App extends React.Component{
//   constructor(props){
//     super(props);
//   }
//   componentDidMount(){
//     this.checkPermission();
//            this.createNotificationListeners();
//          }

//          async checkPermission() {
//     const enabled = await firebase.messaging().hasPermission();

//     if (enabled) {
//         this.getToken();
//     } else {
//         this.requestPermission();
//     }
//   }
//   async requestPermission() {
//   firebase.messaging().requestPermission()
//   .then(() => {
// this.getToken();
//   //permission granted
//   })
//   .catch(error => {
//     // User has rejected permissions
//   });
//   }
//   getToken(){
//     firebase.messaging().getToken()
//   .then(fcmToken => {
//     if (fcmToken) {
//         token=fcmToken;
//       console.log("notification token genertaed",fcmToken);
//       // alert("token "+ fcmToken);
//       // user has a device token
//     } else {
//       // user doesn't have a device token yet
//     }
//   });
//   }
//   async createNotificationListeners() {
//     // firebase.messaging().ios.registerForRemoteNotifications();
//   console.log("notification receved");
//   /*
//   * Triggered when a particular notification has been received in foreground
//   * */
//   this.notificationListener = firebase.notifications().onNotification((notification) => {

//       const { title, body } = notification;

//        const localNotification = new firebase.notifications.Notification()
//           .setNotificationId("jh")
//           .setTitle(title)
//           .setBody(body)
//           .setData({});

//        firebase.notifications()
//           .displayNotification(localNotification)

//        // alert("notification"+title);
//       // this.savenotification(title,body);
//   });

//    this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification) => {
//         // const { title, body } = notification;
//      // alert("notification receved 5");
//       // this.showAlert(title, body);
//     });

//   /*
//   * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:ss
//   * */
//   this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
//       const { title, body } = notificationOpen.notification;
//      console.log("notification receved 2");
//       // this.showAlert(title, body);
//   });

//   /* If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
//   */
//   this.notificationOpen = firebase.notifications().getInitialNotification()
//       .then((notificationOpen: NotificationOpen) => {
//        // alert("notification receved 7");
// // alert("here"+notificationOpen);
//         if (notificationOpen) {
//           console.log("notification receved 8");
//           // App was opened by a notification
//           // Get the action triggered by the notification being opened
//           const action = notificationOpen.action;
//           // Get information about the notification that was opened
//           const notification: Notification = notificationOpen.notification;
//            // console.log("notification receved 9",notification);
//         }
//       })
//   /*
//   * Triggered for data only payload in foreground
//   * */
//   this.messageListener = firebase.messaging().onMessage((message) => {
//     //process data message
//     // alert("notification receved 4"+JSON.stringify(message._data));
//     console.log("notification receved 4",message.title);
//     const localNotification = new firebase.notifications.Notification()
//           .setNotificationId("jh")
//           .setTitle("message._title")
//           .setBody("message._title")
//           .setData(message._data);

//        firebase.notifications()
//           .displayNotification(localNotification)
//   });

// }

//   render() {
//     return (
//     <>
//       <StatusBar barStyle="dark-content" />
//       <SafeAreaView>
//         <ScrollView
//           contentInsetAdjustmentBehavior="automatic"
//           style={styles.scrollView}>
//           <Header />
//           {global.HermesInternal == null ? null : (
//             <View style={styles.engine}>
//               <Text style={styles.footer}>Engine: Hermes</Text>
//             </View>
//           )}
//           <View style={styles.body}>
//             <View style={styles.sectionContainer}>
//               <Text style={styles.sectionTitle}>Step One</Text>
//               <Text style={styles.sectionDescription}>
//                 Edit <Text style={styles.highlight}>App.js</Text> to change this
//                 screen and then come back to see your edits.
//               </Text>
//             </View>
//             <View style={styles.sectionContainer}>
//               <Text style={styles.sectionTitle}>See Your Changes</Text>
//               <Text style={styles.sectionDescription}>
//                 <ReloadInstructions />
//               </Text>
//             </View>
//             <View style={styles.sectionContainer}>
//               <Text style={styles.sectionTitle}>Debug</Text>
//               <Text style={styles.sectionDescription}>
//                 <DebugInstructions />
//               </Text>
//             </View>
//             <View style={styles.sectionContainer}>
//               <Text style={styles.sectionTitle}>Learn More</Text>
//               <Text style={styles.sectionDescription}>
//                 Read the docs to discover what to do next:
//               </Text>
//             </View>
//             <LearnMoreLinks />
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     </>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   scrollView: {
//     backgroundColor: Colors.lighter,
//   },
//   engine: {
//     position: 'absolute',
//     right: 0,
//   },
//   body: {
//     backgroundColor: Colors.white,
//   },
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//     color: Colors.black,
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//     color: Colors.dark,
//   },
//   highlight: {
//     fontWeight: '700',
//   },
//   footer: {
//     color: Colors.dark,
//     fontSize: 12,
//     fontWeight: '600',
//     padding: 4,
//     paddingRight: 12,
//     textAlign: 'right',
//   },
// });

// export default App;

import React, { Component } from "react";
import { AppRegistry } from "react-native";
import Dashboard from "./source/Dashboard";
import messaging from "@react-native-firebase/messaging";

export default class App extends Component {
  componentDidMount = async () => {
    this.notificationListener = messaging().onMessage(async (remoteMessage) => {
      const notification = remoteMessage.notification;
      if (notification) {
        // alert(notification.body);
      }
    });
  };
  render() {
    return <Dashboard />;
  }
}
AppRegistry.registerComponent("App", () => App);
