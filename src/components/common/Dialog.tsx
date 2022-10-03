import { useLayoutEffect } from "react";
import { FC, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "@styles/components/dialog.module.scss";
import Button from "./Button";
import { useCallback } from "react";

interface DialogProps {
  isOpen: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const Dialog: FC<DialogProps> = ({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
  confirmLabel,
  cancelLabel,
}) => {
  const modalRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    modalRef.current = document.getElementById("modal");
  }, []);

  if (!modalRef.current) return null;

  return isOpen
    ? createPortal(
        <>
          <div className={styles.overlay}></div>
          <div className={styles.dialog}>
            <div className={styles.content}>
              <div className={styles.title}>{title}</div>
              {description ? (
                <div className={styles.description}>{description}</div>
              ) : null}
            </div>
            <div className={styles.footer}>
              <Button onClick={onConfirm}>{confirmLabel ?? "Confirm"}</Button>
              <Button onClick={onCancel}>{cancelLabel ?? "Cancel"}</Button>
            </div>
          </div>
        </>,
        modalRef.current
      )
    : null;
};

export default Dialog;
