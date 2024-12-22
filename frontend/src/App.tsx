import { useState, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./routes/router";
import ContainerToast from "./components/ContainerToast";
import { useAuth } from "./context/Auth/useAuth";
import Loader from "./components/Loader";
import ScrollUpButton from "./components/ScrollUpButton";

function App() {
  const { userRole } = useAuth();
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showLoader ? 
        <Loader /> 
      : <>
        <RouterProvider router={router({ role: userRole })} />
        <ScrollUpButton/>
        <ContainerToast />
      </>
      }
    </>
  );
}

export default App;
