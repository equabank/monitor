const schema = {
  type: "object",
  properties: {
    duration: {
      type: "number"
    },
    timeSlots: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        properties: {
          duration: {
            type: "number"
          },
          title: {
            type: "string"
          },
          uri: {
            type: "string"
          }
        },
        required: ["duration", "title", "uri"]
      }
    }
  },
  required: ["duration", "timeSlots"]
};

export default schema;
