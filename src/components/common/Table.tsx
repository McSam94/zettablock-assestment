import { FC, Fragment, ReactNode } from "react";
import styles from "@styles/components/table.module.scss";
import { useMemo } from "react";
import { useState } from "react";
import classNames from "classnames";
import { useCallback } from "react";
import { MouseEvent } from "react";

interface TableProps {
  data: Array<Record<string, any>>;
  rowKey: string;
  renderCell: ({
    column,
    data,
  }: {
    column: string;
    data: string;
    rowIndex: number;
    colIndex: number;
  }) => ReactNode;
  renderHeader?: (column: string) => ReactNode;
  renderExpandable?: ({ data }: { data: Record<string, any> }) => ReactNode;
  onRowDelete?: (data: Record<string, any>) => void;
}

const Table: FC<TableProps> = ({
  data,
  rowKey,
  renderCell,
  renderHeader,
  renderExpandable,
  onRowDelete,
}) => {
  const [expandableRow, setExpandableRow] = useState<string>();

  const columns: string[] = useMemo(
    () => [
      ...Object.keys(data[0]).map((key) => key),
      ...(onRowDelete ? ["Action"] : []),
    ],
    [data, onRowDelete]
  );

  const templateColumns = useMemo(
    () => `${new Array(columns.length).fill("1fr").join(" ")}`,
    [columns]
  );

  return (
    <div
      className={styles.container}
      style={{ gridTemplateColumns: templateColumns }}
    >
      {columns.map((column) => (
        <Fragment key={column}>
          {renderHeader?.(column) ?? (
            <div className={styles.header} key={column}>
              {column}
            </div>
          )}
        </Fragment>
      ))}
      {data.map((singleData, rowIndex) => (
        <Fragment key={singleData[rowKey]}>
          <div
            className={styles.row}
            style={{ gridTemplateColumns: templateColumns }}
          >
            {Object.keys(singleData).map((dataKey, colIndex) => (
              <Fragment key={dataKey}>
                {renderCell?.({
                  column: dataKey,
                  data: singleData[dataKey],
                  rowIndex,
                  colIndex,
                }) ?? <div className={styles.cell}>{singleData[dataKey]}</div>}
              </Fragment>
            ))}

            {onRowDelete ? (
              <div className={styles.actions}>
                <span
                  className={classNames(styles.actionsExpand, {
                    [styles.actionsExpandRotated]:
                      expandableRow === singleData[rowKey],
                  })}
                  onClick={() =>
                    setExpandableRow((prevState) =>
                      !prevState ? singleData[rowKey] : ""
                    )
                  }
                >
                  ⏏︎
                </span>
                <span onClick={() => onRowDelete(singleData)}>🚫</span>
              </div>
            ) : null}
          </div>
          {expandableRow === singleData[rowKey] ? (
            <div className={styles.expandableRow}>
              {renderExpandable?.({
                data: singleData,
              }) ?? null}
            </div>
          ) : null}
        </Fragment>
      ))}
    </div>
  );
};

export default Table;
