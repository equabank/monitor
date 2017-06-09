const schema = {
  type: "object",
  properties: {
    from: {
      type: "string"
    },
    to: {
      type: "string"
    },
    color: {
      type: "string"
    },
    title: {
      type: "string"
    },
    uri: {
      type: "string"
    }
  },
  required: ["from", "to", "color", "title", "uri"]
};

export default schema;
