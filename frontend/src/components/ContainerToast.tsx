import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContainerToast: React.FC = () => {

    return (<ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
    />);
}

export default ContainerToast;