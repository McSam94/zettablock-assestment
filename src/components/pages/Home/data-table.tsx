import { useMemo, FC, useEffect, useCallback, useState } from "react";
import classNames from "classnames";
import Table from "@components/common/Table";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import {
  deleteData,
  getDataList,
  resetDeleteData,
  resetUpdateData,
  updateData,
  updateQuery,
} from "@stores/actions/data";
import { IData, IDatas, IQuery } from "@typing/data";
import styles from "@styles/pages/home.module.scss";
import Button from "@components/common/Button";
import ExpandableRow from "./expandable-row";
import TableLoader from "./table-loader";
import Input from "@components/common/Input";
import Dialog from "@components/common/Dialog";
import { useRef } from "react";

interface TableCellProps {
  column: string;
  data: string;
  tableData: IDatas;
  rowIndex: number;
}

const TableCell: FC<TableCellProps> = ({
  column,
  data,
  rowIndex,
  tableData,
}) => {
  const dispatch = useAppDispatch();
  const [allowEdit, setAllowEdit] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");

  const { hasUpdatedData, isUpdatingData, hasDeletedData, query } =
    useAppSelector((state) => ({
      hasUpdatedData: state.data.hasUpdatedData,
      isUpdatingData: state.data.isUpdatingData,
      hasDeletedData: state.data.hasDeletedData,
      query: state.data.tabsQuery[state.data.activeTab],
    }));

  const setupEdit = useCallback(() => {
    setAllowEdit(true);
    setInputValue(data);
  }, [data]);

  const updateDescription = useCallback(
    (rowIndex: number) => {
      const selectedItem = tableData?.[rowIndex];
      const dataId = selectedItem.id;

      dispatch(
        updateData(dataId, {
          ...selectedItem,
          description: inputValue,
        })
      );
    },
    [dispatch, tableData, inputValue]
  );

  useEffect(() => {
    if (hasUpdatedData) {
      dispatch(resetUpdateData());
      setAllowEdit(false);
    }
  }, [hasUpdatedData, dispatch]);

  useEffect(() => {
    if (hasDeletedData) {
      dispatch(resetDeleteData());
      dispatch(getDataList(query));
    }
  }, [hasDeletedData, dispatch, query]);

  return (
    <>
      {column === "createdAt" || column === "updatedAt" ? (
        <div className={styles.cell}>{new Date(data).toLocaleString()}</div>
      ) : null}
      {column === "name" || column === "type" || column === "id" ? (
        <div className={styles.cell}>{data}</div>
      ) : null}
      {column === "description" ? (
        <div
          className={classNames(styles.cell, {
            [styles["cell--edit"]]: allowEdit,
          })}
        >
          {!allowEdit ? (
            <span
              onClick={() => setupEdit()}
              className={classNames(
                styles["cell-icon"],
                styles["cell-icon--edit"]
              )}
            >
              {"✏️"}
            </span>
          ) : null}
          {allowEdit ? (
            <input
              type="text"
              onChange={(evt) => setInputValue(evt.target.value)}
              value={inputValue}
            />
          ) : (
            <span>{data}</span>
          )}
          {allowEdit ? (
            <span
              className={styles["cell-icon"]}
              onClick={() => updateDescription(rowIndex)}
            >
              {isUpdatingData ? "⌛️" : "✔️"}
            </span>
          ) : null}
        </div>
      ) : null}
    </>
  );
};

interface DataTableProps {
  query: IQuery;
}

const DataTable: FC<DataTableProps> = ({ query }) => {
  const dispatch = useAppDispatch();
  const { dataList, hasDeletedData, isDeletingData } = useAppSelector(
    (state) => ({
      dataList: state.data.data,
      hasDeletedData: state.data.hasDeletedData,
      isDeletingData: state.data.isDeletingData,
    })
  );

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  const idToDelete = useRef<string>();

  const data = useMemo(
    () =>
      dataList?.[query.page]?.map(
        ({ id, name, description, type, createdAt, updatedAt }) => ({
          id,
          name,
          description,
          type,
          createdAt,
          updatedAt,
        })
      ),
    [dataList, query.page]
  );

  const hasNext = useMemo(
    () =>
      (dataList?.[query.page] ?? []).length + (query.page - 1) * query.limit >=
      query.page * query.limit,
    [dataList, query.page, query.limit]
  );

  const hasPrevious = useMemo(() => query.page !== 1, [query.page]);

  const confirmDelete = useCallback((id: string) => {
    idToDelete.current = id;
    setIsDialogOpen(true);
  }, []);

  const deleteRow = useCallback(() => {
    if (!idToDelete.current) return;

    dispatch(deleteData(idToDelete.current));
  }, [dispatch]);

  const onSort = useCallback(
    (column: string) => {
      dispatch(
        updateQuery({
          ...query,
          page: 1,
          sortBy: column,
          order:
            query.sortBy === column
              ? query.order === "asc"
                ? "desc"
                : "asc"
              : "asc",
        })
      );
    },
    [query, dispatch]
  );

  const onNextPage = useCallback(() => {
    dispatch(
      updateQuery({
        ...query,
        page: query.page + 1,
      })
    );
  }, [query, dispatch]);

  const onPreviousPage = useCallback(() => {
    dispatch(
      updateQuery({
        ...query,
        page: query.page - 1,
      })
    );
  }, [query, dispatch]);

  useEffect(() => {
    dispatch(getDataList(query));
  }, [query, dispatch]);

  useEffect(() => {
    if (hasDeletedData) {
      setIsDialogOpen(false);
      dispatch(resetDeleteData());
    }
  }, [hasDeletedData, dispatch]);

  return (
    <>
      <div className={styles.dataTable}>
        {data ? (
          <Table
            data={data}
            rowKey="id"
            renderHeader={(column) => (
              <>
                {column === "name" ? (
                  <div
                    className={classNames(
                      styles.dataTableHeader,
                      styles.sortingHeader
                    )}
                    onClick={() => onSort(column)}
                  >
                    <span>{column}</span>
                    <span className={styles.sortIcon}>
                      {query.order === "asc"
                        ? "⬆️"
                        : query.order === "desc"
                        ? "⬇️"
                        : "↕️"}
                    </span>
                  </div>
                ) : (
                  <div className={styles.dataTableHeader}>{column}</div>
                )}
              </>
            )}
            renderCell={(props) => <TableCell {...props} tableData={data} />}
            renderExpandable={({ data }) => (
              <ExpandableRow data={data as IData} />
            )}
            onRowDelete={(data) => confirmDelete(data.id)}
          />
        ) : (
          <TableLoader />
        )}
        <div
          className={classNames(styles.footer, {
            [styles.footerWithNext]: hasNext && !hasPrevious,
          })}
        >
          {hasPrevious ? (
            <Button className={styles.footerNext} onClick={onPreviousPage}>
              Previous Page
            </Button>
          ) : null}
          {hasNext ? <Button onClick={onNextPage}>Next Page</Button> : null}
        </div>
      </div>
      <Dialog
        isOpen={isDialogOpen}
        title="Are you sure?"
        confirmLabel={isDeletingData ? "Deleting..." : "Confirm"}
        onConfirm={deleteRow}
        onCancel={() => setIsDialogOpen(false)}
      />
    </>
  );
};

export default DataTable;
