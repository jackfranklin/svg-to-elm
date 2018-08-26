import { codeBlock } from 'common-tags';
import { ElmModule, ElmModuleExpose, ElmImport } from './types';

interface Options {
  banner?: string;
}

const generateExports = (exposing: ElmModuleExpose): string => {
  switch (exposing.kind) {
    case 'ALL':
      return ' exposing (..)';
    case 'NONE':
      return '';
    case 'SOME':
      return ` exposing (${exposing.entries.join(', ')})`;
  }
};

const generateImports = (imports: ElmImport[]): string[] => {
  return imports.map(
    (imp: ElmImport): string => {
      return `import ${imp.module}${generateExports(imp.exposing)}`;
    },
  );
};

const elmModuleToString = (
  elmModule: ElmModule,
  options: Options = {},
): string => {
  return codeBlock`
    module ${elmModule.moduleName}${generateExports(elmModule.moduleExposing)}
    ${generateImports(elmModule.imports)}
    ${options.banner ? `${options.banner}\n` : ''}

    ${elmModule.viewBody}
  `;
};

export default elmModuleToString;
