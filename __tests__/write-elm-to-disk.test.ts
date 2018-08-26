import writeElmToDisk from '../src/write-elm-to-disk';
import * as path from 'path';
import * as fs from 'fs';
import Parser, { ParserResult } from '../src/parser';
import { ElmModule } from '../src/types';
import { compileToString } from 'node-elm-compiler';

const TEST_OUTPUT = path.resolve(__dirname, 'test-output', 'Search.elm');

afterEach(() => {
  if (fs.existsSync(TEST_OUTPUT)) {
    fs.unlinkSync(TEST_OUTPUT);
  }
});

test('it can write an elm module to disk', async () => {
  const fixture = path.resolve(__dirname, 'fixtures', 'search.svg');
  const parserResult: ParserResult = await new Parser().parse(fixture, {
    moduleName: 'Search',
  });

  const result = await writeElmToDisk(parserResult as ElmModule, {
    outputPath: TEST_OUTPUT,
  });
  expect(result).toEqual({ success: true });

  const onDisk = fs.readFileSync(TEST_OUTPUT, { encoding: 'utf8' });
  expect(onDisk).toMatchInlineSnapshot(`
"module Search exposing (view)
import Svg exposing (..)
import Svg.Attributes exposing (..)


view =
  svg [width \\"24\\", height \\"24\\", viewBox \\"0 0 24 24\\"] [         Svg.path [d \\"M19.85352,19.14648l-4.42285-4.42285C16.40637,13.58636,17,12.11237,17,10.5C17,6.91602,14.08398,4,10.5,4 S4,6.91602,4,10.5S6.91602,17,10.5,17c1.61237,0,3.08636-0.59363,4.22363-1.56934l4.42285,4.42285 C19.24414,19.95117,19.37207,20,19.5,20s0.25586-0.04883,0.35352-0.14648C20.04883,19.6582,20.04883,19.3418,19.85352,19.14648z M5,10.5C5,7.46729,7.46729,5,10.5,5S16,7.46729,16,10.5S13.53271,16,10.5,16S5,13.53271,5,10.5z\\"] []         ]"
`);
});

test('it writes valid Elm that can be compiled', async () => {
  const fixture = path.resolve(__dirname, 'fixtures', 'search.svg');
  const parserResult: ParserResult = await new Parser().parse(fixture, {
    moduleName: 'Search',
  });

  await writeElmToDisk(parserResult as ElmModule, {
    outputPath: TEST_OUTPUT,
  });

  await compileToString([TEST_OUTPUT], {
    yes: true,
    cwd: path.join(__dirname, 'test-output'),
  }).catch(fail);
});

test('it can run elm-format', () => {});
