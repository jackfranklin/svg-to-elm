import { codeBlock } from 'common-tags';
import { ElmModule, ExposeAll, ExposeSome, ExposeNone } from './types';

export type Attribute = {
  name: string;
  value: string;
};

export type Child = {
  element: string;
  attributes: Attribute[];
  children: Child[];
};

class Svg {
  attributes: Attribute[];
  children: Child[];

  constructor(attributes: Attribute[], children: Child[]) {
    this.attributes = attributes;
    this.children = children;
  }

  toElm(moduleName: string): ElmModule {
    const moduleExposing: ExposeSome<string> = {
      kind: 'SOME',
      entries: ['view', 'viewWithAttributes'],
    };
    const exposeAll: ExposeAll = { kind: 'ALL' };
    const exposeHtml: ExposeSome<string> = {
      kind: 'SOME',
      entries: ['Html'],
    };

    const imports = [
      { module: 'Svg', exposing: exposeAll },
      { module: 'Svg.Attributes', exposing: exposeAll },
      { module: 'Html', exposing: exposeHtml },
    ];
    const success = true;

    const module: ElmModule = {
      moduleName,
      moduleExposing,
      imports,
      success,
      viewBody: this.renderViewBody(),
    };

    return module;
  }

  private renderViewBody(): string {
    const svgAttributesToElm = (attributes: Attribute[]): string =>
      attributes.map(attr => `${attr.name} "${attr.value}"`).join(', ');

    const svgChildrenToElm = (children: Child[]): string => {
      return children
        .map(child => {
          return `
        Svg.${child.element} [${svgAttributesToElm(
            child.attributes,
          )}] [${svgChildrenToElm(child.children)}]
        `;
        })
        .join(', ');
    };

    return codeBlock`
    view: Html msg
    view =
      svg [${svgAttributesToElm(this.attributes)}] [${svgChildrenToElm(
      this.children,
    )}]

    viewWithAttributes: List (Html.Attribute msg) -> Html msg
    viewWithAttributes attributes =
      svg ([${svgAttributesToElm(
        this.attributes,
      )}] ++ attributes) [${svgChildrenToElm(this.children)}]
    `;
  }
}

export default Svg;

/* an Elm module

module SearchIcon exposing (view)

import Svg exposing (..)
import Svg.Attributes exposing (..)

view =
  svg [] [path [] []]
*/
