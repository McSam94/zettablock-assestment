import type { NextPage } from "next";
import { useCallback, useEffect, useMemo } from "react";
import {
  createNewTab,
  deleteTab,
  getDataList,
  redo,
  resetRedo,
  resetUndo,
  undo,
  updateActiveTab,
  updateQuery,
} from "@stores/actions/data";
import Tab from "@components/common/Tab";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import DataTable from "@components/pages/Home/data-table";
import Loader from "@components/common/Loader";

import styles from "@styles/pages/home.module.scss";
import Input from "@components/common/Input";
import classNames from "classnames";

const Home: NextPage = () => {
  const dispatch = useAppDispatch();

  const {
    listOfQuery,
    activeTab,
    tabsQuery,
    isUndoing,
    undoAction,
    undoData,
    hasSuccessUndo,
    isRedoing,
    redoAction,
    redoData,
    hasSuccessRedo,
  } = useAppSelector((state) => ({
    listOfQuery: state.data.tabsQuery,
    activeTab: state.data.activeTab,
    tabsQuery: state.data.tabsQuery,
    isUndoing: state.data.isUndoing,
    undoAction: state.data.undoAction,
    undoData: state.data.undoData,
    hasSuccessUndo: state.data.hasSuccessUndo,
    isRedoing: state.data.isRedoing,
    redoAction: state.data.redoAction,
    redoData: state.data.redoData,
    hasSuccessRedo: state.data.hasSuccessRedo,
  }));

  const currentTabQuery = useMemo(
    () => tabsQuery[activeTab],
    [tabsQuery, activeTab]
  );

  const tabItems = useMemo(
    () =>
      listOfQuery.map((_, idx) => ({
        label: `Tab ${idx}`,
        value: idx,
      })),
    [listOfQuery]
  );

  const onUndo = useCallback(() => {
    if (!undoData || !undoAction) return;

    dispatch(undo(undoData, undoAction));
  }, [dispatch, undoAction, undoData]);

  const onRedo = useCallback(() => {
    if (!redoData || !redoAction) return;

    dispatch(redo(redoData, redoAction));
  }, [dispatch, redoData, redoAction]);

  const getInitialData = useCallback(
    () => dispatch(getDataList(currentTabQuery)),
    [dispatch, currentTabQuery]
  );

  useEffect(() => {
    getInitialData();
  }, [getInitialData]);

  useEffect(() => {
    if (hasSuccessUndo) {
      getInitialData();
      dispatch(resetUndo());
    }
  }, [hasSuccessUndo, getInitialData, dispatch]);

  useEffect(() => {
    if (hasSuccessRedo) {
      getInitialData();
      dispatch(resetRedo());
    }
  }, [hasSuccessRedo, getInitialData, dispatch]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>📝 Data</div>
        <div className={styles.toolbox}>
          <span
            className={classNames(styles.toolboxBtn, {
              [styles.toolboxBtnDisabled]: !undoData || isUndoing,
            })}
            onClick={onUndo}
          >
            Undo
          </span>
          <span
            className={classNames(styles.toolboxBtn, {
              [styles.toolboxBtnDisabled]: !redoData || isRedoing,
            })}
            onClick={onRedo}
          >
            Redo
          </span>
          <Input
            className={styles.search}
            value={currentTabQuery.search}
            onChangeText={(text) =>
              dispatch(updateQuery({ ...currentTabQuery, search: text }))
            }
            placeholder="🔎 Search"
          />
        </div>
      </div>
      {tabItems.length ? (
        <Tab
          activeTab={activeTab}
          className={styles.tab}
          items={tabItems}
          contentClassName={styles["tab-content"]}
          renderContent={({ item }) => (
            <DataTable key={item} query={listOfQuery[item as number]} />
          )}
          onNewTabCreate={() => dispatch(createNewTab())}
          onTabDelete={(item) => dispatch(deleteTab(item as number))}
          onActiveTabChange={(item) =>
            dispatch(updateActiveTab(item as number))
          }
          canAddNewTab
        />
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default Home;
