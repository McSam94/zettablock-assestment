import { IData } from "@typing/data";
import { FC } from "react";
import styles from "@styles/pages/home.module.scss";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { getData } from "@stores/actions/data";

interface ExpandableRowProps {
  data: IData;
}

const ExpandableRow: FC<ExpandableRowProps> = ({ data }) => {
  const dispatch = useAppDispatch();

  const { dataDetail } = useAppSelector((state) => ({
    dataDetail: state.data.dataDetail,
  }));

  useEffect(() => {
    dispatch(getData(data.id));
  }, [dispatch, data.id]);

  return (
    <div className={styles.expandable}>
      <div className={styles.textBox}>
        <div className={styles.textBoxLabel}>Operation Name</div>
        <div className={styles.textBoxValue}>
          {dataDetail?.operationName ?? "-"}
        </div>
      </div>
      <div className={styles.textBox}>
        <div className={styles.textBoxLabel}>Variables</div>
        <div className={styles.textBoxValue}>
          {dataDetail?.operationName ?? "-"}
        </div>
      </div>
      <div className={styles.textBox}>
        <div className={styles.textBoxLabel}>Query</div>
        <div className={styles.textBoxValue}>{dataDetail?.query ?? "-"}</div>
      </div>
    </div>
  );
};

export default ExpandableRow;
