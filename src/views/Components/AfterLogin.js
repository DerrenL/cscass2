import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
// core components
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Parallax from "components/Parallax/Parallax.js";
// @material-ui/core components
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Tooltip from "@material-ui/core/Tooltip";
import Disqus from "disqus-react";
// @material-ui/icons
import { Apps, ExitToApp, Subscriptions } from "@material-ui/icons";

// core components
import styles2 from "assets/jss/material-kit-react/components/headerLinksStyle.js";
import {useState} from 'react';
import {auth,db} from "../../Firebase.js";

import AfterLoginSectionBasics from "./Sections/AfterLoginSectionBasics.js";

import styles from "assets/jss/material-kit-react/views/components.js";

// // Initialize client with name of your database and PUBLIC token
// var recombee = require('recombee-api-client');
// var rqs = recombee.requests;
// var client = new recombee.ApiClient('csc-assignment2-dev', 'LslaDRa4LOfTo6ZYEHOFmP0O79XZ3hzZkCfrO1cG5WXwWHHSxZtuJOUaWIfyQFTD');

// var interactions = require('../../purchases.json');

// var requests = interactions.map((interaction) => {
//   var userId = interaction['user_id'];
//   var itemId = interaction['item_id'];
//   var time = interaction['timestamp'];

//   return new rqs.AddPurchase(userId, itemId, {timestamp: time, cascadeCreate: true});
// });
// client.send(new rqs.Batch(requests), (err, responses) => {
//   console.log(responses);
// });


//================
const useStyles = makeStyles(styles);
const useStyles2 = makeStyles(styles2)

export default function AfterLogin(props) {

  const [displayname,setDisplayName] = useState("");
  const [role,setRole] = useState("");
  const [subscribe,setSubscribe] = useState("");
  const classes2 = useStyles2();
  
  function logout(){
    auth.signOut();
    //window.location.href='/login-page'
  }
  function test(){
    auth.onAuthStateChanged(function(user){
      if(!user){
          window.location.href="/";
      }
      //console.log(user.email);
      db.collection('users').doc(user.email).get().then(doc=>{
        setDisplayName(doc.data().name);
        setRole(doc.data().role);
      })
      db.collection('StripePayment').doc(user.email).get().then(doc=>{
        
        if(doc.data() != undefined){
          
          db.collection("users").doc(user.uid).update({
            role: 'subscribed'
          });
        }
        
      })
      
      
  })
  }
  test();

  function haveSubscribe(){
    if(role=="Free Registered User"){
      return  (<Button
    onClick={event =>  window.location.href='/subscribe-page'}
    color="transparent"
    target="_blank"
    className={classes2.navLink}
  >
    <Subscriptions className={classes2.icons} /> Subscribe
  </Button>)
  }
  else{
    
  }
}

  function display(){
    return(
    <List className={classes2.list}>
      <ListItem className={classes2.listItem}>
        <Tooltip
          id="instagram-twitter"
          title="Follow us on twitter"
          placement={window.innerWidth > 959 ? "top" : "left"}
          classes={{ tooltip: classes2.tooltip }}
        >
          <Button
            href="https://twitter.com/CreativeTim?ref=creativetim"
            target="_blank"
            color="transparent"
            className={classes2.navLink}
          >
            <i className={classes2.socialIcons + " fab fa-twitter"} />
          </Button>
        </Tooltip>
      </ListItem>
      <ListItem className={classes2.listItem}>
        <Tooltip
          id="instagram-facebook"
          title="Follow us on facebook"
          placement={window.innerWidth > 959 ? "top" : "left"}
          classes={{ tooltip: classes2.tooltip }}
        >
          <Button
            color="transparent"
            href="https://www.facebook.com/CreativeTim?ref=creativetim"
            target="_blank"
            className={classes2.navLink}
          >
            <i className={classes2.socialIcons + " fab fa-facebook"} />
          </Button>
        </Tooltip>
      </ListItem>
      <ListItem className={classes2.listItem}>
        <Tooltip
          id="instagram-tooltip"
          title="Follow us on instagram"
          placement={window.innerWidth > 959 ? "top" : "left"}
          classes={{ tooltip: classes2.tooltip }}
        >
          <Button
            color="transparent"
            href="https://www.instagram.com/CreativeTimOfficial?ref=creativetim"
            target="_blank"
            className={classes2.navLink}
          >
            <i className={classes2.socialIcons + " fab fa-instagram"} />
          </Button>
        </Tooltip>
      </ListItem>

      <Button
          color="transparent"
          target="_blank"
          className={classes2.navLink}
        >
         {"Welcome ,"+displayname.toString()+' ('+role.toString()+')'}
        </Button>

      {haveSubscribe()}
      
      <Button
          onClick={logout}
          color="transparent"
          target="_blank"
          className={classes2.navLink}
        >
          <ExitToApp className={classes2.icons} /> Log Out
        </Button>

    </List>
    )
  }

  //disqus
  const disqusShortname = "tltt"
  const disqusConfig = {
    url: "http://localhost:3000",
    identifier: "test",
    title: "TLTT"
  }

  function disqus(){
    if(role=="subscribed"){
      return(
        <div className="article-container">
    
        <h1>Discussion about The Life Time Talents</h1>
    
        <p>Comment now!</p>
    
        <Disqus.DiscussionEmbed
          shortname={disqusShortname}
          config={disqusConfig}
        />
      </div>
      )
    }
    else{}
  }

  
  
  const classes = useStyles();
  const { ...rest } = props;
  return (
    <div>
      <Header
        brand="TLTT"
        rightLinks={display()}
        fixed
        color="transparent"
        changeColorOnScroll={{
          height: 400,
          color: "white"
        }}
        {...rest}
      />
      <Parallax image={require("assets/img/bg6.jpg")}>
        <div className={classes.container}>
          <GridContainer>
            <GridItem>
              <div className={classes.brand}>
                <h1 className={classes.title}>The Life Time Talents.</h1>
                <h3 className={classes.subtitle}>
                Share, comment, and spread smiling images of different talents
                </h3>
              </div>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>

      <div className={classNames(classes.main, classes.mainRaised)}>
        <AfterLoginSectionBasics />
        {/* <SectionNavbars />
        <SectionTabs />
        <SectionPills />
        <SectionNotifications />
        <SectionTypography />
        <SectionJavascript />
        <SectionCarousel />
        <SectionCompletedExamples />
        <SectionLogin /> */}
        {/* <GridItem md={12} className={classes.textCenter}>
          <Link to={"/login-page"} className={classes.link}>
            <Button color="primary" size="lg" simple>
              View Login Page
            </Button>
          </Link>
        </GridItem>
        <SectionExamples />
        <SectionDownload /> */}
      </div>
      {/* <Footer /> */}
      
        {disqus()}
      
    </div>
  );
}
