
import { toast, ToastPosition } from 'react-toastify'
import { Toast } from '../../interfaces/Toaster';

const Toaster: Toast = async (text="TOAST", type="default") => {
    toast.dismiss();

    const toastDeafultSetting = {
        position: "top-right" as ToastPosition,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined
    }

    if (type !== 'default') {
        toast[type](text, { ...toastDeafultSetting });
    } else {
        toast(text, { ...toastDeafultSetting });
    }

}

export default Toaster;
