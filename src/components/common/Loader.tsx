import classNames from "classnames";
import { FC } from "react";
import styles from "@styles/components/loader.module.scss";

interface LoaderProps {
  className?: string;
}

const Loader: FC<LoaderProps> = ({ className }) => {
  return <div className={classNames(styles.loader, className)} />;
};

export default Loader;
