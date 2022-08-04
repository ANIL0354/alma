/* Sample React Native App
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
  TouchableOpacity,Switch,
  Alert
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import AsyncStorage from '@react-native-community/async-storage';
var {width, height} = Dimensions.get('window');
var mainUrl = "https://www.nonychat.com/";
// import KeyboardSpacer from 'react-native-keyboard-spacer';
class Terms extends React.Component{
  static navigationOptions = {
    title: 'Home',
  };
  constructor(props){
    super(props);
    this.state={
     switch1Value:false,
     switch2Value:false,
      visibleHeight: height,
      url:mainUrl,
      BackButton:false
    }
  }
  componnetDidMount(){
      let self = this;

  DeviceEventEmitter.addListener('keyboardWillShow', function(e: Event) {
    self.keyboardWillShow(e);
  });

  DeviceEventEmitter.addListener('keyboardWillHide', function(e: Event) {
      self.keyboardWillHide(e);
  });
  }
  keyboardWillShow (e) {
  let newSize = Dimensions.get('window').height - e.endCoordinates.height;
  this.setState({visibleHeight: newSize});
}

keyboardWillHide (e) {
  this.setState({visibleHeight: Dimensions.get('window').height});
}
GoFurther(){
this.storeData('Confirm',"1");
 const navigate = this.props.navigation;
         this.props.navigation.replace('Dashboard');
}
storeData = async (key,value) => {
  try {
    await AsyncStorage.setItem(key, value)
  } catch (e) {
    // saving error
  }
}
proceedFurther = async () =>{
   if(this.state.switch1Value && this.state.switch2Value){

  Alert.alert(
  'אזהרת שימוש',
  'שים לב שבמידה ותדבר על כל דבר הנוגע למיניות (לדוגמא: בדיחות מיניות, שאלות מיניות או סיפורים מיניים) או כל דבר שקשור למיניות, או לכספים (הלוואות, תמיכה כספית או כל דבר שקשור לכסף) חשבונך יחסם באופן מיידי',
  [
    {text: 'קבל', onPress: () => {this.GoFurther()}},
    
    {text: 'דחה', onPress: () => console.log('OK Pressed')},
  ],
  {cancelable: false},
);

   }else{

   	Alert.alert(
  'הודעה',
  'עליך לקרוא ולקבל את מדיניות הפרטיות ורישיון המשתמש כדי להמשיך הלאה.',
  [
    {text: 'בסדר', onPress: () => console.log('OK Pressed')},
  ],
  {cancelable: false},
);

  
   }
}
toggleSwitch1 = (value) => {
      this.setState({switch1Value: value})
      
   }
   toggleSwitch2 = (value) => {
      this.setState({switch2Value: value})
      
   }
   logout = async () =>{
  await AsyncStorage.clear();
  const navigate = this.props.navigation;
         this.props.navigation.replace('Login');
}
  render(){
    
    return (
    <React.Fragment>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
      <View style={{height:height*0.08,width:width,backgroundColor:'#fff',alignItems:'center',justifyContent:'space-around',flexDirection:'row'}}>
      {(this.state.BackButton) ? <TouchableOpacity style={{height:width*0.15,width:width*0.15,alignItems:'center',justifyContent:'center'}} onPress={()=> this.onBackPress(WebViewRef)}><Image source={require('./images/backred.png')} style={{height:width*0.08,width:width*0.08,resizeMode:'contain'}} /></TouchableOpacity> : <View style={{height:width*0.15,width:width*0.15,alignItems:'center',justifyContent:'center'}}></View>}
      
   
      <Text style={{color:'#000',fontSize:width*0.05,witdh:width*0.5,textAlign:'center'}}>הוראות התיישבות</Text>
      <TouchableOpacity style={{height:width*0.15,width:width*0.15,alignItems:'center',justifyContent:'center'}} onPress={()=> this.logout()}>

<Image source={require('./images/logout.png')} style={{height:width*0.08,width:width*0.08,resizeMode:'contain'}} />
      </TouchableOpacity>
      </View>
      <View style={{width:width,height:height*0.84,paddingLeft:width*0.02,paddingRight:width*0.02}}>
      <Text style={{width:width,fontSize:width*0.05,color:'#000',padding:width*0.03}}>תקופת השירותים</Text>
      <View style={{height:height*0.25,width:width*0.9,alignItems:'center',justifyContent:'center',alignSelf:'center',marginTop:width*0.03}}>
      <ScrollView>
      <Text style={{fontSize:width*0.04,fontWeight:'bold'}}>תנאי שימוש בדסיז׳ן צ׳אט</Text>
<Text style={{fontSize:width*0.04}}>מערכת הצ'טים של דסיז׳ן צ׳אט הינה במה להבעת דעה בכל נושא. העקרונות המנחים את מערכת הצ'טים של דסיז׳ן צ׳אט הינם עקרון חופש .הביטוי מחד, ושמירה על חוקי מדינת ישראל מנגד מערכת הצ'טים של דסיז׳ן צ׳אט מזמינה אותך להביע דעתך מעל במה זו, תוך שמירה על חוקי המדינה וכללי המשחק המקובלים, וזאת כדי .לאפשר דיון פורה, יעיל והוגן דסיז׳ן צ׳אט מאפשרת לגולשים להשתמש במערכת הצ'טים של דסיז׳ן צ׳אט, והכל בהתאם ובכפוף לכל הוראות התקנון ולתנאי השימוש :שבפרק ב' זה .בתנאי שימוש אלה: "מסרים" - לרבות הודעות, תכנים, מידע או פרטים
כללי התנהגות ושימוש חל איסור חמור בצ׳אט עם קטינים עפ״י החוק הישראלי לחוק איסור צ׳׳אט עם קטינים!
.שימוש בצ'ט הינו בכפוף להוראות כל דין ולתנאי השימוש כפי שיקבעו מעת לעת על ידי דסיז׳ן צ׳אט .אין לפרסם מסרים המכילים וירוסי מחשב מכל סוג שהוא, לרבות אך לא רק "סוסים טרויאניים", "פצצות לוגיות" ותוכנות עיקוב ברשת אין לפרסם בצ'ט מסרים מזיקים ו/או שאינם מדויקים ו/או המהווים תועבה, פגיעה, העלבה, הפצת לשון הרע, פגיעה בפרטיות, ניבול פה, .השמצה, לשון גסה או בוטה, נושא מגונה או מסרים האסורים על פי דין ו/או הסכם, מפורש או מכללא מסרים המועלים לצ'ט חייבים להיות רלוונטיים לנושא הצ'ט שאליו הם מועלים. מערכת דסיז׳ן צ׳אט רשאית למחוק מסרים שאינם רלוונטיים .לצ'ט שאליו הם מועלים, או להעבירם אל הצ'ט הרלוונטי .אין לפרסם בצ'ט תכנים בעלי אופי מסחרי ו/או פרסומי, אלא בהיתר מפורש מראש ובכתב מדסיז׳ן צ׳אט בבחירת שם לחדרים אין לבחור שם שהינו מזיק, או שיש בו משום תועבה, פגיעה, העלבה, הפצת לשון הרע, פגיעה בפרטיות, ניבול פה, .השמצה, לשון גסה או בוטה, נושא מגונה או מסרים האסורים על פי דין ו/או הסכם, מפורש או מכללא אין להעביר מסרים המעודדים מעשים שעלולים לגרום לעבירות פליליות, לחבות אזרחית או להפרת חוק או תקנה, מקומית, ארצית או .בינלאומית אין לפרסם בצ'ט מסר אשר זכויות היוצרים בו אינן שייכות לך, אלא אם קיבלת למטרה זו את הסכמת בעל זכויות היוצרים בכתב ומראש. כמו .כן, אין לפרסם בצ'ט כל סימן מסחר, פטנט או מידע אחר אשר זכויות הקניין הרוחני בהם אינן שייכות לך .אין להפריע לשימושו של כל משתמש אחר ו/או כל ישות אחרת בצ'ט דסיז׳ן צ׳אט שומרת לעצמה את הזכות להגביל ו/או לחסום ו/או למנוע מגולש גישה ו/או שימוש לכל שירות באתר, לרבות כתיבה וקריאה .בצ'טים, וזאת ללא מתן התראה או הסברים לגולש מראש או בדיעבד במחשב הגולש, המסוגל לזהות את המחשב ממנו DLL אשר יתקין קובץ ,)applet( לצורך כך, דסיז׳ן צ׳אט תהא רשאית להשתמש ביישומון מתחבר הגולש לשירות הצ'אט של דסיז׳ן צ׳אט, על ידי הצלבת מספר נתונים סיריאליים ממחשב הגולש. בטרם הפעלת היישומון, תופיע התראה במחשב הגולש, ותהיה לגולש האפשרות לסרב להפעלת היישומון. הגולש אינו חייב להסכים להפעלת היישומון אולם אז לא תהא .ההשתתפות בצ'אט אפשרית .אסור לפרסם , לכתוב, ולהפיץ מספרי טלפון בכל צורה שהיא אין לכתוב באותיות או לכתוב מספרים בחדרים או בלובי או בשיחות פרטיות. כל הפרה של סעיף זה תאשר לחברת הצ'אט למנוע מהמשתמש .לחזור ולהשתמש בצ'אט של דסיז׳ן צ׳אט אסור למשתמשים בצ'אט לרשום או לפרסם או להפיץ כתובות או מספרי דירות . כל הפרה של סעיף זה תאפשר למנהלים לחסום את המשתמש .מלגלוש בצ'אט
הצהרות המשתמש והתחייבויותיו
ידוע לך, והנך מסכים לכך, כי השירותים הניתנים באתר ניתנים לשימוש כמות שהם. לא תהא לך כל טענה, תביעה או דרישה כלפי בעלי האתר בגין אופיים של השירותים שמציע האתר, או בגין התגובות שיעוררו פרסום פרטים או מידע מטעם משתמש באתר. השימוש באתר .יעשה על אחריותו המלאה והבלעדית של כל גולש ידוע לך, והנך מסכים לכך, כי יתכן ובעתיד, באופן זמני או לאורך זמן ממושך, לא יהא הצ'ט זמין בשל צרכי תחזוקה ו/או צרכים אחרים וכי .ממשקי השימוש בצ'ט עשויים להשתנות מעת לעת ידוע לך, והנך מסכים לכך, כי דסיז׳ן צ׳אט אינה ערבה לכך ששימושך בשירות הצ'ט יהא מובטח ו/או שלא יופרע על ידי משתמש אחר ו/או .פורצים לשירות ו/או ללא שגיאות ידוע לך, והנך מסכים לכך, כי קיימת אפשרות שמשתמש אחר ו/או פורצים יעבירו אליך חומר משמיץ, לא מדויק, גס, מגונה, תקיף, חומר תועבה, לשון הרע, חומר מאיים או כל מידע לא חוקי אחר ו/או חומר מזיק מכל סוג שהוא. ידוע לך, והנך מסכים לכך, כי לא תהא לך כל טענה .כנגד דסיז׳ן צ׳אט בגין נזק ו/או כל אובדן או הפסד, עקיף ו/או ישיר, כתוצאה מהעברת מידע זה
ידוע לך, והנך מסכים לכך, כי דסיז׳ן צ׳אט אינה מתחייבת ו/או מצהירה כי הצ'ט יהיה ללא הפרעות או ללא תקלות, כי תקלות באתר תתוקנה,￼ או כי השירות או השרת המספק את השירות יהיו נקיים מוירוסים או מרכיבים מזיקים אחרים. תיקון פגמים באתר ייעשה על פי שיקול דעתה .הבלעדי של דסיז׳ן צ׳אט ידוע לך, והנך מסכים לכך, כי כל שימוש בחומר שאינם בעלי זכויות היוצרים בו, ללא הרשאתו של בעל הזכויות, עלול להפר זכויות יוצרים .ו/או סימני מסחר ו/או כל זכות אחרת לפי העניין וכי תעמוד לבעל הזכות עילת תביעה כנגדך .ידוע לך, והנך מסכים לכך, כי השימוש בצ'ט ו/או באתר אינם יוצרים ו/או מקנים לך כל זכות שהיא בהם .הודעות זבל, הצפות, פרסומות ומכתבי שרשרת אסורים בהחלט ידוע לך, והנך מסכים לכך, כי חל עליך איסור מוחלט לבצע ו/או לנסות לבצע בדיקה ו/או בחינה של רגישות המערכת, או להפר אבטחה או אימות או להתערב באופן כלשהו במערכות ו/או ברשתות המחוברות לצ'ט, או להפר חוקים ו/או תקנות ו/או מדיניות ו/או תהליכים של מערכות .ו/או רשתות אחרות ידוע לך, והנך מסכים לכך, כי דסיז׳ן צ׳אט ו/או מי מטעמה אינה אחראית על הפרסומים ו / או הפרסומות הרצים בצ'ט מכל סוג, ו כי לא תהא .לך כל טענה כנגד דסיז׳ן צ׳אט בגין נזק ו/או כל אובדן או הפסד, עקיף ו/או ישיר, כתוצאה מפרסומים ו / או הפרסומות הרצים בצ'ט ידוע לך, והנך מסכים לכך, כי כל הפרת האבטחה של המערכת ו/או של רשת התקשורת, עלולה לחייבך בחבות אזרחית או פלילית על פי דין. כמו כן, ידוע לך, והנך מסכים לכך, כי דסיז׳ן צ׳אט רשאית לחקור מקרים בהם כרוכות הפרות כמצוין לעיל, וכן היא רשאית לערב ו/או לשתף .פעולה עם רשויות החוק כנגד כל משתמש שמעורב בהפרת האבטחה, הכל על פי דין ידוע לך, והנך מסכים לכך, כי דסיז׳ן צ׳אט שומרת על זכותה לחשוף את זהותך )או כל מידע אחר( במקרה של פעילות משטרתית או משפטית .נגדך ידוע לך, והנך מסכים לכך, כי דסיז׳ן צ׳אט ו/או מי מטעמה לא ישאו באחריות כלשהי לכל נזק, ישיר או עקיף, שיגרם כתוצאה מהודעות שפרסמתם, ללא יוצא מן הכלל. שימושך באתר מהווה הסכמה ברורה לכך שאתה, ככותב ההודעה, הנך האחראי היחיד והישיר על תוכנה ועל התוצאות - הישירות והעקיפות - הנובעות ממנה. כמו כן, אתה תשא באחריות מלאה ובלעדית לתוצאות הנובעות משימושך במידע שפורסם על ידי משתמשים אחרים בצ'ט. שימושך באתר מהווה גם הסכמה ברורה לכך, שהנך פוטר את דסיז׳ן צ׳אט ו/או מי מטעמה מכל אחריות שהיא על .הודעותיך דסיז׳ן צ׳אט לא תהא אחראית בשום מקרה בקשר עם השימוש בצ'ט או תכנים הנכללים בצ'ט או בכל אתר קשור ו/או בקשר עם האפשרות או היעדרה של אפשרות להשתמש בשירות ובאתרים קשורים לכל נזק, ובין השאר - לאובדן שימוש, הפרעה לעסק ו/או לכל נזק, ישיר או עקיף, ספציפי, אקראי, תוצאתי ו/או מכל סוג שהוא )לרבות הפסד רווחים( ללא קשר לסוג הפעולה, אף אם דסיז׳ן צ׳אט ידעה ו/או יידעה אותך על .אפשרות להיווצרות הנזקים המפורטים. סעיף זה יחול בכפוף לכל דין ידוע לך, והנך מסכים לכך, כי הנך הנושא באופן בלעדי במלוא הנטל לכל נזק ו/או אובדן ו/או הפסד שיגרם לך, במישרין או בעקיפין, כתוצאה .מהשימוש בצ'ט ידוע לך, והנך מסכים לכך, כי משתמשים אחרים ו/או פורצים לשירות עלולים לעשות שימוש שלא כדין במידע שהועבר על ידך ולגרום לך נזק ו/או אובדן ו/או הפסד, מכל סוג ומין שהוא. לדסיז׳ן צ׳אט לא תהא כל אחריות בשל כל נזק ו/או אובדן ו/או הפסד שיגרם לך כתוצאה .משימוש לא חוקי של צדדים שלישיים כאמור .על המשתמש בצ'ט מוטלת מלוא האחריות בגין השימוש בצ'ט, לרבות קשריך עם משתמשים אחרים בצ'ט ידוע לך, והנך מסכים לכך, כי חל איסור חמור על פגיעה בפרטיותם ובכבודם של גולשים אחרים בצ'ט, לרבות מסירת כל פרט מזהה אודותיהם .)לרבות שם, גיל, פרטי התקשרות או כל פרט מזהה אחר( באמצעות הצ'ט הנך מסכים לשפות את דסיז׳ן צ׳אט בגין כל דרישה ו/או תביעה של צד שלישי, לרבות שכ"ט עו"ד, שנובעת משימושך בשירות, הפרת תנאי שימוש אלה או הפרת זכויות קניין רוחני או זכות אחרת של אדם או ישות על ידך או על ידי משתמש אחר הפועל באמצעות מחשבך או סיסמתך .ידוע לך כי התחזות לאדם אחר הינה עבירה פלילית ותטופל במלוא החומרה! הנך מאשר כי ידוע לך וכי הנך מסכים, כי דסיז׳ן צ׳אט תהא רשאית, על פי שיקול לדעתה, למסור פרטי גולש שברשותה לפי דרישת משטרה .או על פי צו שיפוטי, ולך לא תהא כל טענה כנגדה בגין מסירת פרטיך האישיים בנסיבות אלה דסיז׳ן צ׳אט אינה מפקחת ואינה יכולה לפקח על המסרים המועלים בצ'טים, והיא אינה אחראית בכל אופן שהוא למסרים כאמור. כל האחריות .הנובעת מהעלאת מסרים לצ'טים מוטלת על המשתמש שהעלה אותם</Text>
</ScrollView>

      </View>
      <View style={{alignItems:'center',justifyContent:'center',alignSelf:'flex-start',flexDirection:'row',padding:width*0.01,marginLeft:width*0.02}}>
       <Switch
         onValueChange = {this.toggleSwitch1}
         value = {this.state.switch1Value}/>
         <Text style={{fontSize:width*0.04,marginLeft:width*0.05}}>אני מסכים</Text>
      </View>
      
         

    <Text style={{width:width,fontSize:width*0.05,color:'#000',padding:width*0.02}}>מדיניות פרטיות</Text>
      <View style={{height:height*0.25,width:width*0.9,alignItems:'center',justifyContent:'center',alignSelf:'center',marginTop:width*0.03}}>
      <ScrollView>
          <Text style={{fontSize:width*0.04}}>מדיניות הפרטיות
המחויבות שלנו כלפיך
באתר NonyChat, הפרטיות שלך נמצאת בראש סולם העדיפויות. הפרטיות שלך נמצאת בלב הדרך שבה אנו מתכננים ובונים את השירותים והמוצרים שאתה מכיר ואוהב, כך שתוכל לסמוך עליהם לחלוטין ולהתמקד ביצירת קשרים בעלי משמעות.
אנו מעריכים את העובדה שאתה בוטח בנו כאשר אתה מוסר לנו את המידע שלך ואנו לא מתייחסים לכך בקלות ראש.
אנו לא מתפשרים בנוגע לפרטיות שלך. אנו מתכננים את כל המוצרים והשירותים שלנו תוך מחשבה על הפרטיות שלך. אנו מעסיקים מומחים מתחומים שונים, כולל מומחים משפטיים, מומחי אבטחה, הנדסה ותכנון מוצר ועוד על מנת לוודא ששום החלטה לא מתקבלת מבלי לקחת בחשבון את הפרטיות שלך.
אנו חותרים לקיום שקיפות לגבי האופן שבו אנו מעבדים את המידע שלך. כתבנו את מדיניות הפרטיות שלנו ומסמכים רלוונטיים אחרים בשפה פשוטה, ללא שימוש בשפה מורכבת מדי, ועם מספיק מידע נגיש עבורך. למעשה, אנו מעוניינים שתקרא את כללי המדיניות שלנו ותבין את נהלי הפרטיות שלנו!
אנו משקיעים מאמץ רב על מנת לאבטח את המידע שלך. יש לנו צוותים ייעודיים לשמירת בטיחות המידע שלך. אנו מעדכנים ללא הרף את נהלי האבטחה שלנו ומשקיעים מאמצים רבים במטרה לשפר את בטיחות המידע שלך.
מדיניות הפרטיות
ברוכים הבאים למדיניות הפרטיות של NonyChat. אנו מודים לך על הזמן שאתה מקדיש לקריאת המדיניות.
אנו מעריכים את העובדה שאתה סומך עלינו בנוגע למידע שלך ובכוונתנו לשמר את האמון הזה תמיד. ראשית אנו מוודאים שאתה מבין את המידע שאנו אוספים, מדוע אנו אוספים אותו, איזה שימוש נעשה בו ואת האפשרויות שלך בנוגע למידע שלך. במדיניות זו מתוארים נהלי הפרטיות שלנו בשפה פשוטה, תוך שימוש מינימלי במונחים משפטיים וטכניים.
מדיניות פרטיות זו תהיה בתוקף החל מ-01 ספטמבר 2019.



היכן חלה מדיניות פרטיות זו
מדיניות פרטיות זו חלה על אתרי האינטרנט, האפליקציות, אירועים ושירותים אחרים המופעלים על ידי NonyChat. לשם הפשטות, במדיניות הפרטיות הזו אנו מתייחסים לכל אלה כאל 'השירותים' שלנו. על מנת להיות אפילו ברורים יותר, הוספנו קישורים למדיניות פרטיות זו בכל השירותים הרלוונטיים.
בכמה מהשירותים אולי תידרש מדיניות פרטיות ייחודית. אם לשירות מסוים יש מדיניות פרטיות משלו, אזי אותה מדיניות - לא מדיניות הפרטיות הזאת - תהיה בתוקף.


מידע שאנו אוספים
אין צורך לומר שלא נוכל לעזור לך לפתח קשרים משמעותיים מבלי לקבל מידע כלשהו אודותיך, כגון פרטי פרופיל בסיסיים וסוגי האנשים שאתה מעוניין לפגוש. כמו כן אנו אוספים מידע המופק בזמן שאתה משתמש בשירותים שלנו, כגון תיעוד הכניסות, כמו גם מידע מצדדים שלישיים, כמו למשל כאשר אתה מתחבר לשירותים שלנו באמצעות חשבון במדיה חברתית. אם אתה מעוניין במידע נוסף, נוסיף ונרחיב להלן.
מידע שאתה מספק לנו
כאשר אתה משתמש בשירותים שלנו אתה בוחר למסור לנו מידע מסוים. הדבר כולל:
• כאשר אתה פותח חשבון, אתה מוסר לנו לפחות את פרטי התחברותך למערכת, כמו גם פרטים בסיסיים הנחוצים על מנת שהשירות יעבוד, כגון המגדר ותאריך הלידה שלך.
• כאשר אתה משלים את הפרופיל שלך, אתה יכול לשתף אותנו במידע נוסף, דוגמת פרטים על האישיות, סגנון החיים, תחומי העניין ופרטים אחרים בנוגע אליך, וכן בתכנים כגון תמונות וסרטונים. על מנת להוסיף תכנים מסוימים, דוגמת תמונות או סרטונים, אתה יכול לאפשר לנו לקבל גישה למצלמה או לאלבום התמונות שלך. חלק מהמידע שתבחר למסור לנו יכול להיחשב 'מיוחד' או 'רגיש' באזורי שיפוט מסוימים, לדוגמה, הגזע או המוצא האתני שלך, הנטייה המינית והאמונות הדתיות שלך. בעצם הסכמתך למסור את המידע הזה, אתה מסכים לכך שנעבד את אותו המידע.
• כאשר אתה נרשם לשירות בתשלום או מבצע רכישה ישירות מאיתנו (ולא באמצעות פלטפורמה דוגמת iOS או אנדרואיד), אתה מוסר מידע לנו או לספק שירותי התשלומים שלנו, כגון מספר כרטיס החיוב המיידי או כרטיס האשראי שלך או מידע פיננסי אחר.
• כאשר אתה משתתף בסקרים או בקבוצות מיקוד, אתה מספק לנו את התובנות שלך בנוגע למוצרים ולשירותים שלנו, משיב על שאלותינו ומוסר חוות דעת.
• כאשר אתה בוחר להשתתף בקידומי מכירות, באירועים או בתחרויות שלנו, אנו אוספים את המידע בו אתה משתמש לצורך הרשמה או כניסה למערכת.
• אם אתה יוצר קשר עם מוקד התמיכה שלנו, אנו אוספים את המידע שאתה מוסר לנו במהלך האינטראקציה. לעתים, אנו מנטרים או מקליטים את האינטראקציות האלה למטרות הדרכה וכדי להבטיח שירות באיכות גבוהה.
• אם אתה מבקש מאיתנו לתקשר עם אנשים אחרים או לעבד באופן אחר את המידע שלהם (לדוגמה, אם תבקש מאיתנו לשלוח דואר אלקטרוני בשמך לאחד מחבריך), אנו אוספים את המידע שאתה מוסר לנו אודות אנשים אחרים במטרה למלא את בקשתך.
• מובן מאליו שאנו מעבדים גם את הצ'אטים שלך עם משתמשים אחרים כמו גם את התכנים שאתה מפרסם, כחלק מתפעול השירותים.
מידע שאנו מקבלים מאחרים
בנוסף למידע שאתה מוסר לנו ישירות, אנו מקבלים מידע אודותיך מאנשים אחרים, כולל:
• משתמשים אחרים
משתמשים אחרים יכולים למסור מידע אודותיך בזמן שהם משתמשים בשירותים שלנו. למשל, ייתכן שנאסוף מידע אודותיך ממשתמשים אחרים אם הם יוצרים איתנו קשר בנוגע אליך.
• מדיה חברתית
תהיה לך אפשרות להשתמש בפרטי ההתחברות שלך למדיה חברתית (כגון התחברות לפייסבוק) על מנת ליצור חשבון ולהתחבר לחשבונך ב-NonyChat . דבר זה חוסך לך את הצורך לזכור עוד שם משתמש וסיסמה ומאפשר לך לחלוק איתנו מידע מסוים מתוך החשבון שלך במדיה החברתית.
• שותפים אחרים
ייתכן שנקבל מידע אודותיך מהשותפים שלנו, לדוגמה, כאשר ניתן ליצור חשבונות של NonyChat באמצעות אתרים של שותף (במקרה הזה הם מעבירים אלינו מידע על ההרשמה) או כאשר פרסומות של NonyChat מתפרסמות באתרים ובפלטפורמות של שותף (במקרה הזה ייתכן שהם יעבירו לנו פרטים בנוגע להצלחת הקמפיין).
מידע הנאסף כאשר אתה משתמש בשירותים שלנו
כאשר אתה משתמש בשירותים שלנו, אנו אוספים מידע בנוגע לתכונות שבהם השתמשת, כיצד השתמשת בהן ועל המכשירים שבהם אתה משתמש כדי להתחבר לשירותים שלנו. להלן פרטים נוספים:
• מידע לגבי שימוש
אנו אוספים מידע בנוגע לפעילות שלך בשירותים שלנו, למשל, כיצד אתה משתמש בהם (לדוגמה, התאריך והשעה שבהם התחברת למערכת, תכונות שבהן השתמשת, הקלקות ודפים שהוצגו בפניך, כתובת דף האינטרנט המפנה, פרסומות שעליהן הקלקת) וכיצד אתה יוצר קשר עם משתמשים אחרים (לדוגמה, משתמשים שאליהם אתה מתחבר ויוצר איתם קשר, השעה והתאריך של הדיאלוגים ביניכם, מספר ההודעות ששלחת וקיבלת).
• מידע המגיע ממכשירים
אנו אוספים מידע הקשור למכשירים שאתה משתמש בהם כדי להתחבר לשירותים שלנו, כולל:
• מידע על החומרה והתוכנה כגון כתובת IP, מזהה המכשיר וסוגו, ההגדרות והמאפיינים הספציפיים למכשיר ולאפליקציות, קריסות של האפליקציות, מזהי פרסומות (כגון AAID של Google ו-IDFA של חברת Apple, שני אלה הם מספרים המופקים באופן אקראי שבאפשרותך לאפס דרך הגדרות המכשיר שלך), הסוג, הגרסה והשפה של הדפדפן, מערכת ההפעלה, אזורי הזמן, מזהים הקשורים לקובצי Cookie או לטכנולוגיות אחרות שבאפשרותן לזהות באופן ייחודי את המכשיר או הדפדפן שלך (לדוגמה, IMEI/UDID או כתובת MAC);
• מידע על החיבור לרשת האלחוטית והסלולרית שלך, כגון ספק השירות שלך ועוצמת האות האלחוטי;
• מידע על חיישני המכשיר דוגמת מדי-תאוצה, גירוסקופים ומצפנים.
• מידע אחר בהסכמתך
אם תיתן לנו רשות, באפשרותנו לאסוף את מיקומך הגאוגרפי המדויק (קווי אורך ורוחב) במספר דרכים, בהתאם לשירות ולמכשיר שבהם אתה משתמש, כולל חיבורי GPS, בלוטות' או Wi-Fi. איסוף המיקום הגאוגרפי שלך יכול להתרחש ברקע גם כאשר אינך משתמש בשירותים אם הרשות שנתת לנו מתירה מפורשות איסוף מעין זה. אם תסרב לתת לנו רשות לאסוף את מיקומך הגאוגרפי, לא נאסוף אותו.
באותו אופן, אם תסכים, נוכל לאסוף את התמונות והסרטונים שלך (למשל, אם תרצה להשתמש בשירותים לפרסום תמונה, סרטון או סטרימינג).


קובצי Cookie וטכנולוגיות איסוף מידע דומות אחרות
אנו עושים שימוש ויכולים לאפשר לאחרים לעשות שימוש בקובצי Cookie ובטכנולוגיות דומות (כגון משואות אינטרנט, פיקסלים) במטרה לזהות אותך ו/או את המכשיר(ים) שלך.
בדפדפנים מסוימים (כולל Safari, Internet Explorer, Firefox ו-Chrome) קיימת האפשרות 'Do Not Track' ('DNT') למניעת מעקב, דרכה מתעדכן האתר שהמשתמש אינו מעוניין שיעקבו אחר הפעילות האינטרנטית שלו. אם אתר אינטרנט המגיב לאיתות DNT מקבל אות DNT, הדפדפן יכול לחסום את אותו אתר ולמנוע איסוף של מידע מסוים בנוגע למשתמש בדפדפן. לא בכל הדפדפנים קיימת האפשרות DNT ואותות DNT עדיין לא זהים באופיים. זאת הסיבה לכך שעסקים רבים, כולל NonyChat, אינם מגיבים כיום לאותות DNT.


כיצד אנו משתמשים במידע
הסיבה העיקרית שבגללה אנו משתמשים במידע שלך היא לצורך מתן השירותים שלנו ושיפורם. בנוסף לכך, אנו משתמשים במידע שלך כדי לסייע לאבטחה שלך ולהעביר אליך פרסומות שאולי יעניינו אותך. המשך לקרוא לקבלת הסבר מפורט יותר בנוגע לסיבות השונות שבגללן אנו עושים שימוש במידע שלך לצד דוגמאות מעשיות.
על מנת לנהל את החשבון שלך ולספק לך את השירותים שלנו
• כדי ליצור ולנהל את החשבון שלך
• כדי לספק לך תמיכה ולהשיב על בקשותיך
• כדי להשלים את העסקאות שלך
• כדי ליצור אתך קשר בנוגע לשירותים שלנו, כולל ניהול הזמנות וחיובים
על מנת לעזור לך להתחבר למשתמשים אחרים
• כדי לנתח את הפרופיל שלך ושל משתמשים אחרים על מנת להמליץ על קשרים משמעותיים
• כדי להציג אחד לשני את פרופילי המשתמשים
על מנת להבטיח חוויה עקבית בכל המכשירים שלך
• כדי לחבר בין המכשירים השונים שבשימושך כך שתוכל ליהנות מחוויה עקבית מהשירותים שלנו בכל אחד מהם. אנו עושים זאת באמצעות חיבור בין המכשירים לנתוני הדפדפן, כגון הזמן שבו התחברת לחשבון שלך במכשירים שונים או על ידי שימוש בכתובת IP חלקית או מלאה, גרסת הדפדפן ונתונים דומים על המכשירים שלך כסיוע לזיהוים ולקישורם.
על מנת להעביר אליך הצעות ופרסומות רלוונטיות
• כדי לנהל הגרלות, תחרויות, הנחות או הצעות אחרות
• כדי לפתח, להציג ולקיים מעקב בנוגע לתכנים ולפרסומות המותאמים אישית לתחומי העניין שלך בשירותים שנו ובאתרים אחרים
• כדי ליצור אתך קשר באמצעות דואר אלקטרוני, טלפון, מדיה חברתית או מכשיר נייד בנוגע למוצרים או שירותים שלדעתנו יכולים לעניין אותך
על מנת לשפר את השירותים שלנו ולפתח שירותים חדשים
• כדי לנהל קבוצות מיקוד וסקרים
• כדי לבצע מחקר וניתוח של התנהגות המשתמשים במטרה לשפר את השירותים והתכנים שלנו (לדוגמה, ייתכן שנחליט לשנות את המראה והתחושה או אפילו לשנות מהותית אפשרות מסוימת בהתבסס על התנהגות המשתמשים)
• כדי לפתח תכונות ושירותים חדשים (למשל, ייתכן שנחליט ליצור אפשרות חדשה המבוססת על תחומי עניין כדי להיענות לבקשות המתקבלות ממשתמשים).
על מנת למנוע ולזהות מעשי הונאה או פעילויות בלתי חוקיות או לא מורשות אחרות וכדי להיאבק בהם
• כדי לטפל בהתנהגות פסולה מתמשכת או לכאורה בפלטפורמה עצמה ומחוץ לה
• כדי לבצע ניתוח נתונים במטרה להבין ולתכנן טוב יותר אמצעי-נגד מול אותן פעילויות
• כדי לשמור מידע הקשור לפעילויות הונאה במטרה למנוע את הישנותן
על מנת להבטיח עמידה בדרישות החוק
• כדי לעמוד בדרישות החוק
• כדי לסייע באכיפת החוק
• כדי לאכוף או לממש את הזכויות שלנו, כגון התנאים שלנו
על מנת לעבד את המידע שלך כמתואר לעיל, אנו מסתמכים על היסודות המשפטיים הבאים:
• מתן השירות שלנו עבורך: על פי רוב, אנו מעבדים את המידע שלך על מנת ליישם את החוזה שיש לך איתנו. לדוגמה, אם תרצה להשתמש בשירותים שלנו כדי ליצור קשרים משמעותיים, אנו נשתמש במידע שלך לשימור החשבון והפרופיל שלך, כך שמשתמשים אחרים יוכלו לצפות בהם וכדי להמליץ לך על משתמשים אחרים.
• אינטרסים לגיטימיים: ייתכן שאנו נעשה שימוש במידע שלך במקרים בהם יש לנו אינטרסים לגיטימיים לעשות זאת. למשל, אנו מבצעים ניתוח של התנהגות</Text>
</ScrollView>

      </View>
      <View style={{alignItems:'center',justifyContent:'center',alignSelf:'flex-start',flexDirection:'row',padding:width*0.01,marginLeft:width*0.02}}>
       <Switch
         onValueChange = {this.toggleSwitch2}
         value = {this.state.switch2Value}/>
         <Text style={{fontSize:width*0.04,marginLeft:width*0.05}}>אני מסכים</Text>
      </View>
     <TouchableOpacity style={{height:height*0.05,width:width*0.2,backgroundColor:'red',alignSelf:'center',justifyContent:'center',alignItems:'center',marginTop:height*0.02,borderRadius:width*0.03}} onPress={()=> this.proceedFurther()}>
     <Text style={{fontSize:width*0.05,color:'#fff'}}>מסכים</Text>
     </TouchableOpacity>
      
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

export default Terms;