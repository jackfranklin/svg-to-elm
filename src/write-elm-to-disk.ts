import { ElmModule } from './types';
import * as fs from 'fs';

interface Options {
  elmFormatPath?: string;
  outputPath: string;
}

interface WriteResult {
  success: boolean;
  error?: Error;
}

const writeElmToDisk = (
  module: ElmModule,
  options: Options,
): Promise<WriteResult> => {
  return new Promise((resolve, reject) => {
    const elmModuleAsString = elmModuleToString(module);
  });
};

export default writeElmToDisk;
