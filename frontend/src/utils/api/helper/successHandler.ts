import Toaster from "../../helper/Toaster";
import { responseMessages } from "./ResponseMessages";
import { SuccessHandlerOptions } from "../../../interfaces/SuccessHandlerType";

const successHandler = ({ response, options={ notifyOnSuccess: true }}: SuccessHandlerOptions): void => {
    const message = response.data && response.data.message;
    const successText = message || responseMessages[response.status];

    if (response.status >= 200 && response.status < 300 && options.notifyOnSuccess) {
        Toaster(successText, "success")
    }
};

export default successHandler;