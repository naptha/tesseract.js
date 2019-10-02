let jobCounter = 1;

module.exports = (
  action,
  payload,
) => {
  const id = `Job-${jobCounter}-${Math.random().toString(16).slice(3, 8)}`;
  jobCounter += 1;

  return {
    id,
    action,
    payload,
  };
};
