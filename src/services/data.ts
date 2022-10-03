import { IData, IDatas, IQuery } from "@typing/data";
import apiClient from ".";

const DataService = {
  GetDataList: (query: IQuery) =>
    apiClient.get<IDatas>("/apis", { params: query }),
  GetData: (id: string) => apiClient.get<IData>(`/apis/${id}`),
  createData: (data: IData) => apiClient.post<IData>("/apis", data),
  UpdateData: (id: string, data: IData) =>
    apiClient.put<IData>(`/apis/${id}`, data),
  DeleteData: (id: string) => apiClient.delete(`/apis/${id}`),
};

export default DataService;
