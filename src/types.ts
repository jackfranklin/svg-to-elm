export interface ExposeAll {
  kind: 'ALL';
}

export interface ExposeNone {
  kind: 'NONE';
}

export interface ExposeSome<T> {
  kind: 'SOME';
  entries: T[];
}

export type ElmModuleExpose = ExposeAll | ExposeNone | ExposeSome<string>;

export interface ElmImport {
  module: string;
  exposing: ElmModuleExpose;
}

export interface ElmModule {
  moduleName: string;
  moduleExposing: ElmModuleExpose;
  viewBody: string;
  imports: ElmImport[];
  success: boolean;
}
