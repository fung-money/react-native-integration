import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { appStyles as styles } from '../styles';

export type PaymentMethod = 'wallet' | 'frictionless-card' | 'fingerprint-card' | 'challenge-card';

interface PaymentMethodSelectorProps {
  onPaymentMethodChange: (method: PaymentMethod) => void;
  initialPaymentMethod?: PaymentMethod;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  onPaymentMethodChange,
  initialPaymentMethod = 'wallet'
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(initialPaymentMethod);
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
    setShowPaymentDropdown(false);
    onPaymentMethodChange(method);
  };

  const getPaymentMethodLabel = (method: PaymentMethod): string => {
    switch (method) {
      case 'wallet':
        return 'Apple Pay';
      case 'frictionless-card':
        return 'Frictionless Card';
      case 'fingerprint-card':
        return 'Fingerprint Card';
      case 'challenge-card':
        return 'Challenge Card';
      default:
        return 'Apple Pay';
    }
  };

  const getPaymentMethodIcon = (method: PaymentMethod): string => {
    switch (method) {
      case 'wallet':
        return '🍎';
      case 'fingerprint-card':
        return '🔎 💳';
      case 'challenge-card':
        return '⚔️ 💳';
      case 'frictionless-card':
        return '✅ 💳';
      default:
        return '🍎';
    }
  };

  return (
    <>
      {/* Payment Method Section */}
      <View style={styles.section}>
        <View style={styles.paymentMethodCard}>
          <Text style={styles.paymentMethodLabel}>Payment Method</Text>
          <TouchableOpacity
            style={styles.paymentMethodSelector}
            onPress={() => setShowPaymentDropdown(true)}
          >
            <View style={styles.paymentMethodContent}>
              <Text style={styles.paymentMethodIcon}>
                {getPaymentMethodIcon(selectedPaymentMethod)}
              </Text>
              <Text style={styles.paymentMethodText}>
                {getPaymentMethodLabel(selectedPaymentMethod)}
              </Text>
            </View>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Payment Method Dropdown Modal */}
      <Modal
        visible={showPaymentDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPaymentDropdown(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPaymentDropdown(false)}
        >
          <View style={styles.dropdownContainer}>
            <TouchableOpacity
              style={[
                styles.dropdownOption,
                selectedPaymentMethod === 'wallet' && styles.selectedOption
              ]}
              onPress={() => handlePaymentMethodSelect('wallet')}
            >
              <Text style={styles.dropdownOptionIcon}>🍎</Text>
              <Text style={styles.dropdownOptionText}>Apple Pay</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.dropdownOption,
                selectedPaymentMethod === 'frictionless-card' && styles.selectedOption
              ]}
              onPress={() => handlePaymentMethodSelect('frictionless-card')}
            >
              <Text style={styles.dropdownOptionIcon}>✅ 💳</Text>
              <Text style={styles.dropdownOptionText}>Frictionless Card</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.dropdownOption,
                selectedPaymentMethod === 'fingerprint-card' && styles.selectedOption
              ]}
              onPress={() => handlePaymentMethodSelect('fingerprint-card')}
            >
              <Text style={styles.dropdownOptionIcon}>🔎 💳</Text>
              <Text style={styles.dropdownOptionText}>Fingerprint Card</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.dropdownOption,
                selectedPaymentMethod === 'challenge-card' && styles.selectedOption
              ]}
              onPress={() => handlePaymentMethodSelect('challenge-card')}
            >
              <Text style={styles.dropdownOptionIcon}>⚔️ 💳</Text>
              <Text style={styles.dropdownOptionText}>Challenge Card</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default PaymentMethodSelector;
