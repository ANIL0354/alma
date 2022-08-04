import { SECRET_KEY } from "./utils";

import { print } from "./Logger";

isLocationSent = false;
isPayloadSent = false;
isNotificationSent = false;
isSubscriptionSent = false;
isPurchaseSent = false;

export const publishLocation = (location, prefix, sessionId, force = false) => {
  if (force) {
    isLocationSent = false;
  }

  if (!location) return;
  if (!prefix) return;
  if (!sessionId) return;
  if (isLocationSent) return;

  let body = JSON.stringify({
    api_key: SECRET_KEY,
    session_id: sessionId,
    latitude: location.latitude,
    longitude: location.longitude,
  });

  var urlPost = "https://" + prefix + "-chat.alma-app.co/app/set_location";

  fetch(urlPost, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body,
  })
    .then((response) => {
      if (response && response.ok) {
        return response.text();
      } else {
        throw "publishLocation FAILED " + JSON.stringify(response);
      }
    })
    .then((text) => {
      if (text && text.indexOf("failed") == -1) {
        isLocationSent = true;
      }
    })
    .catch((error) => {

    });
};

export const publishPayload = (data, prefix, sessionId, force = false) => {
  if (force) {
    isPayloadSent = false;
  }

  if (!data) return;
  if (!prefix) return;
  if (!sessionId) return;
  if (isPayloadSent) return;

  let body = JSON.stringify({
    api_key: SECRET_KEY,
    session_id: sessionId,
    payload: data,
  });

  var urlPost = "https://" + prefix + "-chat.alma-app.co/app/set_url_payload";

  fetch(urlPost, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body,
  })
    .then((response) => {
      if (response && response.ok) {
        return response.text();
      } else {
        throw "publishPayload FAILED " + JSON.stringify(response);
      }
    })
    .then((text) => {
      if (text && text.indexOf("failed") == -1) {
        isPayloadSent = true;
      }
    })
    .catch((error) => {

    });
};

export const publishNotification = (data, prefix, sessionId, force = false) => {
  if (force) {
    isNotificationSent = false;
  }

  if (!data) return;
  if (!prefix) return;
  if (!sessionId) return;
  if (isNotificationSent) return;

  let body = JSON.stringify({
    api_key: SECRET_KEY,
    session_id: sessionId,
    payload: data,
  });

  var urlPost = "https://" + prefix + "-chat.alma-app.co/app/set_notification";

  fetch(urlPost, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body,
  })
    .then((response) => {
      if (response && response.ok) {
        return response.text();
      } else {
        throw "publishNotification FAILED " + JSON.stringify(response);
      }
    })
    .then((text) => {
      if (text && text.indexOf("failed") == -1) {
        isNotificationSent = true;
      }
    })
    .catch((error) => {

    });
};

subscriptionTimer = null;
purchaseTimer = null;

const clearSubscriptionTimer = () => {
  subscriptionTimer && clearInterval(subscriptionTimer);
  subscriptionTimer = null;
};

export const publishSubscription = (data, prefix, sessionId, force = false) => {
  clearSubscriptionTimer();

  if (force) {
    isSubscriptionSent = false;
  }

  if (!data) return;
  if (!prefix) return;
  if (!sessionId) return;
  if (isSubscriptionSent) return;

  let body = JSON.stringify({
    key: SECRET_KEY,
    session_id: sessionId,
    subscription_info: data,
  });

  var urlPost = "https://" + prefix + "-chat.alma-app.co/app/set_subscription";

  fetch(urlPost, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body,
  })
    .then((response) => {
      if (response && response.ok) {
        return response.text();
      } else {
        throw "publishSubscription FAILED " + JSON.stringify(response);
      }
    })
    .then((text) => {
      if (text && text.indexOf("failed") == -1) {
        isSubscriptionSent = true;
      } else {
        subscriptionTimer = setTimeout(() => {
          publishSubscription(data, prefix, sessionId, force);
        }, 5000);
      }
    })
    .catch((error) => {
      subscriptionTimer = setTimeout(() => {
        publishSubscription(data, prefix, sessionId, force);
      }, 5000);
    });
};

const clearPurchaseTimer = () => {
  purchaseTimer && clearInterval(purchaseTimer);
  purchaseTimer = null;
};

export const publishPurchase = (data, prefix, sessionId, force = false) => {
  clearPurchaseTimer();

  if (force) {
    isPurchaseSent = false;
  }

  let body = JSON.stringify({
    key: SECRET_KEY,
    session_id: sessionId,
    purchase_info: data,
  });

  var urlPost = "https://" + prefix + "-chat.alma-app.co/app/set_purchase";

  fetch(urlPost, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body,
  })
    .then((response) => {
      if (response && response.ok) {
        return response.text();
      } else {
        throw "publishPurchase FAILED " + JSON.stringify(response);
      }
    })
    .then((text) => {
      if (text && text.indexOf("failed") == -1) {
        isPurchaseSent = true;
      } else {
        purchaseTimer = setTimeout(() => {
          publishPurchase(data, prefix, sessionId, force);
        }, 5000);
      }
    })
    .catch((error) => {
      purchaseTimer = setTimeout(() => {
        publishPurchase(data, prefix, sessionId, force);
      }, 5000);
    });
};

export const resetPublishApi = () => {
  isLocationSent = false;
  isPayloadSent = false;
  isNotificationSent = false;
  isSubscriptionSent = false;
  isPurchaseSent = false;
};
