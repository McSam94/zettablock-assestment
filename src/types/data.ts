export type SORT_TYPE = "asc" | "desc";

export interface IQuery {
  search?: string;
  sort?: SORT_TYPE;
}

export interface IData {
  createdAt: Date;
  name: string;
  updatedAt: Date;
  description: string;
  type: string;
  id: number;
}

export interface IDatas {
  getDatas: IData[];
}

export type IDataMutation = {
  addData: IData;
};
