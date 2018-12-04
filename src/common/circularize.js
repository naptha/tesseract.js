/**
 * The result of dump.js is a big JSON tree
 * which can be easily serialized (for instance
 * to be sent from a webworker to the main app
 * or through Node's IPC), but we want
 * a (circular) DOM-like interface for walking
 * through the data.
 *
 * @fileoverview DOM-like interface for walking through data
 * @author Kevin Kwok <antimatter15@gmail.com>
 * @author Guillermo Webster <gui@mit.edu>
 * @author Jerome Wu <jeromewus@gmail.com>
 */

module.exports = (iPage) => {
  const page = {
    ...iPage,
    paragraphs: [],
    lines: [],
    words: [],
    symbols: [],
  };

  page.blocks.forEach((iBlock) => {
    const block = {
      ...iBlock,
      page,
      lines: [],
      words: [],
      symbols: [],
    };

    block.paragraphs.forEach((iPara) => {
      const para = {
        ...iPara,
        block,
        page,
        words: [],
        symbols: [],
      };

      para.lines.forEach((iLine) => {
        const line = {
          ...iLine,
          paragraph: para,
          block,
          page,
          symbols: [],
        };

        line.words.forEach((iWord) => {
          const word = {
            ...iWord,
            line,
            paragraph: para,
            block,
            page,
          };

          word.symbols.forEach((iSym) => {
            const sym = {
              ...iSym,
              word,
              line,
              paragraph: para,
              block,
              page,
            };

            sym.line.symbols.push(sym);
            sym.paragraph.symbols.push(sym);
            sym.block.symbols.push(sym);
            sym.page.symbols.push(sym);
          });
          word.paragraph.words.push(word);
          word.block.words.push(word);
          word.page.words.push(word);
        });
        line.block.lines.push(line);
        line.page.lines.push(line);
      });
      para.page.paragraphs.push(para);
    });
  });
  return page;
};
