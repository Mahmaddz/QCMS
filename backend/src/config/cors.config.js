const allowedOrigins = {
  'http://localhost:5173': ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  'http://localhost': ['GET'],
};

const allowedHeaders = ['Content-Type', 'Authorization'];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || Object.keys(allowedOrigins).includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: (req, callback) => {
    const { origin } = req.headers;
    const methods = allowedOrigins[origin] || [];
    if (methods.length > 0) {
      callback(null, methods.join(','));
    } else {
      callback(new Error('HTTP methods not allowed for this origin'));
    }
  },
  allowedHeaders: allowedHeaders.join(','),
  credentials: true,
};

module.exports = {
  corsOptions,
};
