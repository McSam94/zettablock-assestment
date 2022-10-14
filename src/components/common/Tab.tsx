import { FC, ReactNode, useState, MouseEvent } from "react";
import classNames from "classnames";
import styles from "@styles/components/tab.module.scss";
import { useCallback } from "react";
import { useMemo } from "react";

interface ITab {
  label: string;
  value: string | number;
}

interface TabItemProps {
  item: ITab;
  isActive: boolean;
  tabClassName?: string;
  setActiveTab: (item: string | number) => void;
  onTabDelete?: (item: string | number) => void;
}

const TabItem: FC<TabItemProps> = ({
  item,
  isActive,
  tabClassName,
  setActiveTab,
  onTabDelete,
}) => {
  const [isHovering, setIsHovering] = useState<boolean>(false);

  const shouldShowDelete = useMemo(
    () => isHovering && isActive,
    [isHovering, isActive]
  );

  return (
    <div
      key={item.value}
      style={{ zIndex: isActive ? 10 : 1 }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={classNames(styles.item, tabClassName, {
        [styles["item--active"]]: isActive,
        [styles["item__delete"]]: shouldShowDelete,
      })}
      onClick={() => setActiveTab(item.value)}
    >
      <span>{item.label}</span>
      <span
        onClick={(evt: MouseEvent<HTMLSpanElement>) => {
          evt.stopPropagation();
          onTabDelete?.(item.value);
        }}
      >
        {shouldShowDelete ? "x" : null}
      </span>
    </div>
  );
};

interface TabProps {
  items: ITab[];
  renderContent: ({ item }: { item: string | number }) => ReactNode;
  canAddNewTab?: boolean;
  className?: string;
  tabClassName?: string;
  contentClassName?: string;
  onNewTabCreate?: () => void;
  onTabDelete?: (item: string | number) => void;
  activeTab: string | number;
  onActiveTabChange: (item: string | number) => void;
}

const Tab: FC<TabProps> = ({
  items,
  renderContent,
  canAddNewTab = false,
  className,
  tabClassName,
  contentClassName,
  onNewTabCreate,
  onTabDelete,
  activeTab,
  onActiveTabChange,
}) => {
  return (
    <div className={classNames(styles.container, className)}>
      <div className={styles.items}>
        {items.map((item) => {
          const isActive = activeTab === item.value;
          return (
            <TabItem
              key={item.value}
              item={item}
              isActive={isActive}
              tabClassName={tabClassName}
              onTabDelete={onTabDelete}
              setActiveTab={onActiveTabChange}
            />
          );
        })}
        {canAddNewTab ? (
          <div className={styles["item-new"]} onClick={onNewTabCreate}>
            ➕
          </div>
        ) : null}
      </div>
      <div className={classNames(styles.content, contentClassName)}>
        {renderContent({ item: activeTab })}
      </div>
    </div>
  );
};

export default Tab;
