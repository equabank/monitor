const schema = {
  "type": "object",
  "properties": {
    "from": {
      "type": "string"
    },
    "to": {
      "type": "string"
    },
    "color": {
      "type": "string"
    },
    "title": {
      "type": "string"
    },
    "uri": {
      "type": "string"
    },
    "duration": {
      "type": "integer"
    },
    "pause": {
      "type": "boolean"
    }
  },
  required: ["from", "to", "color", "title", "uri", "duration", "pause"]
};


export default schema;