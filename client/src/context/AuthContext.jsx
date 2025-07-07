import React, { createContext, useReducer, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";

const initialState = {
  user: null,
  isAuthenticated: false,
};

const AuthContext = createContext(initialState);

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt_decode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        dispatch({ type: "LOGOUT" });
      } else {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        dispatch({ type: "LOGIN", payload: decodedToken });
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
