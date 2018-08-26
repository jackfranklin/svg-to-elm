import elmModuleToString from '../src/elm-module-to-string';
import * as path from 'path';
import Parser, { ParserResult } from '../src/parser';
import { ElmModule } from '../src/types';

test('it can generate an elm module', async () => {
  const fixture = path.resolve(__dirname, 'fixtures', 'search.svg');
  const parserResult: ParserResult = await new Parser().parse(fixture, {
    moduleName: 'Search1',
  });

  const output = elmModuleToString(parserResult as ElmModule);
  console.log('output\n', output);

  expect(output).toContain('module Search1 exposing (view)');
  expect(output).toContain('import Svg exposing (..)');
  expect(output).toContain('import Svg.Attributes exposing (..)');
  expect(output).toContain((parserResult as ElmModule).viewBody.trim());
});
