import moment from "moment";

const LOG_ENABLED = false;

timeStamp = moment().valueOf();

export const print = (message, data) => {
  if (LOG_ENABLED) {
    let newTimeStamp = moment().valueOf();
    let delay = newTimeStamp - timeStamp;
    let str = `${newTimeStamp}:${delay} ${message}`;
    if (data) {
      console.log(str, data);
    } else {
      console.log(str);
    }
    timeStamp = moment().valueOf();
  }
};
