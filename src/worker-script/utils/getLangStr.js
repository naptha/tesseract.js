module.exports = langs => (
  typeof langs === 'string'
    ? langs
    : langs.map(lang => (typeof lang === 'string' ? lang : lang.data)).join('+')
);
