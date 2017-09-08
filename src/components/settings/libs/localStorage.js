const indexName = "messageBoxChips";

export const loadMessage = () => {
  return JSON.parse(localStorage.getItem(indexName)) || [];
};

export const saveMessage = message => {
  let savedMessage = loadMessage();
  let i = savedMessage.indexOf(message);
  if (i === -1) {
    localStorage.setItem(
      indexName,
      JSON.stringify(savedMessage.concat([message]))
    );
  }
};

export const deleteMessage = message => {
  let savedMessage = loadMessage();
  let i = savedMessage.indexOf(message);
  if (i !== -1) {
    savedMessage.splice(i, 1);
  }
  localStorage.setItem(indexName, JSON.stringify(savedMessage));
};
