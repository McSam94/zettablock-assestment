import type { NextPage } from "next";
import { useEffect } from "react";
import { getDataList } from "@stores/actions/data";

import styles from "../../styles/Home.module.css";
import { useDispatch } from "react-redux";

const Home: NextPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDataList());
  }, [dispatch]);

  return <div className={styles.container}>Home</div>;
};

export default Home;
