import { Link, router } from "expo-router";
import { ImageBackground, Pressable, StyleSheet, Text, View, ViewComponent,Image } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
//import location_img from "./assets/location.png"

export default function index(navigation) {
  return (
    <View style={styles.container}>
      <View style={styles.main}>
  
        <Text style={styles.title}>Smart School Bus Tracking System</Text>
        <Text style={styles.welcome_text}>Welcome !</Text>
        <Text></Text>


        
        <View style={styles.button_pane}>
          {/* Location Button  */}
          <View style={styles.buttons}>
        <Pressable onPress={()=>router.push("/location")}>
                  <ImageBackground source={require("../assets/location.png")}
                    resizeMode="cover"
                    resizeMethod="resize"
                    style={styles.imgcontainer}>
                  <Text style={styles.buttons_text}>Location</Text>
                  </ImageBackground>
              </Pressable></View>

            <View style={styles.buttons}>
           {/* Attendance button */}
              <Pressable onPress={()=>router.push("/attendance")}>
                  <ImageBackground source={require("../assets/attendance.png")}
                    resizeMode="cover"
                    resizeMethod="resize"
                    style={styles.imgcontainer}>
                  <Text style={styles.buttons_text}>Attendance</Text>
                  </ImageBackground>
              </Pressable>
              </View>
              </View>
          </View>
        </View>
  );
}

const styles = StyleSheet.create({
  container: {
    
    flex: 1,
    alignItems: "top",
    padding: 24,
  },
  main: {

    flex: 6,
    
    maxWidth: 960,
    marginHorizontal: "auto",
  },

  title: {
    marginLeft:1,
    paddingLeft:10,
    width:400 ,
    fontSize: 40,
    fontWeight: "bold",
    color:'white',
    backgroundColor:'rgba(107, 15, 114, 1)'
  },
  welcome_text: {
    marginTop:40,
    fontSize: 36,
    fontWeight:'bold',
    color: "#38434D",
  },
  button_pane:{   
    marginTop:60,
    flex:1,
    alignItems:'flex-start'

   },
   buttons:{ 
    alignItems:'center',
    width:350,
    marginTop:30,
    fontWeight:'bold',
    
   },
   buttons_text:{
    fontSize:40,
    fontWeight:'bold',
    opacity:1,
    color:'rgba(44, 29, 59, 1)'
   },
   imgcontainer:{
    justifyContent:'center',
    alignItems:"center",
    height: 150,
    width: 370,
    overflow:'hidden',
    borderRadius:20
   }
});
