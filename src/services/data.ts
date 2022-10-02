import { IDatas } from "@typing/data";
import apiClient from ".";

const DataService = {
  GetDataList: () => apiClient.get<IDatas>("/apis"),
};

export default DataService;
