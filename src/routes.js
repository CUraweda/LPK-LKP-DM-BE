import express from 'express';
import authenticationRouter from './core/authentication/authentication.router.js';
import landingpageRouter from './core/cms/config/landingpage/landingpage.router.js';
const router = express.Router();

export const routeLists = [
    {
        path: '/auth',
        route: authenticationRouter
    },
    {
        path: '/cms/config',
        route: landingpageRouter
    },
]

routeLists.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;
