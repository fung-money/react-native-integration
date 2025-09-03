import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { AndroidAllowedAuthMethodsEnum, EnvironmentEnum, IosPKMerchantCapability, PaymentComplete, PaymentRequest, PaymentResponse } from '@rnw-community/react-native-payments';
import { PaymentMethodNameEnum, SupportedNetworkEnum } from '@rnw-community/react-native-payments';
import { generateBasicAuthDevHeader } from './lib/getAuth';
import TransactionStatus from './components/TransactionStatus';
import { appStyles as styles } from './styles';
import Static from './components/Static';
import { encode } from 'base-64';

const APPLE_PAY_MERCHANT_IDENTIFIER = 'merchant.com.example-tenant';

function App() {
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const handleWalletPayment = async () => {
    const PAYMENT_AMOUNT_IN_CENTS = 101; // EUR 1.01
    const PAYMENT_CURRENCY_CODE = 'EUR';
    const OPERATING_ACCOUNT_ID = '31210041cfbe1012e658db16016';

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
            currencyCode: PAYMENT_CURRENCY_CODE,
          },
        },
        {
          supportedMethods: PaymentMethodNameEnum.AndroidPay,
          data: {
            currencyCode: PAYMENT_CURRENCY_CODE,
            environment: EnvironmentEnum.TEST,
            supportedNetworks: [SupportedNetworkEnum.Visa, SupportedNetworkEnum.Mastercard],
            allowedAuthMethods: [AndroidAllowedAuthMethodsEnum.CRYPTOGRAM_3DS],
            gatewayConfig: {
              gateway: 'fungpayments',
              gatewayMerchantId: OPERATING_ACCOUNT_ID,
            }
          }
        }
      ], {
      total: {
        amount: {
          currency: PAYMENT_CURRENCY_CODE,
          value: (PAYMENT_AMOUNT_IN_CENTS / 100).toFixed(2), // Convert cents to euros
        },
        label: 'Total',
      }
    });

    // Check if native wallet is supported by the users device
    const canShow = await paymentRequest.canMakePayment();
    if (!canShow) {
      // Native wallet not supported by the users device
      return;
    }

    // Invoke payment sheet
    let paymentResponse: PaymentResponse;
    try {
      paymentResponse = await paymentRequest.show();
    } catch (error) {
      // User cancelled the payment or error occurred
      return;
    }

    // This token, as it is encrypted, is not in scope of PCI-DSS
    const applePayToken = paymentResponse.details.applePayToken;
    const googlePayToken = paymentResponse.details.androidPayToken;

    // Pass the token to Embed API with one of the tokens
    const payload = {
      accountId: OPERATING_ACCOUNT_ID,
      amount: PAYMENT_AMOUNT_IN_CENTS,
      currencyCode: PAYMENT_CURRENCY_CODE,
      paymentMethodDetails: {
        card: {
          captureWhen: "MANUAL",
          transactionType: "FIRST_UNSCHEDULED",
          authorizationType: "FINAL_AUTH",
        },
      }
    } as any;

    // Send the complete token JSON string encoded to Embed
    if (applePayToken.paymentData.data) {
      payload.paymentMethodDetails.card.encryptedToken = encode(JSON.stringify(applePayToken));
      payload.paymentMethodDetails.card.paymentMethod = "APPLE_PAY";
    } else if (googlePayToken.rawToken) {
      payload.paymentMethodDetails.card.encryptedToken = encode(JSON.stringify(googlePayToken));
      payload.paymentMethodDetails.card.paymentMethod = "GOOGLE_PAY";
    }

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

    // Close payment sheet providing feedback to the user
    if (result.status === 'AUTHORIZED') {
      paymentResponse.complete(PaymentComplete.SUCCESS);
    } else {
      paymentResponse.complete(PaymentComplete.FAIL);
    }


    if (result.id) {
      setTransactionId(result.id);
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

      <View style={styles.paymentButtonSection}>
        <Text style={styles.reservationText}>We will make a €45.00 reservation on your credit card</Text>
        <TouchableOpacity
          style={styles.paymentButton}
          onPress={handleWalletPayment}
        >
          <Text style={styles.paymentButtonText}>Pay & Start Charging</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default App;
