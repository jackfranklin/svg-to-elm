import writeElmToDisk from '../src/write-elm-to-disk';
import * as path from 'path';
import * as fs from 'fs';
import Parser, { ParserResult } from '../src/parser';
import { ElmModule } from '../src/types';

test.skip('it can write an elm module to disk', async () => {
  const TEST_OUTPUT = path.resolve(__dirname, 'test-output', 'Search1.elm');
  const fixture = path.resolve(__dirname, 'fixtures', 'search.svg');
  const parserResult: ParserResult = await new Parser().parse(fixture, {
    moduleName: 'Search1',
  });

  const result = await writeElmToDisk(parserResult as ElmModule, {
    outputPath: TEST_OUTPUT,
  });

  const onDisk = fs.readFileSync(TEST_OUTPUT, { encoding: 'utf8' });
  expect(onDisk).toMatchInlineSnapshot();
});

test('it writes valid Elm that can be compiled', () => {});

test('it can run elm-format', () => {});
