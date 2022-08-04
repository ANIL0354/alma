/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Dimensions,
  Image,
  ActivityIndicator ,
  DeviceEventEmitter,
  TouchableOpacity,Keyboard
} from 'react-native';
import { Buffer } from 'buffer';
// var Sound = require('react-native-sound');
import { BannerView } from 'react-native-fbads';
import AudioRecord from 'react-native-audio-record';
import RNFetchBlob from 'rn-fetch-blob'
// var banner_id="212875696472570_212876613139145";
var banner_id="535223983866164_535225857199310";
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import AsyncStorage from '@react-native-community/async-storage';
var {width, height} = Dimensions.get('window');
import { WebView } from 'react-native-webview';
// import WKWebView from 'react-native-wkwebview-reborn';


var mainUrl = "https://www.nonychat.com/";
import {PERMISSIONS,check,request} from 'react-native-permissions';
// import KeyboardSpacer from 'react-native-keyboard-spacer';
class Dashboard extends React.Component{
  static navigationOptions = {
    title: 'Home',
  };
  constructor(props){
    super(props);
    this.state={
      isLoading:false,
      visibleHeight: height,
      url:mainUrl,
      BackButton:false,
      recording_status:false,
      record_permission:false,
      media_lib_permission:false,
      showBaner:false
    }
  }
  componentDidMount(){     
      let self = this;

  Keyboard.addListener('keyboardWillShow', function(e: Event) {
    self.keyboardWillShow(e);
  });

  Keyboard.addListener('keyboardWillHide', function(e: Event) {
      self.keyboardWillHide(e);
  });


//   Promise.all([
// check(PERMISSIONS.IOS.MICROPHONE)
// ]).then(([record_Audio]) => {
//   // console.log("permission status",{record_Audio});
// if(record_Audio == 'denied'){
// 
// }request(PERMISSIONS.IOS.MICROPHONE).then(result => {
// // console.log("permission status",{result});

// });
// });


Promise.all([
  check(PERMISSIONS.IOS.MICROPHONE),
  check(PERMISSIONS.IOS.MEDIA_LIBRARY),
  
]).then(([record_audio, media_permission ]) => {
 this.requestAll().then(statuses => 
   console.log("status",statuses)

   );
});

}

 async requestAll() {
  const micStatus = await request(PERMISSIONS.IOS.MICROPHONE);
  const libStatus = await request(PERMISSIONS.IOS.MEDIA_LIBRARY);
  return {micStatus, libStatus};
}

 





  keyboardWillShow (e) {
  let newSize = Dimensions.get('window').height - e.endCoordinates.height;
  this.setState({visibleHeight: newSize});
}

onMessage(data) {
  // console.log("on message",data);
}


keyboardWillHide (e) {
  this.setState({visibleHeight: Dimensions.get('window').height});
}
async _onNavigationStateChange(webViewState){
  await this.setState({showBaner:false})
  console.log("Website URL : ",webViewState.url)
  var URL = webViewState.url;
  if(URL !== "" && !(URL.includes('nonychat'))){
    this.setState({
    BackButton:true
    })
  }
}
onBackPress = (webref) =>{
  webref.goBack();
  this.setState({
     BackButton:false
  })   

}
logout = async () =>{
  await AsyncStorage.clear();
  const navigate = this.props.navigation;
         this.props.navigation.replace('Login');
}

  uploadAudio = async (file,session_id) => {
    // console.log('upload audio ',file);
    const path = `file://${file}`
    const formData = new FormData()
    formData.append('file', {
      uri: path,
      name: 'test.wav',
      type: 'audio/wav',
      'action':'save',
'key':'OS3g6zgyLBRgGTSUeV7wpOhCX6co1nudMFHtKT3UhSJKAPRM',
'audio_buffer':path,
'session_id':session_id
    })
    try {
      const res = await fetch('https://chat.nonychat.com/app/ios_record', {
        method: 'POST',
        headers: {
Accept: 'application/json',
'Content-Type': 'application/json',
},
body: JSON.stringify({
action:'save',
'key':'OS3g6zgyLBRgGTSUeV7wpOhCX6co1nudMFHtKT3UhSJKAPRM',
'audio_buffer':file,
'session_id':session_id
})
      })
      // alert(res.status);
      console.log("response1",res);
      // const json = await res.json()
      // console.log("response",json);
    } catch (err) {
       console.log("error",err);
      alert(err)
    }
  }



RecordAudio = async(event) =>{
  // console.log("record audio");
var data = JSON.parse(event.nativeEvent.data);
var session_id = data.data.session_id;
 var filebuffer = "";   
         const options = {
      sampleRate: 16000,
      channels: 1,
      bitsPerSample: 16,
      wavFile: 'test.wav'
    };

    AudioRecord.init(options);

    AudioRecord.on('data', data => {
      // const chunk = Buffer.from(data, 'base64');
      const chunk = new Buffer(data, 'base64');

      // filebuffer += data;
      filebuffer += chunk;
      console.log('chunk size', chunk.byteLength);
      // do something with audio chunk
    });

console.log("Recording status",this.state.recording_status);
if(this.state.recording_status){
 
    let audioFile = await AudioRecord.stop();
 this.setState({
      recording_status : false
    })
if(!this.state.recording_status){
  RNFetchBlob.fs.readFile(audioFile, 'base64')

.then((data) => {
 var buf = Buffer.from(data, 'base64'); // Ta-da

 console.log("Buffer vavlue newwwww",buf);
 this.uploadAudio(buf,session_id)
})
}
    
  }else{
    this.setState({
      recording_status : true
    })
    AudioRecord.start();
  }
}

handleMessage = (message) =>{
  // console.log("data",message.nativeEvent.data);
  // console.log(message);
  var str = message.nativeEvent.data;
  if(str.includes('$*$')){
    var msg = str.split("$*$");
      if(msg[0] == "none" && msg[1] == "none"){
    this.setState({
      showBaner:true
    })
  }else{
    this.setState({
      showBaner:false
    })
  }
  }else{
    this.RecordAudio(message);
  }
  

}


onWebViewMessage(event) {
        alert(event);
    }
  render(){
//     let Script1 = `
//    var elements = document.getElementsByClassName("record");

// var myFunction = function() {
//     window.ReactNativeWebView.postMessage(JSON.stringify({data}),"*")
// };
//     elements[0].addEventListener('click', myFunction, false);
//     `;

let Script1 = `
    document.getElementsByClassName("record")[0].addEventListener("click", function() {  
      var data = {
      message : "OnRecordStart",
      session_id:document.getElementById('session-id').value
        };
        window.ReactNativeWebView.postMessage(JSON.stringify({data}),"*")
        });
        setInterval(function(){ var x = document.getElementsByClassName("chat-box")[0];var y = document.getElementsByClassName("validation-box")[0];window.ReactNativeWebView.postMessage(window.getComputedStyle(x).display+'$*$'+window.getComputedStyle(y).display); }, 200);
`;

// let Script1 = `
//     document.getElementsByClassName("record")[0].addEventListener("click", function() {  
//       var data = {
//       message : "OnRecordStart",
//       session_id:document.getElementById('session-id').value
//         };
//         window.ReactNativeWebView.postMessage(JSON.stringify({data}),"*")
//         });
// `;


    let WebViewRef;
    return (
    <React.Fragment>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
      <View style={{height:height*0.08,width:width,backgroundColor:'#fff',alignItems:'center',justifyContent:'space-around',flexDirection:'row'}}>
      {(this.state.BackButton) ? <TouchableOpacity style={{height:width*0.15,width:width*0.15,alignItems:'center',justifyContent:'center'}} onPress={()=> this.onBackPress(WebViewRef)}><Image source={require('./images/backred.png')} style={{height:width*0.08,width:width*0.08,resizeMode:'contain'}} /></TouchableOpacity> : <View style={{height:width*0.15,width:width*0.15,alignItems:'center',justifyContent:'center'}}></View>}
      
      <Image source={require('./images/logoDash.png')} style={{width:width*0.4,height:height*0.045,resizeMode:'contain'}}/>
      <View style={{height:width*0.15,width:width*0.15,alignItems:'center',justifyContent:'center'}} onPress={()=> this.logout()}>
 

      </View>
      </View>
      {(this.state.showBaner) ? <BannerView
            placementId={banner_id}
            type="rectangle"
            onPress={() => console.log('click')}
            onError={err => console.log('error', err)}
          />
     :null
      }
      <View style={{width:width,height:height*0.82,paddingLeft:width*0.02,backgroundColor:'#fff',paddingRight:width*0.02}}>

       <WebView
       source={{ uri:this.state.url }}
       ref={WEBVIEW_REF => (WebViewRef = WEBVIEW_REF)}
   onNavigationStateChange={this._onNavigationStateChange.bind(this)}
    
    injectedJavaScript={Script1}
    automaticallyAdjustContentInsets={false}
      allowFileAccessFromFileURLs={true}
      scalesPageToFit={false}
      mixedContentMode={"always"}
      javaScriptEnabled={true}
      onMessage={event => {this.handleMessage(event)}}
     //  onMessage={event => this.RecordAudio(event)}
     
    />  
    
      </View>
    
      </SafeAreaView>
    </React.Fragment>
  );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default Dashboard;

 // {  <View style={{ position: 'absolute', top:"50%",right: 0, left: 0 }}>
 //    <ActivityIndicator size={'large'} animating={this.state.isLoading} color="#E2534B"/>

 // <Image source={require('./images/logout.png')} style={{height:width*0.08,width:width*0.08,resizeMode:'contain'}} />
 //    </View>}