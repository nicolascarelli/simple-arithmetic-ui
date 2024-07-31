import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from './context/UserContext';

const ProtectedRoute: React.FC<{ component: React.FC }> = ({ component: Component }) => {
  const { state } = useContext(UserContext);

  return state.access_token ? <Component /> : <Navigate to="/login" />;
};

export default ProtectedRoute;