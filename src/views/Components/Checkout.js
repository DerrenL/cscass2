import React, { useEffect, useReducer } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Email from "@material-ui/icons/Email";
import People from "@material-ui/icons/People";
// core components
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import axios from 'axios';
import { useState } from 'react';

import styles from "assets/jss/material-kit-react/views/loginPage.js";




const fetchCheckoutSession = async ({ quantity }) => {
  return fetch('/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      quantity,
    }),
  }).then((res) => res.json());
};

const formatPrice = ({ amount, currency, quantity }) => {
  const numberFormat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol',
  });
  const parts = numberFormat.formatToParts(amount);
  let zeroDecimalCurrency = true;
  for (let part of parts) {
    if (part.type === 'decimal') {
      zeroDecimalCurrency = false;
    }
  }
  amount = zeroDecimalCurrency ? amount : amount / 100;
  const total = (quantity * amount).toFixed(2);
  return numberFormat.format(total);
};

function reducer(state, action) {
  switch (action.type) {
    case 'useEffectUpdate':
      return {
        ...state,
        ...action.payload,
        price: formatPrice({
          amount: action.payload.unitAmount,
          currency: action.payload.currency,
          quantity: state.quantity,
        }),
      };
    case 'increment':
      return {
        ...state,
        quantity: state.quantity + 1,
        price: formatPrice({
          amount: state.unitAmount,
          currency: state.currency,
          quantity: state.quantity + 1,
        }),
      };
    case 'decrement':
      return {
        ...state,
        quantity: state.quantity - 1,
        price: formatPrice({
          amount: state.unitAmount,
          currency: state.currency,
          quantity: state.quantity - 1,
        }),
      };
    case 'setLoading':
      return { ...state, loading: action.payload.loading };
    case 'setError':
      return { ...state, error: action.payload.error };
    default:
      throw new Error();
  }
}

const Checkout = () => {
  const useStyles = makeStyles(styles);
const classes = useStyles();
const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
setTimeout(function () {
  setCardAnimation("");
}, 700);
  const [state, dispatch] = useReducer(reducer, {
    quantity: 1,
    price: null,
    loading: false,
    error: null,
    stripe: null,
  });

  useEffect(() => {
    async function fetchConfig() {
      // Fetch config from our backend.
      const { publicKey, unitAmount, currency } = await fetch(
        '/config'
      ).then((res) => res.json());
      // Make sure to call `loadStripe` outside of a component’s render to avoid
      // recreating the `Stripe` object on every render.
      dispatch({
        type: 'useEffectUpdate',
        payload: { unitAmount, currency, stripe: await loadStripe(publicKey) },
      });
    }
    fetchConfig();
  }, []);

  const handleClick = async (event) => {
    // Call your backend to create the Checkout session.
    dispatch({ type: 'setLoading', payload: { loading: true } });
    const { sessionId } = await fetchCheckoutSession({
      quantity: state.quantity,
    });
    // When the customer clicks on the button, redirect them to Checkout.
    const { error } = await state.stripe.redirectToCheckout({
      sessionId,
    });
    // If `redirectToCheckout` fails due to a browser or network
    // error, display the localized error message to your customer
    // using `error.message`.
    if (error) {
      dispatch({ type: 'setError', payload: { error } });
      dispatch({ type: 'setLoading', payload: { loading: false } });
    }
  };

  return (
    <div>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={12}>
              <Card className={classes[cardAnimaton]}>
                  <CardHeader color="primary" className={classes.cardHeader}>
                    <h4>Subscription Plan</h4>
                  </CardHeader>
                  <CardBody>
                    Subscribe now for only $1.00 daily!
                  </CardBody>
                  <CardFooter className={classes.cardFooter}>
                    <Button role="link"
                        onClick={handleClick}
                        disabled={!state.stripe || state.loading}
                         simple color="primary" size="lg" >
                      Subscribe
                    </Button>
                    <div className="sr-field-error">{state.error?.message}</div>
                  </CardFooter>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
    // <div className="sr-root">
    //   <div className="sr-main">
    //     <header className="sr-header">
    //       <div className="sr-header__logo"></div>
    //     </header>
    //     <section className="container">
          
         
    //       {/* <div>
    //         <h2>Subscription Plan</h2>
    //         <h4>Subscribe now for only $1.00 daily!</h4>
    //       </div>
    //       <div className="quantity-setter">
    //       </div> */}

    //       <button
    //         role="link"
    //         onClick={handleClick}
    //         disabled={!state.stripe || state.loading}
    //       >
    //         {state.loading || !state.price
    //           ? `Loading...`
    //           : `Buy for ${state.price}`}
    //       </button>
    //       <div className="sr-field-error">{state.error?.message}</div>
    //     </section>
    //   </div>
    // </div>
  );
};

export default Checkout;
