import { FC } from "react";
import styles from "@styles/components/input.module.scss";
import classNames from "classnames";

interface InputProps {
  className?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

const Input: FC<InputProps> = ({
  className,
  placeholder,
  value,
  onChangeText,
}) => {
  return (
    <input
      className={classNames(styles.input, className)}
      placeholder={placeholder}
      value={value}
      onChange={(evt) => onChangeText?.(evt.target.value)}
    />
  );
};

export default Input;
