import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Table from "components/Table/Table.js";
import {auth} from "../../../Firebase.js";


import styles from "assets/jss/material-kit-react/views/componentsSections/basicsStyle.js";


const useStyles = makeStyles(styles);

export default function SectionBasics() {

  var CardContentStyle={
    display:'fixed',
    height:'190px'
  }

  const array=[];
  const [testb,setTestb] = useState();
  //recombee
  if(auth.currentUser){

    let user = auth.currentUser;
    axios
      .get(`/recombee/recommand?uid=${user.uid}`)
      .then((response) => {
      });
      }else{
      axios
      .get(`/recombee/recommand`)
      .then((response) => {
        console.log(response.data.recomms);
        array.push(response.data.recomms);
        console.log(array);
        console.log("name");
        console.log(array[0][0].values.name);
        setTestb(array)
      });
}
  
  let test = [];
  const [testa, setTesta] = useState();

  async function fetchData() {
    let res = await
      axios
        .get('/api/profile/talent-details');
    let data = await res.data;

    test.push(data)
    console.log('data')
    console.log(test[0])
    setTesta(test[0])
  }
  useEffect(() => {
    fetchData();
  }, []); //This will run only once 
  

  function displaydata() {
    if (testa != undefined) {
      console.log('talentname');
        //console.log(item.talentName)
        //console.log(item.talentOccupation)
        return (
          <Table
              tableHeaderColor="primary"
              tableHead={["Talent Image", "Talent Name", "Talent Age", "Talent occupation", "Talent Description"]}
              tableData={
                testa.map((array) => {
                  return [<img height="100px" width="150px" src={array.url}/>,array.talentName,array.talentAge,array.talentOccupation,array.talentDescription]
                })
              }
            /> 
        )
    }
  }

  function haha(){
    if(testb!=undefined){
      console.log(testb[0][0].values.name);
      return(
        <GridItem xs={12} sm={12} md={4}>
          <Card className={classes.root}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="160"
                className={classes.media}
                image={testb[0][0].values.image_url}
                title=""
              />
              <CardContent style={CardContentStyle}>
                <Typography gutterBottom variant="h5" component="h3">
                  {testb[0][0].values.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {testb[0][0].values.description}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </GridItem> 

      );
      }
  }

    function haha2(){
      if(testb!=undefined){
        return (
        <GridItem xs={12} sm={12} md={4}>
        <Card className={classes.root}>
          <CardActionArea>
            <CardMedia
              component="img"
              height="160"
              className={classes.media}
              image={testb[0][1].values.image_url}
              title=""
            />
            <CardContent style={CardContentStyle}>
              <Typography gutterBottom variant="h5" component="h3">
                {testb[0][1].values.name}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {testb[0][1].values.description}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
        </GridItem> 
    );
  }
  }

  function haha3(){
    if(testb!=undefined){
      return (
      <GridItem xs={12} sm={12} md={4}>
      <Card className={classes.root}>
        <CardActionArea>
          <CardMedia
            component="img"
            height="160"
            className={classes.media}
            image={testb[0][2].values.image_url}
            title=""
          />
          <CardContent style={CardContentStyle}>
            <Typography gutterBottom variant="h5" component="h3">
              {testb[0][2].values.name}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {testb[0][2].values.description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
      </GridItem> 
  );
}
}



  const classes = useStyles();

  return (
    <div className={classes.sections}>
      <div className={classes.container}>
        <div className={classes.title}>
          <h4>Recommended for you</h4>
        </div>
        <GridContainer>
         {haha()}
         {haha2()}
         {haha3()}
        </GridContainer>
        <br></br>


        <div className={classes.title}>
          <h4>Talent Details</h4>
        </div>

        {displaydata()}
       

      </div>
    </div>
  );
}
