import { useNavigation } from "@react-navigation/native"; // Changed from expo-router
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Fontisto from '@expo/vector-icons/Fontisto';
import { db } from '../config/firebaseConfig';
import { useState, useEffect } from "react";
import { ref, onValue, off } from 'firebase/database';
import { Image } from "expo-image";
import busimg from "../assets/sbus.png"; // Note: import updated to default import style if available
import dayjs from 'dayjs';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [userid, setUserid] = useState(null);
  const [studentsarray, setstudentsarray] = useState(null);
  const [currenTime, setCurrentTime] = useState(null);
  const [currenDate, setCurrentDate] = useState(null);
  const [currenDate_4database, setCurrentDate_4database] = useState(null);

  // Firebase data effect
  useEffect(() => {
    const busRef = ref(db, '/Busses/students/');
    const listener = onValue(busRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        console.log(data);
      }
    });
    return () => off(busRef, listener);
  }, []);

  // Time update effect
  useEffect(() => {
    const timer = setInterval(() => {
      const current_dte = dayjs().format('DD, MM, YYYY   dddd');
      const current_tim = dayjs().format('h:mm:ss A');
      setCurrentDate(current_dte);
      setCurrentTime(current_tim);
      setCurrentDate_4database(dayjs().format('YYYYMMDD'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const userData = {
    uid: ['0693EF97', '8184B47B', 'F7D3BF85', '5169AE7B'],
    date: currenDate_4database,
    user_ar: studentsarray,
    cur_date_4UI: currenDate
  };

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={['#81B7E4cc', 'transparent']}
        style={styles.background}
      >
        <View style={styles.main}>
          <Text style={styles.title}>Smart School Bus Tracker</Text>
          <Text style={styles.welcomeText}>Welcome!</Text>
          {/* Date and time container */}
          <View style={styles.dateTimeContainer}>
            <Text style={styles.dateText}>{currenDate}</Text>
            <Text style={styles.timeText}>{currenTime}</Text>
          </View>
          <View style={styles.buttonPane}>
            {/* Location Button */}
            <View style={styles.buttonWrapper}>
              <Pressable 
                style={styles.pressable} 
                onPress={() => navigation.navigate("location")}
              >
                <View style={styles.buttonContent}>
                  <FontAwesome5 name="map-marked-alt" size={60} color="#1E1B7D" />
                  <Text style={styles.buttonText}>Location</Text>
                </View>
              </Pressable>
            </View>
            {/* Attendance Button */}
            <View style={styles.buttonWrapper}>
              <Pressable 
                style={styles.pressable} 
                onPress={() => navigation.navigate("attendance", { userData })}
              >
                <View style={styles.buttonContent}>
                  <Fontisto name="person" size={60} color="#1E1B7D" />
                  <Text style={styles.buttonText}>Attendance</Text>
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
    backgroundColor: '#f7f7f7',
  },
  background: {
    flex: 1,
  },
  main: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 32,
    textAlign: 'center',
    fontWeight: "600",
    color: '#1C92C9',
    backgroundColor: '#e0e0e6',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    overflow: 'hidden',
    width: '100%',
  },
  busImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginVertical: 30,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '500',
    color: "#111",
    marginBottom: 20,
  },
  dateTimeContainer: {
    width: '100%',
    backgroundColor: '#07033D',
    paddingVertical: 20,
    borderRadius: 15,
    marginBottom: 30,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '600',
  },
  timeText: {
    fontSize: 20,
    color: '#fff',
    marginTop: 5,
  },
  buttonPane: {
    width: '100%',
    alignItems: 'center',
  },
  buttonWrapper: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 15,
    elevation: 8,
    shadowColor: '#02022E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    marginVertical: 10,
  },
  pressable: {
    paddingVertical: 25,
    paddingHorizontal: 15,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 26,
    fontWeight: '600',
    color: '#1E1B7D',
    marginLeft: 25,
  },
});

