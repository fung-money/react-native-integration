import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { generateBasicAuthDevHeader } from '../lib/getAuth';

interface TransactionData {
  id: string;
  createdAt: string;
  updatedAt: string;
  accountId: string;
  merchantAccountId: string;
  status: string;
  latestStatus: string;
}

interface TransactionStatusProps {
  transactionId: string;
  onBack: () => void;
}

const TransactionStatus: React.FC<TransactionStatusProps> = ({ transactionId, onBack }) => {
  const [transactionData, setTransactionData] = useState<TransactionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pollingIntervalRef = useRef<any | null>(null);

  const fetchTransactionStatus = useCallback(async () => {
    try {
      const response = await fetch(`https://apidev.fungpayments.com/v2/transaction/getTransactionById/${transactionId}`, {
        headers: {
          'Authorization': generateBasicAuthDevHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: TransactionData = await response.json();
      setTransactionData(data);
      setError(null);

      // Stop polling if transaction is in a final state
      if (['AUTHORIZED', 'DECLINED', 'FAILED', 'CANCELLED'].includes(data.status)) {
        if (pollingIntervalRef.current) {
          setIsLoading(false);
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transaction status');
    }
  }, [transactionId]);

  useEffect(() => {
    // Initial fetch
    fetchTransactionStatus();

    // Start polling every 5 seconds
    pollingIntervalRef.current = setInterval(fetchTransactionStatus, 5000);

    // Cleanup on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [transactionId, fetchTransactionStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AUTHORIZED':
        return '#4CAF50';
      case 'DECLINED':
      case 'FAILED':
        return '#F44336';
      case 'CANCELLED':
        return '#FF9800';
      case 'INITIATED':
      case 'PENDING':
        return '#2196F3';
      default:
        return '#666666';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'AUTHORIZED':
        return '✅';
      case 'DECLINED':
      case 'FAILED':
        return '❌';
      case 'CANCELLED':
        return '⚠️';
      case 'INITIATED':
      case 'PENDING':
        return '⏳';
      default:
        return '❓';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading transaction status...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction Status</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Transaction ID */}
      <View style={styles.section}>
        <View style={styles.transactionIdCard}>
          <Text style={styles.transactionIdLabel}>Transaction ID</Text>
          <Text style={styles.transactionIdText}>{transactionId}</Text>
        </View>
      </View>

      {/* Status Display */}
      {transactionData && (
        <>
          <View style={styles.section}>
            <View style={styles.statusCard}>
              <View style={styles.statusHeader}>
                <Text style={styles.statusIcon}>{getStatusIcon(transactionData.status)}</Text>
                <Text style={[styles.statusText, { color: getStatusColor(transactionData.status) }]}>
                  {transactionData.status}
                </Text>
              </View>
              <Text style={styles.statusDescription}>
                {transactionData.status === 'AUTHORIZED' && 'Payment has been successfully authorized'}
                {transactionData.status === 'DECLINED' && 'Payment was declined'}
                {transactionData.status === 'CANCELLED' && 'Payment was cancelled'}
              </Text>
            </View>
          </View>

          {/* Transaction Details */}
          <View style={styles.section}>
            <View style={styles.detailsCard}>
              <Text style={styles.detailsTitle}>Transaction Details</Text>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Created:</Text>
                <Text style={styles.detailValue}>{formatDate(transactionData.createdAt)}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Updated:</Text>
                <Text style={styles.detailValue}>{formatDate(transactionData.updatedAt)}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Account ID:</Text>
                <Text style={styles.detailValue}>{transactionData.accountId}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Merchant Account:</Text>
                <Text style={styles.detailValue}>{transactionData.merchantAccountId}</Text>
              </View>
            </View>
          </View>
        </>
      )}

      {/* Error Display */}
      {error && (
        <View style={styles.section}>
          <View style={styles.errorCard}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        </View>
      )}

      {/* Refresh Button */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.refreshButton} onPress={fetchTransactionStatus}>
          <Text style={styles.refreshButtonText}>Refresh Status</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 24,
    color: '#000000',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    flex: 1,
  },
  headerSpacer: {
    width: 39, // Same width as back button for centering
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  transactionIdCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 24,
  },
  transactionIdLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 8,
  },
  transactionIdText: {
    fontSize: 16,
    fontFamily: 'monospace',
    color: '#000000',
  },
  statusCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 24,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  statusText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statusDescription: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 22,
  },
  detailsCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 24,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#000000',
    fontFamily: 'monospace',
  },
  errorCard: {
    backgroundColor: '#FFEBEE',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  errorIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#D32F2F',
    textAlign: 'center',
    lineHeight: 22,
  },
  refreshButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TransactionStatus;
