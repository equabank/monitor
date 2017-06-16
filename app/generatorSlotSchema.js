const schema = {
  type: "object",
  properties: {
    duration: {
      type: "number",
      maximum: 15000
    },
    timeSlots: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        properties: {
          duration: {
            type: "number",
            minimum: 30
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
