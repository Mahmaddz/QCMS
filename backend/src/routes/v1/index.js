const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const fileRoute = require('./file.route');
const rolesRoute = require('./roles.route');
const quranaRoute = require('./qurana.route');
const ayatRoute = require('./ayat.route');
const wordsRoute = require('./words.route');
const tagRoute = require('./tag.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/file',
    route: fileRoute,
  },
  {
    path: '/roles',
    route: rolesRoute,
  },
  {
    path: '/qurana',
    route: quranaRoute,
  },
  {
    path: '/ayat',
    route: ayatRoute,
  },
  {
    path: '/words',
    route: wordsRoute,
  },
  {
    path: '/tags',
    route: tagRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
