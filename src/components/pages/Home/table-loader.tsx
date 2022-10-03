import { FC, Fragment } from "react";
import styles from "@styles/pages/tableLoader.module.scss";
import Loader from "@components/common/Loader";

interface TableLoaderProps {
  row?: number;
}

const TableLoader: FC<TableLoaderProps> = ({ row = 10 }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}></div>
      {[...new Array(row)].map((_, idx) => (
        <Fragment key={idx}>
          {idx % 2 === 0 ? (
            <Loader className={styles.row} />
          ) : (
            <div className={styles.row}></div>
          )}
        </Fragment>
      ))}
    </div>
  );
};

export default TableLoader;
