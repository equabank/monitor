import Moment from 'moment';
import { extendMoment } from 'moment-range';
import "babel-polyfill";

const moment = extendMoment(Moment);

export let timeRangeSlotValidate = (slots=[], slotFrom=null, slotTo=null) => {

  let minTime = moment();
  let maxTime = moment();
  let result = {
    freeSlotAvailable: false,
    message: null
  }

  if ( slots.length > 0 && slotFrom !== null && slotTo !== null ) {
    result.freeSlotAvailable = true;

    let _slotFrom = slotFrom.split(":");
    let _slotTo = slotTo.split(":");
    let __slotFrom = moment().hours(_slotFrom[0]).minutes(_slotFrom[1]).seconds(_slotFrom[2]).add(1, 's');
    let __slotTo = moment().hours(_slotTo[0]).minutes(_slotTo[1]).seconds(_slotTo[2]).add(-1, 's');
    let rangeSlot = moment.range(__slotFrom,  __slotTo);

    for (var slot of slots) {
      if ( slot._source !== undefined ) {
        let from = slot._source.from.split(":");
        let to = slot._source.to.split(":");
        let _from = moment().hours(from[0]).minutes(from[1]).seconds(from[2]);
        let _to = moment().hours(to[0]).minutes(to[1]).seconds(to[2]);
        let range = moment.range(_from, _to);

        /*
          If new time slot has range in existing time slots
         */
        if ( __slotFrom.within(range) || __slotTo.within(range) || _from.within(rangeSlot) || _to.within(rangeSlot)) {
          result.freeSlotAvailable = false
          result.message = "TimeRangeSlotValidate: The time range is occupied or its beginning or ending interferes with the existing time slot"
        }

        let _minDiff = _from.diff(minTime, 'seconds');
        if ( (_minDiff === 0) || (_minDiff < 0) ) {
          minTime = _from;
        }

        let _maxDiff = _to.diff(maxTime, 'seconds');
        if ( (_maxDiff === 0) || (_maxDiff > 0) ) {
          maxTime = _to;
        }

      }
    }
  } else {
    result.message = "TimeRangeSlotValidate: Bad input"
  }

  return new Promise((resolve, reject) => {
    if( result.message !== null ) { reject(result); }
    resolve(result);
  })


}