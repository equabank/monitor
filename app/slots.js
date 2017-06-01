export const addSlot = (client, slot, cb) => {
  client.create(
    {
      index: "monitor-slots",
      type: "monitor-slots",
      id: new Date().getTime(),
      body: Object.assign({ timestamp: new Date().toISOString() }, slot)
    },
    cb
  );
};

export const getSlots = (client, cb) => {
  client.msearch(
    {
      body: [
        { index: "monitor-slots", type: "monitor-slots" },
        { from: 0, size: 1000, query: { match_all: {} } }
      ]
    },
    cb
  );
};

export const getSlot = (client, slotId, cb) => {
  client.get(
    {
      index: "monitor-slots",
      type: "monitor-slots",
      id: slotId
    },
    cb
  );
};

export const deleteSlot = (client, slotId, cb) => {
  client.delete(
    {
      index: "monitor-slots",
      type: "monitor-slots",
      id: slotId
    },
    cb
  );
};

export const deleteAllSlots = (client, cb) => {
  client.indices.delete(
    {
      index: "monitor-slots"
    },
    cb
  );
};

export const deleteOldBackgroundSlots = (client, cb) => {
  client.deleteByQuery(
    {
      index: "monitor-slots",
      body: {
        _source: false,
        query: {
          bool: {
            must: [
              {
                term: {
                  type: "background"
                }
              },
              {
                range: {
                  timestamp: {
                    lte: "now-1h"
                  }
                }
              }
            ]
          }
        }
      }
    },
    cb
  );
};
