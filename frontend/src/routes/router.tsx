import { createBrowserRouter } from 'react-router-dom';
import { componentRoutes } from './AllRoutes';

const router = ({role}: {role: number}) => (
    createBrowserRouter(
        componentRoutes
            .filter(route => route?.allowedRoles?.includes(role))
            .map(route => ({
                path: route.path,
                element: route.element,
            }))
    )
);

export default router;