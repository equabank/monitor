import moment from "moment";
import "babel-polyfill";

// clone time slot object
const clone = (obj: Object) => {
  if (null === obj || "object" !== typeof obj) return obj;
  let copy = obj.constructor();
  for (let attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;
};

export let slotsGenerator = (timeSlotsPayload: Object) => {
  let generateNextTimeSlot = true;
  let generatorResponse = {
    timeSlots: [],
    endOfTimeSlots: {}
  };

  // generate unique time range
  let endOfTimeSlots = moment().add(timeSlotsPayload.duration, "seconds");
  let lastEndTimeOfTimeSlot = moment().format("HH:mm:ss");
  let _lastEndTimeOfTimeSlot = lastEndTimeOfTimeSlot.split(":");
  const startOfTimeSlots = moment()
    .hours(_lastEndTimeOfTimeSlot[0])
    .minutes(_lastEndTimeOfTimeSlot[1])
    .seconds(_lastEndTimeOfTimeSlot[2]);

  // time slots iterat
  return new Promise((resolve, reject) => {
    while (generateNextTimeSlot) {
      timeSlotsPayload.timeSlots.forEach(timeSlot => {
        let _timeSlot = clone(timeSlot);
        _timeSlot["from"] = lastEndTimeOfTimeSlot;

        let _lastEndTimeOfTimeSlot = lastEndTimeOfTimeSlot.split(":");
        _timeSlot["to"] = moment()
          .hours(_lastEndTimeOfTimeSlot[0])
          .minutes(_lastEndTimeOfTimeSlot[1])
          .seconds(_lastEndTimeOfTimeSlot[2])
          .add(_timeSlot.duration, "seconds");

        // when end time is exceeded, is generating new time slots interrupted
        if (endOfTimeSlots.diff(_timeSlot.to, "seconds") < 0) {
          generateNextTimeSlot = false;
          generatorResponse.endOfTimeSlots = endOfTimeSlots.format("HH:mm:ss");
        }

        _timeSlot.to = _timeSlot.to.format("HH:mm:ss");
        lastEndTimeOfTimeSlot = _timeSlot.to;

        // save to result array
        if (generateNextTimeSlot) {
          generatorResponse.timeSlots.push(_timeSlot);
        }
      });
    }

    resolve(generatorResponse);
  });
};
