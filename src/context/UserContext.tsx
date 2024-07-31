import React, { createContext, useReducer, ReactNode } from "react";

interface UserState {
  username: string | null;
  balance: string | null;
  access_token: string | null;
}

interface UserAction {
  type: "LOGIN" | "LOGOUT" | "UPDATE_BALANCE";
  payload?: { username: string; accessToken: string; balance: string };
}

const initialState: UserState = {
  username: sessionStorage.getItem("username"),
  access_token: sessionStorage.getItem("access_token"),
  balance: sessionStorage.getItem("balance"),
};

const UserContext = createContext<{
  state: UserState;
  dispatch: React.Dispatch<UserAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case "LOGIN":
      if (action.payload) {
        sessionStorage.setItem("username", action.payload.username);
        sessionStorage.setItem("access_token", action.payload.accessToken);
        sessionStorage.setItem("balance", action.payload.balance);
        return {
          username: action.payload.username,
          access_token: action.payload.accessToken,
          balance: action.payload.balance,
        };
      }
      return state;
    case "LOGOUT":
      sessionStorage.removeItem("username");
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("balance");
      return {
        username: null,
        access_token: null,
        balance: null,
      };
    case "UPDATE_BALANCE":
      if (action.payload) {
        sessionStorage.setItem("balance", action.payload.balance);
        return {
          username: state.username,
          access_token: state.access_token,
          balance: action.payload.balance,
        };
      }
      return state;
    default:
      return state;
  }
};

const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
