import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Email from "@material-ui/icons/Email";
import People from "@material-ui/icons/People";
// core components
import Header from "components/Header/Header.js";
import SubscribeHeader from "components/Header/SubscribeHeader.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import axios from 'axios';
import { useState } from 'react';

import styles from "assets/jss/material-kit-react/views/loginPage.js";

import image from "assets/img/bg7.jpg";
import { auth, db } from "../../Firebase.js";
import Checkout from "views/Components/Checkout.js";


const useStyles = makeStyles(styles);


export default function SubscribePage(props) {

  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
  const [passemail, setPassEmail] = useState("");
  function test() {
    auth.onAuthStateChanged(function (user) {
      if (!user) {
        window.location.href = "/";
      }
      //console.log(user.email);
      db.collection('users').doc(user.email).get().then(doc => {
        setPassEmail(user.email);
      })

    })
    console.log(passemail);
  }
  test();


  // //create customer function
  // function createCustomer() {
  //   console.log("ss");
  //   console.log(passemail);
  //   let billingEmail = passemail;

  //   return fetch('/create-customer', {
  //     method: 'post',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       email: billingEmail,
  //     }),
  //   })
  //     .then((response) => {
  //       return response.json();
  //     })
  //     .then((result) => {
  //       return result;
  //     });
  // }
  // function createCustomerUsingEmail() {
  //   let customer;
  //   //Create customer
  //   createCustomer().then((result) => {
  //     customer = result.customer;
  //     //window.location.href = '/prices.html?customerId=' + customer.id;
  //   });
  // }

  setTimeout(function () {
    setCardAnimation("");
  }, 700);
  const classes = useStyles();
  const { ...rest } = props;
  return (
    <div>
      <Header
        absolute
        color="transparent"
        brand="TLTT"
        rightLinks={<SubscribeHeader />}
        {...rest}
      />
      <div
        className={classes.pageHeader}
        style={{
          backgroundImage: "url(" + image + ")",
          backgroundSize: "cover",
          backgroundPosition: "top center"
        }}
      >
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={4}>
              <Card className={classes[cardAnimaton]}>
                <Checkout/>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
        {/* <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={4}>
              <Card className={classes[cardAnimaton]}>
                <form id="signup-form" className={classes.form}>
                  <CardHeader color="primary" className={classes.cardHeader}>
                    <h4>Subscribe</h4>
                  </CardHeader>
                  <CardBody>
                    <CustomInput
                      value={passemail}
                      onChange={e=>setRegisterName(e.target.value)}
                      labelText="Name..."
                      id="name"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "text",
                        endAdornment: (
                          <InputAdornment position="end">
                            <Email className={classes.inputIconsColor} />
                          </InputAdornment>
                        )
                      }}
                    />
                    <br></br>
                      <Card>
                        <CardHeader color="info">Basic Plan</CardHeader>
                        <CardBody>$1.00 per day billed daily</CardBody>
                      </Card>
                  </CardBody>
                  <CardFooter className={classes.cardFooter}>
                    <Button onClick={createCustomerUsingEmail} simple color="primary" size="lg">
                      Confirm
                        </Button>
                    <Button id="basic-plan-btn" simple color="primary" size="lg">
                      Subscribe
                    </Button>
                    <button id="checkout-button" data-secret="{{ session_id }}">
                      Checkout
                    </button>
                  </CardFooter>
                </form>
              </Card>
            </GridItem>
          </GridContainer>
        </div> */}
      </div>
    </div>
  )
}

