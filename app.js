const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const session = require('express-session');
const compression = require('compression');
const passport = require('passport')
dotenv.config({ path: 'config.env' });
const ApiError = require('./utils/apiError');
const globalError = require('./middlewares/errorMiddleware');
const dbConnection = require('./config/database');
const AuthRoute = require('./routes/auth')
const slideRoute = require('./routes/slideRoute');
const doctorRoute = require('./routes/DoctorRoutes');
const clinicRoute = require('./routes/ClinicRoutes');
const centerRoute = require('./routes/CenterRoutes');
const userRoute = require("./routes/userRoute");
const reviewRoute = require('./routes/reviewRoutes');
const bookingRoute = require('./routes/bookingRoute');
const bookingController = require('./controllers/bookingController');


// connect with db
dbConnection()
// express App
const app = express();

// Stripe webhook, BEFORE body-parser, because stripe needs the body as stream
// Stripe webhook, BEFORE body-parser, because stripe needs the body as stream
app.post(
    '/webhook-checkout',
    express.raw({ type: 'application/json' }),
    bookingController.webhookCheckout,
    //bookingClinicController.webhookCheckout,
  );

  app.get('/', (req, res) => {
    res.send('Welcome to Roshetta!');
  });
// middlewares
app.use(express.json());

// Middlewares
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    console.log(`node: ${process.env.NODE_ENV}`)
}

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

app.use(compression());


// Routes
app.use('/api/v1/users', userRoute)
app.use('/api/v1/slides', slideRoute);
app.use('/api/v1/auth', AuthRoute);
app.use('/api/v1/doctors', doctorRoute);
app.use('/api/v1/clinics', clinicRoute);
app.use('/api/v1/centers', centerRoute);
app.use('/api/v1/reviews', reviewRoute);
app.use('/api/v1/bookings', bookingRoute);


app.all('*', (req, res, next) => {
    next(new ApiError(`can't find this route: ${req.originalUrl}`, 400))
})

// Global error handling middleware
app.use(globalError)
const PORT = process.env.PORT || 8000
const server = app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});

// Handle rejection ouside express
process.on('unhandledRejection', (err) => {
    console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
    server.close(() => {
        console.error(`Shutting down....`);
        process.exit(1);
    });
});