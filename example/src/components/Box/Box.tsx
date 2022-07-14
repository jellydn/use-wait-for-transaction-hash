import React, { FC } from "react";

import "./Box.css";

const Box: FC<JSX.IntrinsicAttributes & { children?: React.ReactNode }> = ({
  children,
}) => (
  <div className="Box" data-testid="Box">
    {children}
  </div>
);

export default Box;
