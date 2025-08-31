import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { AndroidAllowedAuthMethodsEnum, EnvironmentEnum, IosPKMerchantCapability, PaymentComplete, PaymentRequest } from '@rnw-community/react-native-payments';
import { PaymentMethodNameEnum, SupportedNetworkEnum } from '@rnw-community/react-native-payments';
import { generateBasicAuthDevHeader } from './lib/getAuth';
import TransactionStatus from './components/TransactionStatus';
import PaymentMethodSelector, { PaymentMethod } from './components/PaymentMethodSelector';
import { appStyles as styles } from './styles';
import Static from './components/Static';
import { PaymentMethodType, PaymentResult } from './lib/types';

const APPLE_PAY_MERCHANT_IDENTIFIER = 'merchant.com.example-tenant';

function App() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('wallet');
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
  };

  /**
   * Shared payment handler - delegates to specific payment methods
   * @param amount 
   * @param method 
   * @param operatingAccountId 
   * @param paymentContractId 
   */
  const handlePayment = async (amount: number, method: PaymentMethodType, operatingAccountId: string, paymentContractId?: string) => {
    setIsPaymentLoading(true);
    let result: PaymentResult;

    if (method === 'wallet') {
      result = await handleWalletPayment(amount, 'EUR', operatingAccountId);
    } else if (method === 'card' && paymentContractId) {
      result = await handleCardPayment(amount, 'EUR', paymentContractId, operatingAccountId);
    } else {
      throw new Error(`Unsupported payment method: ${method}`);
    }

    if (result.id) {
      setTransactionId(result.id);
    }

    if (result.status === 'INITIATED' && result.action === 'REDIRECT_SHOPPER') {
      await Linking.openURL(result.details!.url!);
    }

    setIsPaymentLoading(false);
  };

  /**
   * Handler for native mobile wallet payments
   * @param amount 
   * @param operatingAccountId 
   * @returns 
   */
  const handleWalletPayment = async (amount: number, currencyCode: string, operatingAccountId: string): Promise<PaymentResult> => {
    // Setup payment request
    const paymentRequest = new PaymentRequest(
      [
        {
          supportedMethods: PaymentMethodNameEnum.ApplePay,
          data: {
            merchantIdentifier: APPLE_PAY_MERCHANT_IDENTIFIER,
            merchantCapabilities: [IosPKMerchantCapability.PKMerchantCapability3DS],
            supportedNetworks: [SupportedNetworkEnum.Visa, SupportedNetworkEnum.Mastercard],
            countryCode: 'NL',
            currencyCode: currencyCode,
          },
        },
        {
          supportedMethods: PaymentMethodNameEnum.AndroidPay,
          data: {
            currencyCode: currencyCode,
            environment: EnvironmentEnum.TEST,
            supportedNetworks: [SupportedNetworkEnum.Visa, SupportedNetworkEnum.Mastercard],
            allowedAuthMethods: [AndroidAllowedAuthMethodsEnum.CRYPTOGRAM_3DS],
            gatewayConfig: {
              gateway: 'fungpayments',
              gatewayMerchantId: operatingAccountId,
            }
          }
        }
      ], {
      total: {
        amount: {
          currency: currencyCode,
          value: (amount / 100).toFixed(2), // Convert cents to euros
        },
        label: 'Total',
      }
    }
    );

    // Step 1: Invoke payment sheet
    const paymentResponse = await paymentRequest.show();
    // This token, as it is encrypted, is not in scope of PCI-DSS
    const applePayToken = paymentResponse.details.applePayToken;
    const googlePayToken = paymentResponse.details.androidPayToken;

    // Step 2: Call Embed API with one of the tokens
    const payload = {
      accountId: operatingAccountId,
      amount: amount,
      currencyCode: currencyCode,
      paymentMethodDetails: {
        card: {
          captureWhen: "MANUAL",
          transactionType: "FIRST_UNSCHEDULED",
          authorizationType: "FINAL_AUTH",
          // Check which one of the two tokens has been provided, each field is filled with an empty string by default
          applePayToken: applePayToken.paymentData.data ? JSON.stringify(applePayToken) : undefined,
          googlePayToken: googlePayToken.rawToken ? JSON.stringify(googlePayToken) : undefined,
        }
      }
    };

    console.error('Payload: ', payload);

    const response = await fetch('https://apidev.fungpayments.com/v2/payment/authorizePayment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': generateBasicAuthDevHeader(),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Step 3: Close payment sheet providing feedback to the user
    if (result.status === 'AUTHORIZED') {
      paymentResponse.complete(PaymentComplete.SUCCESS);
    } else {
      paymentResponse.complete(PaymentComplete.FAIL);
    }

    return result;
  };

  /**
   * Handler for card payments
   * @param amount 
   * @param currencyCode 
   * @param paymentContractId 
   * @param operatingAccountId 
   */
  const handleCardPayment = async (amount: number, currencyCode: string, paymentContractId: string, operatingAccountId: string): Promise<PaymentResult> => {
    const payload = {
      amount: amount,
      currencyCode: currencyCode,
      paymentContractId: paymentContractId,
      accountId: operatingAccountId,
      paymentMethodDetails: {
        card: {
          captureWhen: "MANUAL",
          preAuthorizationType: "INCREMENTAL",
          authorizationType: "PRE_AUTH",
          initiatorType: "SHOPPER",
          redirectUrl: "applepaytestsasha://test"
        }
      }
    };

    const response = await fetch('https://apidev.fungpayments.com/v2/payment/paymentContract/createCharge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': generateBasicAuthDevHeader(),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  };

  const handlePaymentButtonPress = async () => {
    const HARDCODED_OPERATING_ACCOUNT_ID = "31210041cfbe1012e658db16016";
    const FINGERPRINT_CARD_CONTRACT_ID = "312104c1d0d88012f67b6184018";
    const CHALLENGE_CARD_CONTRACT_ID = "312104c1d0c44012f585a9de013";
    const FRICTIONLESS_CARD_CONTRACT_ID = "312104c1d0d88012f67b6184018";

    switch (selectedPaymentMethod) {
      case 'wallet':
        await handlePayment(100, 'wallet', HARDCODED_OPERATING_ACCOUNT_ID);
        break;
      case 'fingerprint-card':
        await handlePayment(101, 'card', HARDCODED_OPERATING_ACCOUNT_ID, FINGERPRINT_CARD_CONTRACT_ID);
        break;
      case 'challenge-card':
        await handlePayment(101, 'card', HARDCODED_OPERATING_ACCOUNT_ID, CHALLENGE_CARD_CONTRACT_ID);
        break;
      case 'frictionless-card':
        await handlePayment(100, 'card', HARDCODED_OPERATING_ACCOUNT_ID, FRICTIONLESS_CARD_CONTRACT_ID);
        break;
    }
  };

  const handleBackToMain = () => {
    setTransactionId(null);
  };

  // Show transaction status page if we have a transaction ID and should show status
  if (transactionId) {
    return (
      <TransactionStatus
        transactionId={transactionId}
        onBack={handleBackToMain}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Static />

      {/* Payment Method Section */}
      <PaymentMethodSelector
        onPaymentMethodChange={handlePaymentMethodChange}
        initialPaymentMethod={selectedPaymentMethod}
      />

      {/* Payment Button Section */}
      <View style={styles.paymentButtonSection}>
        <Text style={styles.reservationText}>We will make a €45.00 reservation on your credit card</Text>
        <TouchableOpacity
          style={styles.paymentButton}
          onPress={handlePaymentButtonPress}
          disabled={isPaymentLoading}
        >
          {isPaymentLoading ? <ActivityIndicator size="small" color="#ffffff" /> : <Text style={styles.paymentButtonText}>Pay & Start Charging</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default App;
