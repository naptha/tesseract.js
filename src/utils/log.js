module.exports = (typeof process.env !== 'undefined' && process.env.NODE_ENV === 'development')
  ? console.log : () => {};
