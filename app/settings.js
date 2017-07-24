let uniqueId = 1;

export const initSettings = (client, settings, cb) => {
  client.create(
    {
      index: "monitor-settings",
      type: "monitor-settings",
      id: new Date().getTime() + ++uniqueId,
      body: Object.assign({ timestamp: new Date().toISOString() }, settings)
    },
    cb
  );
};

export const getSettings = (client, cb) => {
  client.msearch(
    {
      body: [
        { index: "monitor-settings", type: "monitor-settings" },
        {
          from: 0,
          size: 1000,
          query: { match_all: {} }
        }
      ]
    },
    cb
  );
};

export const updateSettings = (client, id, changes, cb) => {
  client.update(
    {
      index: "monitor-settings",
      type: "monitor-settings",
      id: id,
      body: {
        doc: changes
      }
    },
    cb
  );
};
