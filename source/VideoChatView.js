import React, { useRef, useEffect } from 'react';
import { View, Image, Text, TouchableOpacity, DeviceEventEmitter, Platform, Animated } from "react-native";
import { RTCView } from "react-native-webrtc";
import { BlurView } from "@react-native-community/blur";
import styles from "./styles";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTimes, faSync, faPlus, faCheck, faBan, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { captureScreen } from "react-native-view-shot";
import uuid from "react-native-uuid";
import RNFS from "react-native-fs";
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import {getLang} from './Langs';

export default class extends React.Component {
  inReportProcess = false;
  inSwapProcess = false;
  isVipAdded = false;
  isVipRequested = false;
  lastVipStatus = 0;
  lang = false;
  constructor(props) {
    super(props);
    this.lang = getLang(props.lang);
    this.state = {
        remoteVideoViewSnapshotOption: null,
        alert: null,
    }
  };
  componentDidMount() {
    DeviceEventEmitter.addListener('WebRTCViewSnapshotResult', this.onWebRTCViewSnapshotResult);
  };
  componentWillUnmount() {
    DeviceEventEmitter.removeAllListeners('WebRTCViewSnapshotResult');
  };
  onWebRTCViewSnapshotResult = (data) => {
    this.setState({ remoteVideoViewSnapshotOption: null });
    if (data.error) {
      this.props.webView.injectJavaScript(`
        swap_video_chat();
      `);
    }
    if (data.file) {
      RNFS.readFile(data.file, 'base64')
      .then(res =>{
        this.props.webView.injectJavaScript(`
          report_video_chat('${res}');
        `);
      });
    }
  };
  alertMessage = variable => {
    showMessage({
      message: this.lang[variable],
      type: "default",
      duration: 1200,
      style: {
        opacity: 0.8,
      },
      titleStyle: {
        textAlign: "center",
        color: "#FFF",
      },
      floating: true,
    });
  };
  swapChat = () => {
    if(!this.props.partnerVideo || this.inSwapProcess || this.inReportProcess)
      return;
    this.inSwapProcess = true;
    this.props.webView.injectJavaScript(`
      swap_video_chat();
    `);
  };
  addVip = () => {
    if(!this.props.partnerVideo || this.inSwapProcess || this.inReportProcess)
      return;
    this.alertMessage("sent_vip_request");
    this.props.webView.injectJavaScript(`
      add_to_vip_request();
    `);
  };
  acceptVip = () => {
    if(!this.props.partnerVideo || this.inSwapProcess || this.inReportProcess)
      return;
    this.alertMessage("you_add_your_partner_to_vip");
    this.props.webView.injectJavaScript(`
      accept_to_vip_request();
    `);
  };
  activeForPremiumOnly = () => {
    this.alertMessage("active_for_premium_users");
  };
  leaveChat = () => {
    if(this.inSwapProcess || this.inReportProcess)
      return;
    this.props.webView.injectJavaScript(`
      end_video_chat();
    `);
  };
  captureTheScreen = () => {
    captureScreen({
      format: "jpg",
      quality: 0.8,
      result: "data-uri",
    }).then(
      uri => {
        uri = uri.replace(/[\n\r\t]/g, "");
        this.props.webView.injectJavaScript(`
          report_video_chat('${uri}');
        `);
      },
      error => {
        this.props.webView.injectJavaScript(`
          swap_video_chat();
        `);
      }
    );
  }
  reportChat = async () => {
    if(!this.props.partnerVideo || this.inSwapProcess || this.inReportProcess)
      return;
    this.alertMessage("you_report_on_user");
    this.inReportProcess = true;
    if (Platform.OS == "android") {
      let snapshotOption = {
          id: uuid.v4(),
          saveTarget: "temp",
      };
      this.setState({ remoteVideoViewSnapshotOption: snapshotOption });
    }
    else {
      this.captureTheScreen();
    }
  };
  getVipButton = (userHaveVideo) => {
    if (this.props.premiumStatus == 0 && this.props.partnerVideo && this.props.vipStatus <= 1) {
      this.lastVipStatus = this.props.vipStatus;
      return <TouchableOpacity style={styles.videoBtn} onPress={this.activeForPremiumOnly}>
        <FontAwesomeIcon icon={faPlus} style={(userHaveVideo ? styles.whiteButton : styles.redButton)} size={26} />
      </TouchableOpacity>;
    }
    if(this.props.vipStatus == 0 && this.props.partnerVideo) {
      this.lastVipStatus = this.props.vipStatus;
      return <TouchableOpacity style={styles.videoBtn} onPress={this.addVip}>
        <FontAwesomeIcon icon={faPlus} style={(userHaveVideo ? styles.whiteButton : styles.redButton)} size={26} />
      </TouchableOpacity>;
    }   
    if(this.props.vipStatus == 2) {
      if(!this.isVipAdded && this.lastVipStatus != 3) {
        this.isVipAdded = true;
        this.alertMessage("your_partner_accept_to_vip_request");
      }
      this.lastVipStatus = this.props.vipStatus;
      return <TouchableOpacity style={styles.videoOpacityBtn} disabled={true}>
        <FontAwesomeIcon icon={faCheck} style={(userHaveVideo ? styles.whiteButton : styles.redButton)} size={26} />
      </TouchableOpacity>;
    }
    if(this.props.vipStatus == 3) {
      if(!this.isVipRequested) {
        this.isVipRequested = true;
        this.alertMessage("your_partner_want_to_add_you_vip");
      }
      this.lastVipStatus = this.props.vipStatus;
      return <TouchableOpacity style={styles.videoQuestionBtn} onPress={this.acceptVip}>
        <FontAwesomeIcon icon={faCheck} style={styles.greenButton} size={26} />
      </TouchableOpacity>;
    }
    this.lastVipStatus = this.props.vipStatus;
    return <TouchableOpacity style={styles.videoOpacityBtn} disabled={true}>
      <FontAwesomeIcon icon={faPlus} style={(userHaveVideo ? styles.whiteButton : styles.redButton)} size={26} />
    </TouchableOpacity>;
  };
  render() {
    let partnerHaveVideo = false, 
        userHaveVideo = false;
    if(this.props.partnerFullVideo && this.props.partnerFullVideo.getVideoTracks().length > 0) {
      partnerHaveVideo = true;
    }
    if(this.props.userFullVideo && this.props.userFullVideo.getVideoTracks().length > 0) {
      userHaveVideo = true;
    }
    if(!this.props.partnerVideo && this.inSwapProcess) {
      this.inSwapProcess = false;
    }
    if(!this.props.partnerVideo && this.inReportProcess) {
      this.inReportProcess = false;
    }
    if(!this.props.partnerVideo && this.isVipAdded) {
      this.isVipAdded = false;
    }
    if(!this.props.partnerVideo && this.isVipRequested) {
      this.isVipRequested = false;
    }
    const loadingimage = require("./images/loadingPartner.gif");
    return (
      <View style={styles.videoAreaContainer}>
          {!this.props.partnerVideo && 
            <View style={styles.loadingParnerImage}>
              {/*
              <TouchableOpacity style={styles.reportButton}>
                <FontAwesomeIcon style={styles.redButton} icon={faExclamationTriangle} size={26} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.blockButton}>
                <FontAwesomeIcon style={styles.redButton} icon={faBan} size={26} />
              </TouchableOpacity>
              */}
              <Image source={loadingimage} />
            </View>
          }
          {this.props.partnerVideo &&
            <View style={styles.partnerVideoContainer}>
              <RTCView snapshotOption={(partnerHaveVideo ? this.state.remoteVideoViewSnapshotOption : null)} objectFit="cover" style={(partnerHaveVideo ? styles.partnerVideo : {opacity: 0})} streamURL={this.props.partnerVideo} />
              {this.props.blurVideo && 
               <BlurView style={styles.blurPartnerVideo} blurType="light" blurAmount={15} reducedTransparencyFallbackColor="white" />
              }
              <TouchableOpacity style={styles.reportButton} onPress={this.reportChat}>
                <FontAwesomeIcon style={(partnerHaveVideo ? styles.whiteButton : styles.redButton)} icon={faExclamationTriangle} size={26} />
              </TouchableOpacity>
              {/*
              <TouchableOpacity style={styles.blockButton} onPress={this.reportChat}>
                <FontAwesomeIcon style={(partnerHaveVideo ? styles.whiteButton : styles.redButton)} icon={faBan} size={26} />
              </TouchableOpacity>
              */}
              {/*!this.props.blurVideo &&
                <TouchableOpacity style={styles.reportButton} onPress={this.reportChat}>
                  <FontAwesomeIcon style={styles.whiteButton} icon={faExclamationTriangle} size={22} />
                </TouchableOpacity>
              */}
            </View>
          }
          {this.props.userVideo && 
          <View style={styles.myVideoContainer}>
           <RTCView objectFit="cover" style={(userHaveVideo ? styles.myVideo : {opacity: 1})} streamURL={this.props.userVideo} />
           <View style={styles.videoButtons}>
            <TouchableOpacity style={styles.videoBtnNoSpace} onPress={this.leaveChat}>
             <FontAwesomeIcon style={(userHaveVideo ? styles.whiteButton : styles.redButton)} icon={faTimes} size={26} />
            </TouchableOpacity>
            {this.getVipButton(userHaveVideo)}
            <TouchableOpacity style={styles.videoBtnNoSpace} onPress={this.swapChat}>
             <FontAwesomeIcon style={(userHaveVideo ? styles.whiteButton : styles.redButton)} icon={faSync} size={26} />
            </TouchableOpacity>
           </View>
          </View>
          }
           <FlashMessage ref="myLocalFlashMessage" />
      </View>
    );
  }
};
