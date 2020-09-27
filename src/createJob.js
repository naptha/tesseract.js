const getId = require('./utils/getId');

let jobCounter = 0;

module.exports = ({
  id: _id,
  action,
  payload = {},
}) => {
  let id = id;
  if (typeof id === 'undefined') {
    id = getId('Job', jobCounter);
    jobCounter += 1;
  }

  return {
    id,
    action,
    payload,
  };
};
