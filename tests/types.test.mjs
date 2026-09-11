import { IS_BROWSER } from './constants.mjs';

(IS_BROWSER ? describe.skip : describe)('types', () => {
  it('should type recognize options as including WorkerParams', () => {
    const dts = fs.readFileSync(new URL('../src/index.d.ts', import.meta.url), 'utf8');
    expect(dts).to.contain('interface RecognizeOptions extends WorkerParams');
    expect(dts).to.contain('tessedit_pageseg_mode: PSM | `${PSM}`');
  });
});
