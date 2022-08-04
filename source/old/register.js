/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Dimensions,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from "react-native/Libraries/NewAppScreen";
import AsyncStorage from "@react-native-community/async-storage";
var { width, height } = Dimensions.get("window");
var KEY = "OS3g6zgyLBRgGTSUeV7wpOhCX6co1nudMFHtKT3UhSJKAPRM";
class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      cpassword: "",
      nickname: "",
      isLoading: false,
    };
  }

  componentDidMount() {}

  storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      // saving error
    }
  };

  render() {
    return (
      <React.Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView>
            <View
              style={{
                width: width,
                height: height,
                backgroundColor: "#fff",
                alignItems: "center",
                alignSelf: "center",
              }}
            >
              <View
                style={{
                  width: width * 0.5,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#fff",
                  alignSelf: "center",
                  marginTop: height * 0.1,
                }}
              >
                <Image
                  source={require("./images/logoDash.png")}
                  style={{
                    width: width * 0.5,
                    height: width * 0.3,
                    resizeMode: "contain",
                  }}
                />
              </View>
              <View style={styles.textInputView}>
                <TextInput
                  style={styles.txtinput}
                  onChangeText={(nickname) => this.setState({ nickname })}
                  underlineColorAndroid="transparent"
                  value={this.state.nickname}
                  placeholder={"כינוי"}
                  maxLength={30}
                  placeholderTextColor={"#ccc"}
                />
              </View>

              <View style={styles.textInputView}>
                <TextInput
                  style={styles.txtinput}
                  onChangeText={(email) => this.setState({ email })}
                  underlineColorAndroid="transparent"
                  value={this.state.email}
                  placeholder={"אימייל"}
                  placeholderTextColor={"#ccc"}
                />
              </View>

              <View style={styles.textInputView}>
                <TextInput
                  style={styles.txtinput}
                  onChangeText={(password) => this.setState({ password })}
                  underlineColorAndroid="transparent"
                  value={this.state.password}
                  placeholder={"סיסמה"}
                  placeholderTextColor={"#ccc"}
                  secureTextEntry={true}
                />
              </View>
              <View style={styles.textInputView}>
                <TextInput
                  style={styles.txtinput}
                  onChangeText={(cpassword) => this.setState({ cpassword })}
                  underlineColorAndroid="transparent"
                  value={this.state.cpassword}
                  placeholder={"אשר סיסמה"}
                  placeholderTextColor={"#ccc"}
                  secureTextEntry={true}
                />
              </View>
              <TouchableOpacity
                disabled={this.state.isLoading}
                style={{
                  width: width * 0.65,
                  height: height * 0.06,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#E2534B",
                  alignSelf: "center",
                  marginTop: width * 0.05,
                  padding: width * 0.01,
                }}
                onPress={() => this._register()}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: width * 0.04,
                    fontWeight: "bold",
                  }}
                >
                  להירשם
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={this.state.isLoading}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: width * 0.2,
                  padding: width * 0.05,
                }}
                onPress={() => this.openScreen("Login")}
              >
                <Text style={{ color: "#E2534B", fontSize: width * 0.04 }}>
                  כבר יש לך חשבון?{" "}
                  <Text style={{ textDecorationLine: "underline" }}>
                    התחבר כאן
                  </Text>
                </Text>
              </TouchableOpacity>
              <Text
                style={{
                  marginTop: width * 0.03,
                  width: width * 0.8,
                  color: "#000",
                  fontWeight: "bold",
                  fontSize: width * 0.05,
                  textAlign: "center",
                }}
              >
                הפרטים שלך לעולם לא יחשפו לשותף שלך לשיחה או לכל אדם אחר
              </Text>

              <View
                style={{
                  position: "absolute",
                  top: "70%",
                  right: width * 0.4,
                  left: width * 0.4,
                  alignSelf: "center",
                }}
              >
                <ActivityIndicator
                  size={"large"}
                  animating={this.state.isLoading}
                  color="#E2534B"
                />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </React.Fragment>
    );
  }

  isValid = () => {
    var email = this.state.email;
    var pass = this.state.password;
    var cpass = this.state.cpassword;
    var nickname = this.state.nickname;
    if (nickname !== "" && typeof nickname !== undefined) {
      if (email !== "" && typeof email !== undefined) {
        if (pass !== "" && typeof pass !== undefined) {
          if (cpass !== "" && typeof cpass !== undefined) {
            if (pass == cpass) {
              return true;
            } else {
              alert("סיסמא ואישור סיסמא חייבים להיות זהים.");
              return false;
            }
          } else {
            alert("אנא הכנס אישור סיסמא");
            this.setState({
              isLoading: false,
            });
            return false;
          }
        } else {
          alert("אנא הזן סיסמא");
          this.setState({
            isLoading: false,
          });
          return false;
        }
      } else {
        alert("אנא הכנס כתובת דואל");
        this.setState({
          isLoading: false,
        });
        return false;
      }
    } else {
      alert("אנא הזן את שם הכינוי שלך");
      this.setState({
        isLoading: false,
      });
      return false;
    }
  };

  _register = () => {
    if (this.isValid()) {
      var email = this.state.email;
      var pass = this.state.password;
      var nickname = this.state.nickname;
      fetch(
        "http://144.91.72.89:3000/register?email=" +
          encodeURIComponent(email) +
          "&nickname=" +
          this.state.nickname +
          "&password=" +
          encodeURIComponent(pass) +
          "&key=" +
          KEY,
        {
          method: "GET",
        }
      )
        .then((response) => {
          console.log("jdhkj", response);
          return response;
        })
        .then((responseJson) => {
          this.setState({
            isLoading: false,
          });

          if (
            responseJson.text == "success" ||
            responseJson.text == "הצלחה" ||
            responseJson.status == 200
          ) {
            this.storeData("loggedIn", "true");
            const navigate = this.props.navigation;
            this.props.navigation.replace("Terms");
          } else {
            if (responseJson.statusText) {
              alert(responseJson.statusText);
            } else {
              alert("Something went wrong.");
            }
          }
        })
        .catch((error) => {
          console.log("error", error);
          this.setState({
            isLoading: false,
          });
          alert(error);
        });
    }
  };

  openScreen = (screen) => {
    const navigate = this.props.navigation;
    this.props.navigation.replace(screen);
  };
}

const styles = StyleSheet.create({
  txtinput: {
    height: height * 0.065,
    width: width * 0.65,
    paddingLeft: width * 0.02,
    paddingRight: width * 0.02,
    fontSize: width * 0.04,
    color: "#000",
    marginLeft: width * 0.02,
    borderColor: "#EB2D34",
    textAlign: "right",
  },
  textInputView: {
    width: width * 0.65,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    marginTop: width * 0.05,
  },
});

export default Register;
