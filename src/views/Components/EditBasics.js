import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import axios from 'axios';
import { useState, useEffect, Component } from 'react';
import Button from '@material-ui/core/Button';
import CardBody from "components/Card/CardBody.js";
import { URL } from "url";
import { forEachTrailingCommentRange } from "typescript";


var pageURL = window.location.href;
var lastURLSegment = pageURL.substr(pageURL.lastIndexOf('/') + 1);

//EDIT
// function editTalent() {
//   // if((displayurl != '')&&(displayname != '')&&(displayage != '')&&(displayoccupation !='')&&(displaydescription !=''))
//   // {
//   axios
//     .put('/api/profile/edit-talent/' + lastURLSegment, {
//       "url": this.state.displayurl,
//       "name": this.state.displayname,
//       "age": this.state.displayage,
//       "occupation": this.state.displayoccupation,
//       "description": this.state.displaydescription
//     })
 
//   window.alert('Successfully edited talent!')
//   window.location.href = "/afterlogin-page"
//   //}
//   // else{
//   //     window.alert('Please input neccessary data!')
//   // }
// }

class EditBasics extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      displayurl: null,
      displayage: null,
      displayname: null,
      displayoccupation: null,
      displaydescription: null
    }
  }
  componentDidMount() {
    try {
      axios
        .get('/api/profile/onetalent-details/' + lastURLSegment)
        .then((response) => {
          let temp=[];
          temp.push(response.data[0])
          let data = temp;
          this.setState({ data });
          console.log(this.state.data[0].url);
          let displayurl = this.state.data[0].url;
          this.setState({displayurl});
          let displayname = this.state.data[0].talentName;
          this.setState({displayname});
          let displayage = this.state.data[0].talentAge;
          this.setState({displayage});
          let displayoccupation = this.state.data[0].talentOccupation;
          this.setState({displayoccupation});
          let displaydescription = this.state.data[0].talentDescription;
          this.setState({displaydescription});

        })
    }
    catch (error) {
      console.log(error);
    }
  }
  
handleTalentUrl =(e) => {
    this.setState({displayurl: e.target.value});
} 
handleTalentName =(e) => {
    this.setState({displayname: e.target.value});
}
handleTalentAge =(e) => {
  this.setState({displayage: e.target.value});
}
handleTalentOccupation =(e) => {
  this.setState({displayoccupation: e.target.value});
}
handleTalentDescription =(e) => {
  this.setState({displaydescription: e.target.value});
}

editTalent = (event) => {
  axios
  .put('/api/profile/edit-talent/' + lastURLSegment, {
    "url": this.state.displayurl,
    "name": this.state.displayname,
    "age": this.state.displayage,
    "occupation": this.state.displayoccupation,
    "description": this.state.displaydescription
  })

window.alert('Successfully edited talent!')
window.location.href = "/afterlogin-page"
}

  // let test = [];
  // const [testa, setTesta] = useState("a")

  // async function fetchData() {
  //   let res = await
  //     axios
  //       .get('/api/profile/onetalent-details/'+lastURLSegment);
  //   let data = await res.data;

  //   test.push(data)
  //   //console.log('data')
  //   //console.log(test[0])
  //   setTesta(test[0])
  // }
  // useEffect(() => {
  //   fetchData();
  // }, []); //This will run only once 


  // //get specific talent
  // const temp=[];
  // const [test,setTest] = useState();
  // function displayOneData(){
  //   axios
  //   .get('/api/profile/onetalent-details/'+lastURLSegment)
  //   .then((response) => {
  //     temp.push(response.data[0])
  //     //console.log(temp[0]);
  //     setTest(temp[0]);
  //   })
  //   }

  //   displayOneData();

  // const url = testa[0].url;
  // const talentname = testa[0].talentName;
  // const talentage = testa[0].talentAge;
  // const talentoccupation = testa[0].talentOccupation;
  // const talentdescription = testa[0].talentDescription;

  // const [displayurl,setDisplayUrl] = useState();
  // const [displayname,setDisplayName] = useState();
  // const [displayage,setDisplayAge] = useState();
  // const [displayoccupation,setDisplayOccupation] = useState();
  // const [displaydescription,setDisplayDescription] = useState();





  render() {
    return (
      <div>
        <h3><b>Edit Talent</b></h3>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardBody>
                <h4><b>Image URL :</b></h4>
                <input className="form-control" type="text" defaultValue={this.state.displayurl} onChange={this.handleTalentUrl} />
                <br></br>
                <h4><b>Talent Name :</b></h4>
                <input className="form-control" type="text" defaultValue={this.state.displayname} onChange={this.handleTalentName} />
                <br></br>
                <h4><b>Talent Age :</b></h4>
                <input className="form-control" type="text" defaultValue={this.state.displayage} onChange={this.handleTalentAge} />
                <br></br>
                <h4><b>Talent Occupation :</b></h4>
                <input className="form-control" type="text" defaultValue={this.state.displayoccupation} onChange={this.handleTalentOccupation} />
                <br></br>
                <h4><b>Talent Description :</b></h4>
                <textarea className="form-control" type="text" defaultValue={this.state.displaydescription} onChange={this.handleTalentDescription} />
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={12}>
            <Button onClick={this.editTalent} fullWidth color="success">Save</Button>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

export default EditBasics;