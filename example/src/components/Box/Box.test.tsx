import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";

import Box from "./Box";

describe("<Box />", () => {
  test("it should mount", () => {
    render(<Box>Test</Box>);

    const box = screen.getByTestId("Box");

    expect(box).toBeInTheDocument();
  });
});
