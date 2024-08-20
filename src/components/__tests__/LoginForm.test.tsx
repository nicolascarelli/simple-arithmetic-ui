import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { UserContext, UserState } from "../../context/UserContext";
import LoginForm from "../LoginForm";
import { login } from "../../services/services";

jest.mock("../../services/services", () => ({
  login: jest.fn(),
}));

const mockDispatch = jest.fn();
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const renderLoginForm = () => {
  render(
    <UserContext.Provider value={{ state: {} as UserState, dispatch: mockDispatch }}>
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    </UserContext.Provider>
  );
};

describe("LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  it("renders the login form", () => {
    renderLoginForm();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("handles input changes", () => {
    renderLoginForm();
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password" },
    });
    expect(screen.getByLabelText(/username/i)).toHaveValue("testuser");
    expect(screen.getByLabelText(/password/i)).toHaveValue("password");
  });

  it("handles form submission and successful login", async () => {
    renderLoginForm();
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /login/i }));

    await waitFor(() =>
      expect(login).toHaveBeenCalledWith("testuser", "password")
    );
  });

  it("handles login failure", async () => {
    (login as jest.Mock).mockRejectedValueOnce(new Error("Invalid credentials"));
    renderLoginForm();
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  });
});