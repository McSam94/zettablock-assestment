export type SORT_TYPE = "asc" | "desc";
export interface IQuery {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string | null;
  order?: SORT_TYPE | null;
}

export interface IData {
  createdAt: Date;
  name: string;
  updatedAt: Date;
  description: string;
  type: string;
  id: string;
  operationName?: string;
  variables?: Object;
  query?: string;
}

export type IDatas = IData[];

export type IDataMutation = {
  addData: IData;
};
