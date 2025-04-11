import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { ref, query, orderByKey, startAt, endAt, onValue } from 'firebase/database';
import { db } from '../config/firebaseConfig';
import { useRoute } from '@react-navigation/native';

export default function Attendance() {
  // todayData will contain combined attendance records for all provided users.
  const [todayData, setTodayData] = useState([]);
  // studentsMap will map cardId (i.e. uid) to student names.
  const [studentsMap, setStudentsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const route = useRoute();
  const { userData } = route.params; // userData should include both date and an array of uids (e.g. userData.uid)

  // Fetch students mapping so we can attach the names later.
  useEffect(() => {
    const studentRef = ref(db, '/Busses/students');
    const unsubscribeStudents = onValue(studentRef, snapshot => {
      const mapping = {};
      snapshot.forEach(childSnapshot => {
        const student = childSnapshot.val();
        // Assuming cardId is used as uid in attendanceHistory.
        mapping[student.cardId] = student.name;
      });
      setStudentsMap(mapping);
    }, error => {
      console.error('Firebase error (students):', error);
    });
    return () => unsubscribeStudents();
  }, []);

  // Fetch attendance data for all user IDs for the given date.
  useEffect(() => {
    if (!userData?.uid?.length || !userData?.date) {
      setError('Missing user IDs or date');
      setLoading(false);
      return;
    }

    const formattedDate = userData.date.replace(/-/g, '');
    const attendanceRef = ref(db, '/Busses/attendanceHistory');
    const unsubscribeFunctions = [];
    let allRecords = [];
    let completedQueries = 0;
    const totalQueries = userData.uid.length;

    // For each uid, run a separate query.
    userData.uid.forEach(uid => {
      const uidQuery = query(
        attendanceRef,
        orderByKey(),
        startAt(`${uid}_${formattedDate}_`),
        endAt(`${uid}_${formattedDate}_\uf8ff`)
      );
      const unsubscribe = onValue(uidQuery, snapshot => {
        snapshot.forEach(childSnapshot => {
          allRecords.push({
            key: childSnapshot.key,
            ...childSnapshot.val()
          });
        });
        completedQueries++;
        // When all uid queries are completed, update state.
        if (completedQueries === totalQueries) {
          setTodayData(allRecords);
          setLoading(false);
        }
      }, error => {
        console.error('Firebase error (attendance):', error);
        setError(error.message);
        setLoading(false);
      });
      unsubscribeFunctions.push(unsubscribe);
    });

    // Cleanup subscriptions on unmount.
    return () => {
      unsubscribeFunctions.forEach(unsub => unsub());
    };
  }, [userData?.uid, userData?.date]);

  // Process attendance records:
  // For each user on a specific date, sort the scan times and assume:
  //  - First scan is check-in.
  //  - Second scan is check-out.
  const processAttendance = (data) => {
    const attendanceMap = data.reduce((acc, entry) => {
      const [uid, dateStr, timeStr] = entry.key.split('_');
      const formattedDate = `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
      // Format the time from the key into HH:MM:SS.
      const formattedTime = `${timeStr.slice(0, 2)}:${timeStr.slice(2, 4)}:${timeStr.slice(4, 6)}`;
      const key = `${uid}_${dateStr}`;
      
      if (!acc[key]) {
        acc[key] = {
          uid,
          date: formattedDate,
          times: []  // Collect all scan times for this uid and date
        };
      }
      acc[key].times.push(formattedTime);
      return acc;
    }, {});

    const markers = Object.values(attendanceMap).map(item => {
      // Sort times chronologically.
      item.times.sort();
      return {
        uid: item.uid,
        date: item.date,
        // First record is check-in and second record is check-out (if available)
        checkin: item.times[0] || null,
        checkout: item.times[1] || null,
        status: item.times.length >= 2 ? 'Completed' : 'Pending'
      };
    });

    // Attach student name using the studentsMap.
    markers.forEach(marker => {
      marker.name = studentsMap[marker.uid] || 'Unknown';
    });
    return markers;
  };

  const attendanceMarkers = processAttendance(todayData);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance Records</Text>
      {attendanceMarkers.length > 0 ? (
        attendanceMarkers.map((marker) => (
          <View key={`${marker.uid}_${marker.date}`} style={styles.markerContainer}>
            <Text style={styles.userName}>Name: {marker.name}</Text>
            <Text style={styles.date}>Date: {marker.date}</Text>

            <View style={styles.timeSection}>
              <Text style={styles.timeLabel}>Check-in:</Text>
              <Text style={styles.timeText}>🕒 {marker.checkin || 'N/A'}</Text>
            </View>

            <View style={styles.timeSection}>
              <Text style={styles.timeLabel}>Check-out:</Text>
              <Text style={styles.timeText}>✅ {marker.checkout || 'N/A'}</Text>
            </View>

            <View style={styles.summary}>
              <Text style={styles.statusText}>
                Status: {marker.status}
              </Text>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.noRecords}>No attendance records found</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  markerContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 12,
  },
  timeSection: {
    marginBottom: 12,
  },
  timeLabel: {
    fontWeight: '500',
    color: '#34495e',
    marginBottom: 4,
  },
  timeText: {
    color: '#2c3e50',
    marginLeft: 8,
  },
  summary: {
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingTop: 12,
    marginTop: 8,
  },
  statusText: {
    marginTop: 8,
    color: '#27ae60',
    fontWeight: '500',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 16,
  },
  noRecords: {
    textAlign: 'center',
    color: '#95a5a6',
    fontSize: 16,
    marginTop: 20,
  },
});
