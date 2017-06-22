import { timeRangeSlotValidate } from "./inputValidator";

// not completed output from elastic
let slots = [
  {
    _id: "1",
    _source: {
      from: "01:01:00",
      to: "01:02:00",
      type: "range"
    }
  },
  {
    _id: "2",
    _source: {
      from: "01:02:00",
      to: "01:03:00",
      type: "range"
    }
  },
  {
    _id: "3",
    _source: {
      from: "01:03:00",
      to: "01:04:00",
      type: "range"
    }
  }
];

let slotFrom = "01:00:00";
let slotTo = "01:01:00";
let slotTypeRange = "range";

describe("InputValidator", () => {
  it("Successful validation - create new time slot outside existing time-range", () => {
    return timeRangeSlotValidate(
      slots,
      slotFrom,
      slotTo,
      slotTypeRange
    ).then(result => {
      expect(result.freeSlotAvailable).toBeTruthy();
      expect(result.message).toBe("");
    });
  });

  it("Failed validation - create new time slot, slotFrom in existing end time-range", () => {
    slotFrom = "01:00:00";
    slotTo = "01:03:00";
    return timeRangeSlotValidate(
      slots,
      slotFrom,
      slotTo,
      slotTypeRange
    ).catch(err => {
      expect(err.freeSlotAvailable).toBeFalsy();
      expect(err.message).toBe(
        "TimeRangeSlotValidate: The time range is occupied or its beginning or ending interferes with the existing time slot"
      );
    });
  });

  it("Failed validation - create new time slot, slotFrom in existing start time-range", () => {
    slotFrom = "01:03:00";
    slotTo = "01:05:00";
    return timeRangeSlotValidate(
      slots,
      slotFrom,
      slotTo,
      slotTypeRange
    ).catch(err => {
      expect(err.freeSlotAvailable).toBeFalsy();
      expect(err.message).toBe(
        "TimeRangeSlotValidate: The time range is occupied or its beginning or ending interferes with the existing time slot"
      );
    });
  });
});
