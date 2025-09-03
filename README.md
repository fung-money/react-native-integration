# React native Payments with Embed - Example App

This is an example App demonstrating how to integrate native Google Pay and Apple Pay in react-native with Embed for processing payments

Embed recommends using the [react-native-payments](https://www.npmjs.com/package/@rnw-community/react-native-payments?activeTab=readme) library for interfacing with native wallet technologies. It greatly simplifies the integration.

**NOTE**: Because both the Apple Pay and Google Pay tokens returned to your application are encrypted and one time use, transmitting and storing them **DOES NOT** fall in scope of PCI-DSS.

## Repo description

Key logic can be found in `App.tsx`, specifically in the function `handleWalletPayment`. It is already cross platform supporting both Apple Pay and Google Pay (called AndroidPay by the `react-native-payments` library). For simplicity the demo app directly calls Embed APIs.

## Apple Pay Specific Setup

### Technical
Import the `PassKit` library to make Apple Pay available to your application:

Objective-C setup in `AppDelegate` file
```objective-c
#import <RCTAppDelegate.h>
#import <UIKit/UIKit.h>

#import <PassKit/PassKit.h> // Add this import

@interface AppDelegate : RCTAppDelegate
```

Swift setup in `AppDelegate.swift`
```swift
import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

import PassKit // Add this import
```

### Operational
Follow this guide to setup an Apple Pay Merchant ID per tenant and to enable Apple Pay in the application settings:
https://developer.apple.com/library/archive/ApplePay_Guide/Configuration.html

The certificate you downloaded must be securely shared with Embed. This is a one time per tenant setup. Embed will associate it with the tenant. 
**NOTE**: A new certificate must be generated and shared every 25 months.

## Google Pay Specific Setup

### Technical

Follow this guide to setup the required dependency for Google Pay:
https://developers.google.com/pay/api/android/guides/setup

### Operational

No operational setup is necessary