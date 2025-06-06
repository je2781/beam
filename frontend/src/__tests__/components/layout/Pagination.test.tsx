// Pagination.test.tsx
import Pagination from "../../../components/layout/Pagination";
import { render, screen, fireEvent, act } from "@testing-library/react";

describe("Pagination Component", () => {
  let setCount: jest.Mock;
  let setCurrentPage: jest.Mock;
  let setVisibleTrans: jest.Mock;
  let setDividerPositions: jest.Mock;

  const trans = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `trans ${i + 1}`,
  }));

  beforeEach(() => {
    // Create mock functions
    setCount = jest.fn();

    setCurrentPage = jest.fn();

    setVisibleTrans = jest.fn();
    setDividerPositions = jest.fn();
  });

  it("renders the pagination component with correct initial state", () => {
    render(
      <Pagination
        count={1}
        setCount={setCount}
        setDividerPositions={setDividerPositions}
        itemsPerPage={10}
        currentPage={1}
        hasPreviousPage={false}
        hasNextPage={trans.length > 10}
        lastPage={Math.ceil(trans.length / 10)}
        nextPage={2}
        previousPage={0}
        isActivePage={1}
        setCurrentPage={setCurrentPage}
        totalItems={trans.length}
        setVisibleTrans={setVisibleTrans}
        trans={trans}
      />
    );

    // Check if the pagination shows the correct initial count
    expect(screen.getByText("Showing")).toBeInTheDocument();
    expect(screen.getByText("out of 100")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument(); // Current page
  });

  it("updates transactions and current page when the next page button is clicked", () => {
    render(
      <Pagination
        count={1}
        setCount={setCount}
        itemsPerPage={10}
        currentPage={1}
        hasPreviousPage={false}
        hasNextPage={trans.length > 10}
        lastPage={Math.ceil(trans.length / 10)}
        nextPage={2}
        previousPage={0}
        isActivePage={1}
        setCurrentPage={setCurrentPage}
        totalItems={trans.length}
        setVisibleTrans={setVisibleTrans}
        setDividerPositions={setDividerPositions}
        trans={trans}
      />
    );

    // Click the next page button
    act(() => {
      fireEvent.click(screen.getByRole("button", { name: /next/i }));
    });

    // Verify that setCurrentPage and setVisibleTrans were called
    expect(setCurrentPage).toHaveBeenCalledTimes(1);
    expect(setCurrentPage).toHaveBeenCalledWith(expect.any(Function)); // Check it was called with a function

    const updaterFunction = setCurrentPage.mock.calls[0][0]; // Get the first argument of the first call
    expect(updaterFunction(1)).toBe(2); // If currentPage was 1, it should return 2
    expect(setVisibleTrans).toHaveBeenCalledWith(trans.slice(10, 20)); // Visible transactions for the next page
  });

  it("updates transactions and current page when the previous page button is clicked", () => {
    render(
      <Pagination
        count={1}
        setCount={setCount}
        itemsPerPage={10}
        hasPreviousPage={true}
        currentPage={2}
        hasNextPage={trans.length > 20}
        lastPage={Math.ceil(trans.length / 10)}
        nextPage={3}
        previousPage={1}
        isActivePage={2}
        setCurrentPage={setCurrentPage}
        totalItems={trans.length}
        setVisibleTrans={setVisibleTrans}
        setDividerPositions={setDividerPositions}
        trans={trans}
      />
    );

    // Click the previous page 
    act(() => {
      fireEvent.click(screen.getByRole("button", { name: /previous/i }));
    });

    // Verify that setCurrentPage and setVisibleTrans were called
    expect(setCurrentPage).toHaveBeenCalledTimes(1);
    expect(setCurrentPage).toHaveBeenCalledWith(expect.any(Function)); // Check it was called with a function

    const updaterFunction = setCurrentPage.mock.calls[0][0]; // Get the first argument of the first call
    expect(updaterFunction(2)).toBe(1); // If currentPage was 2, it should return 1
    expect(setVisibleTrans).toHaveBeenCalledWith(trans.slice(0, 10)); // Visible transactions for the previous page
  });

  it("updates visible transactions when the up arrow is clicked", () => {
    render(
      <Pagination
        count={1}
        setCount={setCount}
        itemsPerPage={10}
        hasPreviousPage={false}
        currentPage={1}
        hasNextPage={trans.length > 10}
        lastPage={Math.ceil(trans.length / 10)}
        nextPage={2}
        previousPage={0}
        isActivePage={1}
        setCurrentPage={setCurrentPage}
        totalItems={trans.length}
        setVisibleTrans={setVisibleTrans}
        trans={trans}
        setDividerPositions={setDividerPositions}

      />
    );

    // Click the up arrow
    act(() => {
      fireEvent.click(screen.getByRole("button", { name: /up/i }));
    });

    // Verify that setCount was called with the new count
    expect(setCount).toHaveBeenCalledTimes(1);
    expect(setCount).toHaveBeenCalledWith(expect.any(Function)); 

    const updaterFunction = setCount.mock.calls[0][0]; // Get the first argument of the first call
    expect(updaterFunction(1)).toBe(2); // If count was 1, it should return 2
    expect(setVisibleTrans).toHaveBeenCalledWith(trans.slice(0, 2)); // visible users for the current page
  });

  it("updates visible transactions when the down arrow is clicked", () => {
    render(
      <Pagination
        count={2}
        setCount={setCount}
        itemsPerPage={10}
        currentPage={1}
        hasPreviousPage={false}
        hasNextPage={trans.length > 10}
        lastPage={Math.ceil(trans.length / 10)}
        nextPage={2}
        previousPage={0}
        isActivePage={1}
        setCurrentPage={setCurrentPage}
        totalItems={trans.length}
        setVisibleTrans={setVisibleTrans}
        setDividerPositions={setDividerPositions}
        trans={trans}
      />
    );

    // Click the down arrow
    act(() => {
      fireEvent.click(screen.getByRole("button", { name: /down/i }));
    });

    // Verify that setCount was called with the new count
    expect(setCount).toHaveBeenCalledTimes(1);
    expect(setCount).toHaveBeenCalledWith(expect.any(Function)); 

    const updaterFunction = setCount.mock.calls[0][0]; // Get the first argument of the first call
    expect(updaterFunction(2)).toBe(1); // If count was 2, it should return 1
    expect(setVisibleTrans).toHaveBeenCalledWith(trans.slice(0, 1)); // visible users for the current page
  });
});