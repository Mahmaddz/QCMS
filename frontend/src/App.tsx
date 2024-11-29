import {RouterProvider} from "react-router-dom";
import router from './routes/router';
import ContainerToast from "./components/ContainerToast";
import { useAuth } from "./context/Auth/useAuth";
import Loader from "./components/Loader";

function App() {
  const {userRole} = useAuth();

  return (
    <>
      <Loader duration={3000} />
      <RouterProvider router={router({role: userRole})}/>
      <ContainerToast/>
    </>
  )
}

export default App
