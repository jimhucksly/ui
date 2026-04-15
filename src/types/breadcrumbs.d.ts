export interface IDictionary<TValue> {
  [index: string]: TValue;
}

export interface IRoute {
  path?: string;
  name?: string;
  hash?: string;
  query?: IDictionary<string | Array<string>>;
  params?: RouteParams;
  fullPath?: string;
  redirectedFrom?: string;
  meta?: { transition?: symbol; state?: symbol };
}

export interface IBreadcrumbsItem {
  uid?: number;
  text?: string;
  remark?: string;
  route: IRoute;
  disabled?: boolean;
  hidden?: boolean;
  data?: unknown;
}
