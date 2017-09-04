import Moment from "moment";

export const save = payload => {
  payload.endTime = Moment(payload.endTime).format("HH:mm:ss");
  return fetch("/api/settings", {
    headers: new Headers({
      "Content-Type": "application/json"
    }),
    method: "PUT",
    body: JSON.stringify(payload)
  }).then(response => response.json());
};
