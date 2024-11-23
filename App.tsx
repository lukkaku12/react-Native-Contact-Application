import React from 'react';
import StackNavigator from './src/navigation/StackNavigator';
import { AuthProvider } from './src/context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
    <StackNavigator />
    </AuthProvider>
  );
};

export default App;
