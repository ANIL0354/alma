import { StyleSheet, Dimensions, Platform } from "react-native";

import { Colors } from "react-native/Libraries/NewAppScreen";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingBottom: Platform.OS == "ios" ? 32 : 0,
  },
  bannerCenterContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 267 : 240,
    left: 0,
    right: 0,
    height: 120,
  },
  bannerTopContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 127 : 100,
    left: 0,
    right: 0,
    height: 120,
  },
  banner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  bannerBottomContainer: {
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 0,
    height: 120,
  },
  content: {
    width: "100%",
    height: "100%",
  },
  webView: {
    width: "100%",
    height: "100%",
  },
  ActivityIndicatorStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  stylOld: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  styleNew: {
    flex: 1,
  },
  modal: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginTop: 15,
    marginBottom: 15,
  },
  modalTop: {
    height: 40,
    flexDirection: "row",
    marginTop: 10,
    marginLeft: 15,
  },
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: "absolute",
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
    fontWeight: "600",
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "400",
    color: Colors.dark,
  },
  highlight: {
    fontWeight: "700",
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: "600",
    padding: 4,
    paddingRight: 12,
    textAlign: "right",
  },
  textInputEmail: {
    alignSelf: "stretch",
    borderRadius: 4,
    backgroundColor: "green",
    color: "red",
    fontSize: 16,
    height: 48,
  },
  touchableView: {
    height: width * 0.1,
    width: width * 0.1,
    alignItems: "center",
    justifyContent: "center",
  },
  modelImage: {
    height: width * 0.08,
    width: width * 0.08,
    resizeMode: "contain",
  },
  modalClose: {
    color: "#000",
    position: "absolute",
    top: 10,
    left: 0,
    zIndex: 2,
  },
  modalWeb: { flex: 1 },
  videoAreaContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 99,
    width: "100%",
    height: "100%",
  },
  loadingParnerImage: {
    width: "100%",
    height: "60%",
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  partnerVideoContainer: {
    position: "relative",
    width: "100%",
    height: "60%",
  },
  partnerVideo: {
    width: "100%",
    height: "100%",
  },
  myVideoContainer: {
    position: "relative",
    width: "100%",
    height: "40%",
  },
  myVideo: {
    width: "100%",
    height: "100%",
  },
  blurPartnerImage: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 95,
    height: "100%",
    width: "100%",
  },
  blurPartnerVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 99,
    height: "100%",
    width: "100%",
  },
  videoButtons: {
    position: "absolute",
    bottom: 15,
    left: "5%",
    width: "90%",
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    zIndex: 1,
  },
  videoBtn: {
    paddingEnd: 0,
    opacity: 1,
    borderColor: "#FFF", 
    color: "#FFF",
    borderWidth: 1, 
    borderRadius: 100,
    flex: 0,
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
  },
  videoOpacityBtn: {
    opacity: 0.3,
    color: "#FFF",
    paddingEnd: 0,
    borderColor: "#FFF", 
    borderWidth: 1, 
    borderRadius: 100,
    flex: 0,
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
  },
  videoQuestionBtn: {
    paddingEnd: 0,
    borderColor: "#32ed26",
    color: "#32ed26",
    borderWidth: 2, 
    borderRadius: 100,
    flex: 0,
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
  },
  videoBtnNoSpace: {
    color: "#FFF",
    paddingStart: 15,
    paddingEnd: 15,
    borderRadius: 100,
    flex: 0,
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
  },
  reportButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 99,
  },
  blockButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 99,
  },
  whiteButton: {
    color: "#FFF",
  },
  redButton: {
    color: "#ec3c3c",
  },
  greenButton: {
    color: "#32ed26",
  },
  videoAlert: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    zIndex: 999,
    top: 15,
    left: "auto",
    right: "auto",
    height: 30,
    width: "90%",
    borderRadius: 30,
    backgroundColor: "#999",
  },
  alertText: {
    fontSize: 18,
    color: "#FFF",
  },
});
