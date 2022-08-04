import { Platform } from "react-native";
import { getData, storeData } from "./utils";
import * as RNIap from "react-native-iap";

import { print } from "./Logger";

const APPLE_PASSWORD = "f1475c5cd4a045109e2e8cdb85eb7fd1";

const SKU_WEEK = "333";
const SKU_MONTH = "444";
const SKU_10coins = "10coins";
const SKU_80coins = "80coins";
const SKU_200coins = "200coins";
const SKU_500coins = "500coins";
const SKU_1000coins = "1000coins";
const SKU_2000coins = "2000coins";

const SUBSCRIPTION = "SUBSCRIPTION";

const SKUS = [SKU_WEEK, SKU_MONTH, SKU_10coins, SKU_80coins, SKU_200coins, SKU_500coins, SKU_1000coins, SKU_2000coins];

const NO_SUBSCRIPTION = {
  productId: "000",
};

purchaseUpdateSubscription = null;
purchaseErrorSubscription = null;

export default {
  init: async (callback) => {
    try {
      await RNIap.initConnection();
      await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
      if (Platform.OS == "ios") await RNIap.clearTransactionIOS();
    } catch (err) {
      print("initConnection ERROR >>", err.message);
    }

    purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
      async (purchase) => {
        const receipt = purchase.transactionReceipt;
        if (receipt) {
          try {
            let data = purchase;

            callback(data);

            if (data.productId != "333" && data.productId != "444") {
              if (Platform.OS === 'ios') {
                await RNIap.finishTransactionIOS(purchase.transactionId);
              } else if (Platform.OS === 'android') {
                await RNIap.consumePurchaseAndroid(purchase.purchaseToken);
                await RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken);
              }
            }
            else
              storeData(SUBSCRIPTION, JSON.stringify(data));

            let result = await RNIap.finishTransaction(purchase);
          } catch (ackErr) {
            print("IAP purchaseUpdatedListener ERROR >", ackErr);
            callback(NO_SUBSCRIPTION);
          }
        } else {
          print("IAP purchaseUpdatedListener ERROR > receipt is null");
          callback(NO_SUBSCRIPTION);
        }
      }
    );

    purchaseErrorSubscription = RNIap.purchaseErrorListener((err) => {
      callback(NO_SUBSCRIPTION);
    });

    callback();
  },

  validateSubscriptions: (callback) => {
    getData(SUBSCRIPTION).then(async (data) => {
      if (data) {
        let purchase = JSON.parse(data);

        if (Platform.OS == "android") {
          let purchases = await RNIap.getAvailablePurchases();

          if (purchases) {
            let data = purchases.map((purchase) => {
              return purchase;
            });

            if (data.length) {
              let sortedData = data.sort(
                (d1, d2) => d1.transactionDate < d2.transactionDate
              );

              let lastPurchase = sortedData[0];

              callback(purchase);
            } else {
              storeData(SUBSCRIPTION, JSON.stringify(NO_SUBSCRIPTION));
              callback(NO_SUBSCRIPTION);
            }
          } else {
            storeData(SUBSCRIPTION, JSON.stringify(NO_SUBSCRIPTION));
            callback(NO_SUBSCRIPTION);
          }
        } else {
          const receiptBody = {
            "receipt-data": purchase.transactionReceipt,
            password: APPLE_PASSWORD,
          };

          let result = await RNIap.validateReceiptIos(receiptBody, false);

          if (result && result.status && result.status == 21007) {
            result = await RNIap.validateReceiptIos(receiptBody, true);
          }

          if (
            result &&
            result.pending_renewal_info &&
            result.pending_renewal_info.length
          ) {
            let expirationIntent =
              result.pending_renewal_info[0].expiration_intent;

            //  1 - The customer voluntarily canceled their subscription.
            //  2 - Billing error; for example, the customer's payment information was no longer valid.
            //  3 - The customer did not agree to a recent price increase.
            //  4 - The product was not available for purchase at the time of renewal.
            //  5 - Unknown error.

            if (expirationIntent) {
              storeData(SUBSCRIPTION, JSON.stringify(NO_SUBSCRIPTION));
              callback(NO_SUBSCRIPTION);
            }
          }
        }
      }
    });
  },

  getCurrentSubscription: (callback) => {
    getData(SUBSCRIPTION).then((data) => {
      if (data) {
        let purchase = JSON.parse(data);
        callback(purchase);

        /*let productId = purchase.productId;
          let expiredDate = moment(purchase.transactionDate).add(1, productId == SKU_WEEK ? 'week' : 'month');
          if (moment().isAfter(expiredDate)) {
            print('getCurrentSubscription', NO_SUBSCRIPTION);
            callback(NO_SUBSCRIPTION);
          } else {
            print('getCurrentSubscription', PurchaseToData(purchase));
            callback(purchase);
          }*/
      } else {
        callback(NO_SUBSCRIPTION);
      }
    });
  },

  release: () => {
    if (purchaseUpdateSubscription) {
      purchaseUpdateSubscription.remove();
      purchaseUpdateSubscription = null;
    }
    if (purchaseErrorSubscription) {
      purchaseErrorSubscription.remove();
      purchaseErrorSubscription = null;
    }
  },

  requestSubscriptionWeek: async () => {
    try {
      let data = await RNIap.getSubscriptions(SKUS);
      await RNIap.requestSubscription(SKU_WEEK);
    } catch (err) {
      print("requestSubscriptionMonth ERROR >", err);
    }
  },

  requestSubscriptionMonth: async () => {
    try {
      let data = await RNIap.getSubscriptions(SKUS);
      await RNIap.requestSubscription(SKU_MONTH);
    } catch (err) {
      print("requestSubscriptionMonth ERROR >", err);
    }
  },

  requestPurchase: async (pack) => {
    try {
      await RNIap.getProducts(['10coins', '80coins', '200coins', '500coins', '1000coins', '2000coins']);
      await RNIap.requestPurchase(pack, false);
    } catch (err) {
      console.log("requestPurchase ERROR >", err);
    }
  },

  restorePurchases: async (callback) => {
    try {
      let purchases = await RNIap.getAvailablePurchases();

      if (purchases) {
        let data = purchases.map((purchase) => {
          return purchase;
        });

        if (data.length) {
          let sortedData = data.sort(
            (d1, d2) => d1.transactionDate < d2.transactionDate
          );
          let purchase = sortedData[0];

          if (Platform.OS == "android") {
            storeData(SUBSCRIPTION, JSON.stringify(purchase));
            callback(purchase);
          } else {
            const receiptBody = {
              "receipt-data": purchase.transactionReceipt,
              password: APPLE_PASSWORD,
            };

            let result = await RNIap.validateReceiptIos(receiptBody, false);

            if (result && result.status && result.status == 21007) {
              result = await RNIap.validateReceiptIos(receiptBody, true);
            }

            if (
              result &&
              result.pending_renewal_info &&
              result.pending_renewal_info.length
            ) {
              let expirationIntent =
                result.pending_renewal_info[0].expiration_intent;

              if (expirationIntent) {
                callback(NO_SUBSCRIPTION);
              } else {
                storeData(SUBSCRIPTION, JSON.stringify(purchase));
                callback(purchase);
              }
            } else {
              callback(NO_SUBSCRIPTION);
            }
          }
        } else {
          callback(NO_SUBSCRIPTION);
        }
      } else {
        callback(NO_SUBSCRIPTION);
      }
    } catch (err) {
      console.warn(err.code, err.message);
      callback(NO_SUBSCRIPTION);
    }
  },
};
