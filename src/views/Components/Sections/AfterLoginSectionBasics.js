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


import paul from "assets/img/paul.jpg";
import brad from "assets/img/brad.jpg";
import wes from "assets/img/wes.jpg";


import styles from "assets/jss/material-kit-react/views/componentsSections/basicsStyle.js";

const useStyles = makeStyles(styles);

export default function SectionBasics() {
  const classes = useStyles();
  return (
    <div className={classes.sections}>
      <div className={classes.container}>
        <div className={classes.title}>
          <h4>Recommended for you</h4>
        </div>
        <GridContainer>
        <GridItem xs={12} sm={12} md={4}>
          <Card className={classes.root}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="140"
                className={classes.media}
                image={paul}
                title=""
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h3">
                  Paul Phua
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Paul Phua is a professional poker player who host Triton Poker competition
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </GridItem> 

        <GridItem xs={12} sm={12} md={4}>
          <Card className={classes.root}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="140"
                className={classes.media}
                image={brad}
                title=""
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h3">
                  Brad Owen
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Brad Owen is a professional poker player who host Triton Poker competition
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </GridItem> 

        <GridItem xs={12} sm={12} md={4}>
          <Card className={classes.root}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="140"
                className={classes.media}
                image={wes}
                title=""
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h3">
                  Wes Cutshall
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Wes Cutshall is a professional poker player who host Triton Poker competition
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </GridItem> 
        </GridContainer>
        <br></br>
        <GridContainer>
          <GridItem xs={12} sm={12} md={4}>
            
              <Button onClick={event =>  window.location.href='/uploadimage-page'} color="primary">Upload image</Button>
            
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
}
