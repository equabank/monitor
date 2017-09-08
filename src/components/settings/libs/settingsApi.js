import Moment from "moment";
const endpoint = "/api/settings";

export const save = payload => {
  payload.endTime = Moment(payload.endTime).format("YYYY-MM-DDTHH:mm:ss");
  return fetch(endpoint, {
    headers: new Headers({
      "Content-Type": "application/json"
    }),
    method: "PUT",
    body: JSON.stringify(payload)
  }).then(response => response.json());
};

export const load = () => {
  return fetch(endpoint, {
    headers: new Headers({
      "Content-Type": "application/json"
    })
  }).then(response => response.json());
};
