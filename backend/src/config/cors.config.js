const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const allowedOrigins = {
  'http://localhost:5173': ['POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
  'http://localhost': ['GET'],
};

const allowedHeaders = ['Content-Type', 'Authorization'];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || Object.keys(allowedOrigins).includes(origin)) {
      callback(null, true);
    } else {
      callback(new ApiError(httpStatus.FORBIDDEN, 'Not allowed by CORS'));
    }
  },
  methods: ['POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
  allowedHeaders: allowedHeaders.join(','),
  credentials: true,
};

module.exports = {
  corsOptions,
};
