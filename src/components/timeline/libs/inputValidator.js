import Moment from 'moment';
import { extendMoment } from 'moment-range';
import "babel-polyfill";

const moment = extendMoment(Moment);

export let timeRangeSlotValidate = (slots=[], slotFrom=null, slotTo=null, slotType=null) => {

  let result = {
    freeSlotAvailable: false,
    message: null
  }

  return new Promise((resolve, reject) => {

    if( slots.length === 0 ){
      result.freeSlotAvailable = true;
      resolve(result);
    }
    
    if ( slotFrom !== null && slotTo !== null && slotType !== null) {
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
            Return false, If new time slot has range in existing time slots
           */
          if ( slotType === slot._source.type && ( __slotFrom.within(range) || __slotTo.within(range) || _from.within(rangeSlot) || _to.within(rangeSlot) )) {
            result.freeSlotAvailable = false
            result.message = "TimeRangeSlotValidate: The time range is occupied or its beginning or ending interferes with the existing time slot"
            reject(result);
          }
        }
      }

      resolve(result);
    } else {
      result.message = "TimeRangeSlotValidate: Bad input";
      reject(result);
    }
  })
}