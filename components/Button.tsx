import React, { ButtonHTMLAttributes } from "react";
import cn from "classnames";
import styles from "./Button.module.scss";

export interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outlined" | "text";
  icon?: boolean;
  block?: boolean;
  full?: boolean;
  disabled?: boolean;
}

export const Button: React.FC<Props> = ({
  variant,
  disabled = false,
  icon = false,
  block = false,
  full = false,
  children,
  ...props
}) => {
  const classNames = cn(styles.root, {
    [styles.outlined]: variant === "outlined",
    [styles.text]: variant === "text",
    [styles.icon]: icon,
    [styles.block]: block,
    [styles.full]: full,
  });

  return (
    <button className={classNames} disabled={disabled} {...props}>
      {children}
    </button>
  );
};

export default Button;
