//import { db } from "./src/Firebase";
const firebase = require('firebase');
var firebaseConfig = {
	apiKey: "AIzaSyAL2s3dXACvm5pXrLV0P6EAvHcbTVG6wYM",
	authDomain: "csc-assignment2.firebaseapp.com",
	databaseURL: "https://csc-assignment2.firebaseio.com/",
	projectId: "csc-assignment2",
	storageBucket: "csc-assignment2.appspot.com",
	messagingSenderId: "65627261079",
	appId: "1:65627261079:web:88694038df1fe5602041d2"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);




const app = express();
const endpointSecret = 'whsec_D5y8KpSYruKw3jTdbxImVPTp4NIibsSP';

//webhook
app.use(express.static(process.env.STATIC_DIR));
app.use(
	express.json({
		// We need the raw body to verify webhook signatures.
		// Let's compute it only when hitting the Stripe webhook endpoint.
		verify: function (req, res, buf) {
			if (req.originalUrl.startsWith('/stripe-webhook')) {
				req.rawBody = buf.toString();
			}
		},
	})
);



// //Connect to DB
// mongoose.connect("mongodb+srv://tempadmin:P@ssw0rd@cluster0-5tifl.mongodb.net/test?retryWrites=true&w=majority",
// 	{ useNewUrlParser: true, useUnifiedTopology: true },
// 	() => console.log('connected to DB!')
// );

//Middlewares
// app.use(express.json());
// //Route Middlewares
// app.use('/api/user', authRoute);
// app.use('/api/posts', postRoute);
// /**
//  * Configure the middleware.
//  * bodyParser.json() returns a function that is passed as a param to app.use() as middleware
//  * With the help of this method, we can now send JSON to our express application.
//  */



//for s3 uploading image
const router = express.Router();
const profile = require('./routes/api/profile');
app.use('/api/profile', profile);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// We export the router so that the server.js file can pick it up
module.exports = router;
// Combine react and node js servers while deploying( YOU MIGHT HAVE ALREADY DONE THIS BEFORE
// What you need to do is make the build directory on the heroku, which will contain the index.html of your react app and then point the HTTP request to the client/build directory

if (process.env.NODE_ENV === 'production') {
	// Set a static folder
	app.use(express.static('client/build'));
	app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')));

}

app.get('/config', async (req, res) => {
	const price = await stripe.prices.retrieve('price_1Gs8dTDuK8gXs6RwbYyZ0CvU');

	res.send({
		publicKey: process.env.STRIPE_PUBLISHABLE_KEY,
		unitAmount: price.unit_amount,
		currency: price.currency,
	});
});



// Fetch the Checkout Session to display the JSON result on the success page
app.get('/checkout-session', async (req, res) => {
	const { sessionId } = req.query;
	const session = await stripe.checkout.sessions.retrieve(sessionId);
	res.send(session);
});

app.post('/create-checkout-session', async (req, res) => {
	const domainURL = process.env.DOMAIN;

	const { quantity, locale } = req.body;
	// Create new Checkout Session for the order
	// Other optional params include:
	// [billing_address_collection] - to display billing address details on the page
	// [customer] - if you have an existing Stripe Customer ID
	// [customer_email] - lets you prefill the email input in the Checkout page
	// For full details see https://stripe.com/docs/api/checkout/sessions/create
	const session = await stripe.checkout.sessions.create({
		payment_method_types: "card".split(', '),
		mode: 'subscription',
		locale: locale,
		line_items: [
			{
				price: 'price_1Gs8dTDuK8gXs6RwbYyZ0CvU',
				quantity: quantity
			},
		],
		// ?session_id={CHECKOUT_SESSION_ID} means the redirect will have the session ID set as a query param
		success_url: `http://localhost:3000/afterlogin-page`,
		cancel_url: `http://localhost:3000/`,
	});

	res.send({
		sessionId: session.id,
	});
});

// Webhook handler for asynchronous events.
app.post('/stripe-webhook', async (req, res) => {
	let data;
	let eventType;
	// Check if webhook signing is configured.
	if (process.env.STRIPE_WEBHOOK_SECRET) {
		// Retrieve the event by verifying the signature using the raw body and secret.
		let event;
		let signature = req.headers['stripe-signature'];

		try {
			event = stripe.webhooks.constructEvent(
				req.rawBody,
				signature,
				process.env.STRIPE_WEBHOOK_SECRET
			);
		} catch (err) {
			console.log(`⚠️  Webhook signature verification failed.`);
			return res.sendStatus(400);
		}
		// Extract the object from the event.
		data = event.data;
		eventType = event.type;
	} else {
		// Webhook signing is recommended, but if the secret is not configured in `config.js`,
		// retrieve the event data directly from the request body.
		data = req.body.data;
		eventType = req.body.type;
	}

	switch (eventType) {
		case 'invoice.payment_succeeded':
			console.log(data);
			const custId = data['object']['customer'];
			const email = data['object']['customer_email'];
			console.log(`cust id: ${custId}`);
			console.log(`cust email: ${email}`);
			db.collection('StripePayment').doc(email).set({
				CustId: custId,
				PaymentStatus: 'Success'
			});
			db.collection("users").doc(email).update({
				role: 'subscribed'
			});
			break;
		case 'invoice.payment_failed':
			const custId2 = data['object']['customer'];
			const email2 = data['object']['customer_email'];
			db.collection('StripePayment').doc(custId2).set({
				Email: email2,
				PaymentStatus: 'Failed'
			});
			break;
		case 'customer.subscription.created':
			const subId = data['object']['id'];
			const custId3 = data['object']['customer'];
			const created = data['object']['created'];
			const periodStart = data['object']['current_period_start'];
			const periodEnd = data['object']['current_period_end'];
			const billingMethod = data['object']['collection_method'];
			const daysUntilDue = data['object']['days_until_due'];
			db.collection('StripeSubscription').doc(custId3).set({
				SubscriptionId: subId,
				CustomerId: custId3,
				Created: created,
				StartPeriod: periodStart,
				EndPeriod: periodEnd,
				BillingMethod: billingMethod,
				DaysUntilDue: daysUntilDue,
				Status: "Created"
			});
			break;

		default:
	}


	res.sendStatus(200);


});

//recombee
// Import the library:
var cors = require('cors');
// Then use it before your routes are set up:
app.use(cors());
//app.use(cors({credentials: true, origin: 'http://localhost:3000/'}));
var http = require("http");
var httpServer = http.createServer(app);


// Set up a port
const port = process.env.PORT || 5000;

httpServer.listen(port, () => console.log(`Server running on port: ${port}`));


