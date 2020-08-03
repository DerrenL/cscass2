import React from "react";
import { Component } from 'react';
import axios from 'axios';
import $ from 'jquery';

const deepai = require('deepai');

deepai.setApiKey('d3e92cd6-0e8d-4921-aea4-6dd9d6f18b72');

// (async function() {
//   var resp = await deepai.callStandardApi("nsfw-detector", {
//           image: "https://mk0uploadvrcom4bcwhj.kinstacdn.com/wp-content/uploads/2018/01/Sex-Robots-300x220.jpg",
//   });
//   //console.log(resp.output.nsfw_score);
// })()

async function init() {
  let resp;
  resp = await deepai.callStandardApi("nsfw-detector", {
         image: document.getElementById("wat"),
 });
 return resp.output.nsfw_score;
 //console.log(ha);
 //console.log(resp.output.nsfw_score);
}


class UploadImage extends Component {
	constructor( props ) {
		super( props );
		this.state = {
		 selectedFile: null,
     selectedFiles: null,
     fileName: null,
     talentName:null,
     talentAge:null,
     talentOccupation:null,
     talentDescription:null
		}
     }
     

	   singleFileChangedHandler = ( event ) => {
		  // console.log(event.target.files);
		this.setState({
		 selectedFile: event.target.files[0]
		});
	   };

	   singleFileUploadHandler = ( event ) => {
    const data2 = {name: this.state.talentName, age: this.state.talentAge, occupation: this.state.talentOccupation, description: this.state.talentDescription }
    const data = new FormData();// If file selected
    //console.log(this.state.selectedFile);
		if ( this.state.selectedFile ) {
      (async () => {let test = await init()
      if(test>0.7){
        console.log("cannot pass " + test);
        this.ocShowAlert( 'Please upload file safe for work', 'red' );
      }
      else{
        console.log("can pass "+ test);
        data.append( 'profileImage', this.state.selectedFile, this.state.selectedFile.name);
        data.append( 'data2', JSON.stringify(data2));
        axios.post( '/api/profile/profile-img-upload', data, {
          headers: {
             'accept': 'application/json',
             'Accept-Language': 'en-US,en;q=0.8',
             'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        }
       })
        .then( ( response ) => {if ( 200 === response.status ) {
        // If file size is larger than expected.
        if( response.data.error ) {
         if ( 'LIMIT_FILE_SIZE' === response.data.error.code ) {
          this.ocShowAlert( '	Max size: 2MB', 'red' );
         } 
         else {
          console.log( response.data );// If not the given file type
          this.ocShowAlert( response.data.error, 'red' );
         }
        } else {
         // Success
        this.fileName = response.data;
         console.log( 'fileName', this.fileName);
         this.ocShowAlert( 'File Uploaded', '#3089cf' );
        }
         }
        }).catch( ( error ) => {
        // If another error
        this.ocShowAlert( error, 'red' );
        //retry posting if network error(while loop)
        var counter=0;
        while(counter<2){
        axios.post( '/api/profile/profile-img-upload', data, {
          headers: {
             'accept': 'application/json',
             'Accept-Language': 'en-US,en;q=0.8',
             'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        }
         });
        counter++;
        console.log(counter);
        }
        });
      }
    })()
        
		
		} else {
		 // if file not selected throw error
		 this.ocShowAlert( 'Please upload file', 'red' );
    }
  };


  handleTalentName =(e) => {
    this.setState({talentName: e.target.value});
}
  handleTalentAge =(e) => {
    this.setState({talentAge: e.target.value});
  }
  handleTalentOccupation =(e) => {
    this.setState({talentOccupation: e.target.value});
  }
  handleTalentDescription =(e) => {
    this.setState({talentDescription: e.target.value});
  }


		// ShowAlert Function
 	ocShowAlert = ( message, background = '#3089cf' ) => {
	let alertContainer = document.querySelector( '#oc-alert-container' ),
	 alertEl = document.createElement( 'div' ),
	 textNode = document.createTextNode( message );
	alertEl.setAttribute( 'class', 'oc-alert-pop-up' );
	$( alertEl ).css( 'background', background );
	alertEl.appendChild( textNode );
	alertContainer.appendChild( alertEl );
	setTimeout( function () {
	 $( alertEl ).fadeOut( 'slow' );
	 $( alertEl ).remove();
	}, 3000 );
   };

	render() {
		//console.log(this.state);
		return(
			<div className="container">
				 {/* For Alert box*/}
				 <div id="oc-alert-container"></div>
				{/* Single File Upload*/}
				<div className="card border-light mb-3 mt-5" style={{ boxShadow: '0 5px 10px 2px rgba(195,192,192,.5)' }}>
      			<div className="card-header">
       			<h3 style={{ color: '#555', marginLeft: '12px' }}>Talent Image And Details Upload</h3>
       			<p className="text-muted" style={{ marginLeft: '12px' }}>Upload Size: 250px x 250px ( Max 2MB )</p>
      			</div>
      			<div className="card-body">
       			<p className="card-text">Please upload an image to send to AWS S3 and SQL Database</p>
       			<input type="file" id="wat" onChange={this.singleFileChangedHandler}/>
             <br></br>
            <input type="text" onChange={this.handleTalentName} placeholder="Talent's Name.." id="talentname" required></input>
            <br></br>
            <input type="number" onChange={this.handleTalentAge} placeholder="Talent's Age.." id="talentage" required></input>
            <br></br>
            <input type="text" onChange={this.handleTalentOccupation} placeholder="Talent's Occupation.." id="talentoccupation" required></input>
            <br></br>
            <textarea id="talentdescription" onChange={this.handleTalentDescription} placeholder="More about talent.." required></textarea>
      			<div className="mt-5">
        			<button className="btn btn-info" onClick={this.singleFileUploadHandler}>Upload!</button>
       			</div>
      			</div>
     			</div>
        <div className="mt-5">
        <button className="btn btn-info"  onClick={event =>  window.location.href='/afterlogin-page'}>Home</button>
        </div>
			</div>
      
		);
	}
}

export default UploadImage;
