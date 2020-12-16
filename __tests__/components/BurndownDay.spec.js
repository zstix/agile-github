import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render } from "@testing-library/react";
import BurndownDay from "../../src/components/BurndownDay";

describe("BurndownDay Component", () => {
  it("should render an element for the given day", () => {
    const date = "2020-08-24";
    const { getByTitle } = render(<BurndownDay date={date} />);

    expect(getByTitle(date)).toBeInTheDocument();
  });
});
