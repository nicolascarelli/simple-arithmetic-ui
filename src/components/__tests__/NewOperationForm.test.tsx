import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { UserContext, UserState } from "../../context/UserContext";
import NewOperationForm from "../NewOperationForm";
import { createOperation } from "../../services/services";
import { OperationType } from "../../helpers/OperationType";

jest.mock("../../services/services", () => ({
  createOperation: jest.fn(),
}));

const mockDispatch = jest.fn();

const renderNewOperationForm = (state: Partial<UserState> = {}) => {
  render(
    <UserContext.Provider
      value={{
        state: {
          username: "testuser",
          access_token: "test",
          ...state,
        } as UserState,
        dispatch: mockDispatch,
      }}
    >
      <NewOperationForm />
    </UserContext.Provider>
  );
};

describe("NewOperationForm", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear any previous mock calls
  });

  it("renders the form", () => {
    renderNewOperationForm();
    expect(screen.getByText(/new operation/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/operation/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/input 1/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("handles form submission and displays result", async () => {
    (createOperation as jest.Mock).mockResolvedValueOnce({
      data: {
        operation_response: "5",
        user_balance: 100,
      },
    });

    renderNewOperationForm();

    fireEvent.change(screen.getByLabelText(/operation/i), {
      target: { value: OperationType.ADDITION },
    });
    fireEvent.change(screen.getByLabelText(/input 1/i), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByLabelText(/input 2/i), {
      target: { value: "3" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() =>
      expect(createOperation).toHaveBeenCalledWith(
        { type: OperationType.ADDITION, args: [2, 3] },
        "test"
      )
    );

    expect(await screen.findByText(/result: 5/i)).toBeInTheDocument();
  });

});
