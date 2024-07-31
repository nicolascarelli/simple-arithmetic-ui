import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import LoginForm from './components/LoginForm';
import NewOperationForm from './components/NewOperationForm';
import ProtectedRoute from './ProtectedRoute';
import Header from './components/Header';
import RecordsTable from './components/RecordsTable';

const App: React.FC = () => {
  return (
    <UserProvider>
      <Router>
        <Header /> 
        <Routes>
          <Route path="/new-operation" element={<ProtectedRoute component={NewOperationForm} />} />
          <Route path="/records" element={<ProtectedRoute component={RecordsTable} /> } />
          <Route path='*' element={<LoginForm />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;