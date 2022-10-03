import { FC, HTMLProps, PropsWithChildren } from "react";
import styles from "@styles/components/button.module.scss";
import classNames from "classnames";

interface ButtonProps {
  className?: string;
  onClick?: () => void;
}

const Button: FC<PropsWithChildren<ButtonProps>> = ({
  onClick,
  className,
  children,
}) => {
  return (
    <button
      type="button"
      className={classNames(styles.button, className)}
      onClick={() => onClick?.()}
    >
      {children}
    </button>
  );
};

export default Button;
