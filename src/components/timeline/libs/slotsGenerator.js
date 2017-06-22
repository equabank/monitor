import moment from "moment-timezone";
const tz = process.env.TZ || "Europe/Prague";
moment.tz.setDefault(tz);
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
    endTime: {}
  };

  // generate unique time range
  let endTime = moment().add(timeSlotsPayload.duration, "seconds");
  let lastEndTimeOfTimeSlot = moment();

  // time slots iteration
  return new Promise((resolve, reject) => {
    while (generateNextTimeSlot) {
      timeSlotsPayload.timeSlots.forEach(timeSlot => {
        let _timeSlot = clone(timeSlot);

        // if is apply delay
        if (_timeSlot.delay !== undefined) {
          lastEndTimeOfTimeSlot = lastEndTimeOfTimeSlot.add(
            _timeSlot.delay,
            "seconds"
          );
        }
        _timeSlot["from"] = lastEndTimeOfTimeSlot.format("HH:mm:ss");

        _timeSlot["to"] = lastEndTimeOfTimeSlot.add(
          _timeSlot.duration,
          "seconds"
        );

        // when end time is exceeded, is generating new time slots interrupted
        if (endTime.diff(_timeSlot.to, "seconds") < 0) {
          generateNextTimeSlot = false;
          generatorResponse.endTime = endTime.format("HH:mm:ss");
        }

        lastEndTimeOfTimeSlot = _timeSlot.to;
        _timeSlot.to = _timeSlot.to.format("HH:mm:ss");

        // save to result array
        if (generateNextTimeSlot) {
          generatorResponse.timeSlots.push(_timeSlot);
        }
      });
    }

    resolve(generatorResponse);
  });
};
