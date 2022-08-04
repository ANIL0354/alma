import Contacts from "react-native-contacts";
import { SECRET_KEY, getData, storeData } from "./utils";
import { PermissionsAndroid, Platform } from "react-native";
import { print } from "./Logger";

const getFullName = (contact) => {
  if (!contact) return "";
  let result = contact.givenName;

  if (contact.middleName && contact.middleName.length > 0)
    result += ` ${contact.middleName}`;

  if (contact.familyName && contact.familyName.length > 0)
    result += ` ${contact.familyName}`;

  return result;
};

const getPhoneNumbers = (contact) => {
  if (!contact || !contact.phoneNumbers) return [];
  return contact.phoneNumbers.map((phoneNumber) => phoneNumber.number);
};

const CONTACTS_STATUS = "CONTACTS_STATUS";
const STATUS_WAIT = "wait";
const STATUS_YES = "yes";
const STATUS_NO = "no";

let status = STATUS_WAIT;
let onStatusUpdate = null;

export const initContactsStatus = (func) => {
  onStatusUpdate = func;
  getData(CONTACTS_STATUS).then((value) => {
    status = value || STATUS_WAIT;
    onStatusUpdate && onStatusUpdate(status);
  });
};

const setStatus = (value) => {
  storeData(CONTACTS_STATUS, value);
  status = value;
  onStatusUpdate && onStatusUpdate(status);
};

export const uploadContacts = (prefix, sessionId) => {
  if (!prefix) return;
  if (!sessionId) return;

  if (Platform.OS === "android") {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
      title: "Contacts",
      message:
        "Alma needs to access to your contacts so you could anonymously send them messages.",
      buttonPositive: "Agree",
    })
      .then((status) => {
        if (status === "denied" || status === "never_ask_again") {
          uploadContactsDenied(prefix, sessionId);
        } else {
          Contacts.getAll()
            .then((data) => {
              setStatus(STATUS_YES);

              let contacts = data
                .map((contact) => ({
                  fullname: getFullName(contact),
                  phoneNumbers: getPhoneNumbers(contact),
                }))
                .sort((c1, c2) => {
                  let a = c1.fullname;
                  let b = c2.fullname;

                  if (a > b) {
                    return 1;
                  }
                  if (b > a) {
                    return -1;
                  }
                  return 0;
                });

              let body = JSON.stringify({
                key: SECRET_KEY,
                contacts_list: contacts,
                session_id: sessionId,
              });

              var urlPost =
                "https://" + prefix + "-chat.alma-app.co/app/contacts";

              fetch(urlPost, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: body,
              })
                .then((response) => response.text())
                .then((text) => {
                  print("uploadContacts RESPONSE =>", text);
                })
                .catch((error) => {
                  print("uploadContacts ERROR", error);
                });
            })
            .catch((error) => {
              print("Contacts.getAll ERROR =>", error);
            });
        }
      })
      .catch((error) => {
        print("Contacts.getAll ERROR", error);
        uploadContactsDenied(prefix, sessionId);
      });
  } else {
    Contacts.getAll()
      .then((data) => {
        setStatus(STATUS_YES);

        let contacts = data
          .map((contact) => ({
            fullname: getFullName(contact),
            phoneNumbers: getPhoneNumbers(contact),
          }))
          .sort((c1, c2) => c1.fullname > c2.fullname);

        let body = JSON.stringify({
          key: SECRET_KEY,
          contacts_list: contacts,
          session_id: sessionId,
        });

        var urlPost = "https://" + prefix + "-chat.alma-app.co/app/contacts";
        print("Contacts URL", urlPost);

        fetch(urlPost, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: body,
        })
          .then((response) => response.text())
          .then((text) => {
            print("uploadContacts RESPONSE =>", text);
          })
          .catch((error) => {
            print("uploadContacts ERROR", error);
          });
      })
      .catch((error) => {
        print("Contacts.getAll ERROR", error);
        uploadContactsDenied(prefix, sessionId);
      });
  }
};

const uploadContactsDenied = (prefix, sessionId) => {
  setStatus(STATUS_NO);
  var urlPost = "https://" + prefix + "-chat.alma-app.co/app/contacts";

  let body = JSON.stringify({
    key: SECRET_KEY,
    contacts_list: false,
    session_id: sessionId,
  });

  fetch(urlPost, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body,
  })
    .then((response) => response.text())
    .then((text) => {
      print("uploadContactsDenied RESPONSE =>", text);
    })
    .catch((error) => {
      print("uploadContactsDenied ERROR", error);
    });
};
