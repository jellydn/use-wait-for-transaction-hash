import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Box from "./Box";

describe("<Box />", () => {
  test("it should mount", () => {
    render(<Box>Test</Box>);

    const box = screen.getByTestId("Box");

    expect(box).toBeInTheDocument();
  });
});
