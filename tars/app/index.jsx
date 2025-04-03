import {  router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Fontisto from '@expo/vector-icons/Fontisto';

export default function index() {



  return (
    <View style={styles.container}>
     <LinearGradient 
        colors={['rgba(0,0,0,0.8)', 'transparent']}
        style={styles.background}
        >
     
      <View style={styles.main}>

      <View style={styles.main_
        
      }>
        <Text style={styles.title}>Smart School Bus Tracker</Text>
      </View>
        <Text style={styles.welcome_text}>Welcome !</Text>

        
        <View style={styles.button_pane}>
          {/* Location Button  */}
          <View style={styles.buttons}>
        <Pressable onPress={()=>router.push("/location")}>
                      <View style={styles.button_content}>
                    <FontAwesome5 name="map-marked-alt" size={60} color="white" />
                  <Text style={styles.buttons_text}>Location</Text>
                  </View>

        </Pressable>
        </View>

           {/* Attendance button */}
           <View style={styles.buttons}>
              <Pressable onPress={()=>router.push("/attendance")}>
              <View style={styles.button_content}>
              <Fontisto name="person" size={60} color="white" />
              <Text style={styles.buttons_text}>Attendance</Text>
              </View>
              </Pressable>
              </View>
              </View>
            </View>
          </LinearGradient>
          </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'orange',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  main: {

    flex: 6, 
    maxWidth: 960,
    marginHorizontal: "auto",
  },

  title: {
  
    marginTop:10,
    marginLeft:50,
    paddingLeft:10,
    width:400 ,
    fontSize: 40,
    fontWeight: "bold",
    color:'white',
  },
  welcome_text: {
    marginLeft:5,
    marginTop:40,
    fontSize: 36,
    fontWeight:'bold',
    color: "white",
  },
  button_pane:{  
    marginLeft:5,
    marginTop:60,
    flex:1,
    alignItems:'flex-start',
    alignItems:'center'

   },
   buttons:{ 

    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderRadius:20,
    alignItems:'center',
    width:300,
    padding:30,
    marginTop:30,
    fontWeight:'bold',
    backgroundColor:'black'
    
   },
   button_content:{
    flexDirection:'row'
   },
   buttons_text:{
    
    marginLeft:50,
    fontSize:30,
    fontWeight:'bold',
    opacity:1,
    color:'rgb(239, 236, 242)'
   },
   
   imgcontainer:{
    justifyContent:'center',
    alignItems:"center",
    height: 150,
    width: 370,
    overflow:'hidden',
    borderRadius:20
   },
   
});
