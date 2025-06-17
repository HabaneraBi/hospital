import type { FC, PropsWithChildren } from "react";

interface ButtonProps {
  onClick: () => void;
}

export const Button: FC<PropsWithChildren<ButtonProps>> = ({
  onClick,
  children,
}) => {
  return (
    <button className="button" onClick={() => onClick()}>
      {children}
    </button>
  );
};
