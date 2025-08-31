import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { appStyles as styles } from '../styles';

const Static: React.FC<{}> = () => {
  return (
    <>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Start a charging session</Text>
          <Text style={styles.stationId}>IT*ATE*E00335*1</Text>
          <View style={styles.statusContainer}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Available</Text>
            </View>
            <View style={styles.powerBadge}>
              <Text style={styles.powerText}>300 kW</Text>
            </View>
          </View>
        </View>
        <View style={styles.headerIcon}>
          <Text style={styles.headerIconText}>🔌</Text>
        </View>
      </View>

      {/* Vehicle Section */}
      <View style={styles.section}>
        <View style={styles.vehicleCard}>
          <View style={styles.carIcon}>
            <Text style={styles.carIconText}>🚗</Text>
          </View>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
          <Text style={styles.addVehicleText}>Add a vehicle</Text>
        </View>
      </View>

      {/* Cost Section */}
      <View style={styles.section}>
        <View style={styles.costCard}>
          <View style={styles.costHeader}>
            <Text style={styles.walletIcon}>💰</Text>
            <Text style={styles.costAmount}>~ €15.86</Text>
          </View>
          <Text style={styles.costDescription}>Estimated total costs (prices incl. VAT)</Text>
          <TouchableOpacity style={styles.detailsButton}>
            <Text style={styles.detailsIcon}>▼</Text>
            <Text style={styles.detailsText}>Show details</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* RFID Section */}
      <View style={styles.section}>
        <View style={styles.rfidCard}>
          <Text style={styles.rfidLabel}>RFID</Text>
          <View style={styles.rfidContent}>
            <Text style={styles.rfidIcon}>📡</Text>
            <Text style={styles.rfidId}>IT-ATL-CUMCBSWNL-I</Text>
          </View>
        </View>
      </View>


    </>
  )
};

export default Static;