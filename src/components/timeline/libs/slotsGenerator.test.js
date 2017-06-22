import { slotsGenerator } from "./slotsGenerator";
import moment from "moment";

let generatorPayload = {
  duration: 100,
  timeSlots: [
    {
      duration: 10,
      title: "Application A",
      uri: "http://"
    },
    {
      delay: 60,
      duration: 10,
      title: "Application B",
      uri: "http://"
    }
  ]
};

describe("SlotsGenerator", () => {
  it(`If total duration is 100s and each time slot has duration 10s,
      will be generated 10 time slots`, () => {
    return slotsGenerator(generatorPayload).then(result => {
      expect(result.timeSlots.length).toBe(3);
    });
  });

  it(`Each generated time slot has labels duration, title, uri, from and to`, () => {
    return slotsGenerator(generatorPayload).then(result => {
      expect(result.timeSlots[0]).toMatchObject({
        duration: 10,
        title: "Application A",
        uri: "http://",
        from: moment().format("HH:mm:ss"),
        to: moment().add(10, "seconds").format("HH:mm:ss")
      });
    });
  });

  it(`At the end of the field, it starts again`, () => {
    return slotsGenerator(generatorPayload).then(result => {
      expect(result.timeSlots[2].title).toBe("Application A");
    });
  });

  it(`Every next time slot has a start equal to the previous end one`, () => {
    return slotsGenerator(generatorPayload).then(result => {
      expect(result.timeSlots[1].to).toBe(result.timeSlots[2].from);
    });
  });
});
