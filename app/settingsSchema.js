const schema = {
  type: "object",
  properties: {
    generatorSlotValidatorAllow: {
      type: "boolean"
    },
    color: {
      type: "string",
      enum: ["Notice", "Warning", "Success"]
    },
    endTime: {
      type: "string"
    },
    message: {
      type: "string"
    }
  },
  required: ["generatorSlotValidatorAllow", "color", "endTime", "message"]
};

export default schema;
