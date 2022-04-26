import React from "react";
import { useAuth } from './utils/index'
import AuthenticatedApp from "./component/authenticated-app";
import UnauthenticatedApp from "./component/unauthenticated-app";


function App() {
  const user = useAuth();
  return (
    <div>
        { !!user? <AuthenticatedApp />:<UnauthenticatedApp /> }
    </div>
  );
}

export default App;
