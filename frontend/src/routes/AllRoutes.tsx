// OTHER IMPORTS
import { PageRoute } from '../interfaces/PageRoute';
import { USER } from '../utils/UserRoles';

// ALL SCREENS
import Login from '../pages/Login';
import Register from '../pages/Register';
import Home from '../pages/Home';
import AdminSettings from '../pages/AdminSettings';
import TagReview from '../pages/TagReview';
import PageNotFound from '../pages/PageNotFound';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';

export const componentRoutes: PageRoute[] = [
    {
        path: "/",
        element: <Home/>,
        allowedRoles: [USER.PUBLIC, USER.REVIEWER, USER.ADMIN],
        displayName: "HOME"
    },
    {
        path: "/login",
        element: <Login/>,
        allowedRoles: [USER.PUBLIC],
        displayName: "LOGIN"
    },
    {
        path: "/forgot-password",
        element: <ForgotPassword/>,
        allowedRoles: [USER.PUBLIC],
        displayName: "FORGOT PASSWORD"
    },
    {
        path: "/reset-password",
        element: <ResetPassword/>,
        allowedRoles: [USER.ADMIN, USER.REVIEWER],
        displayName: "RESET PASSWORD"
    },
    {
        path: "/register",
        element: <Register/>,
        allowedRoles: [USER.PUBLIC],
        displayName: "REGISTER"
    },
    {
        path: "/admin-setting",
        element: <AdminSettings/>,
        allowedRoles: [USER.ADMIN],
        displayName: "SETTINGS"
    },
    {
        path: "/tag-review",
        element: <TagReview/>,
        allowedRoles: [USER.ADMIN],
        displayName: "TAG REVIEW"
    },
    {
        path: "*",
        element: <PageNotFound/>,
        allowedRoles: [USER.PUBLIC, USER.ADMIN, USER.REVIEWER]
    }
]