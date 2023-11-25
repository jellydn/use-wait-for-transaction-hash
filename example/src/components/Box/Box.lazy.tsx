import React, { Suspense, lazy } from "react";

const LazyBox = lazy(() => import("./Box"));

const Box = (
  props: JSX.IntrinsicAttributes & { children?: React.ReactNode },
) => (
  <Suspense fallback={null}>
    <LazyBox>{props.children}</LazyBox>s
  </Suspense>
);

export default Box;
