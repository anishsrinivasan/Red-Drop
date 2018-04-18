import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AuthService } from '../core/auth.service';
import { Router } from '@angular/router';
import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import {MatSnackBar} from '@angular/material';
declare var $:any;
let userID:any;
@Component({
  selector: 'app-userdashboard',
  templateUrl: './userdashboard.component.html',
  styleUrls: ['./userdashboard.component.css']
})
export class UserdashboardComponent implements OnInit {
userdata:any;
name:any;
bloodgroup:any;
email:any;
userposlat:any;
userposlng:any;
userid:any;
bloodneedlistCol:any;
totaldonations:any;
bloodneedlistarray = []
userCol:any;
user:any;
lat:any;
lng:any;
locationproximity = 3;
  constructor(public snackBar: MatSnackBar,private afs: AngularFirestore, private router: Router, public auth: AuthService,private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userdata = this.afs.doc(`users/${user.uid}`).ref.get().then(doc => {
          this.name = doc.data().name;
          this.email = doc.data().email;
          this.bloodgroup = doc.data().bloodgroup;
          this.userposlat = doc.data().poslat;
          this.userposlng = doc.data().poslng;
          this.totaldonations = doc.data().totaldonations;
          this.userid = doc.data().uid;
          userID = doc.data().uid;
        }).then(check => {
          this.getRecords()
        })
   }})
  }

  ngOnInit() {
    this.bloodneedlistCol=  this.afs.collection('bloodneedlist')
    
    
  }
  userLogout(){
    this.auth.signOut();
  }

  gotDonor(docid){
    $("#donorbtn").css("background-color", "green")
    console.log(docid)
    let snackBarRef =  this.snackBar.open('Thank you for Saving a Life! <3','^_^', {
      duration: 3000
    });
    this.bloodneedlistCol.doc(docid).update({"donorstatus":true})
 this.afs.collection("users").doc(this.userid).ref.get().then(doc => {
      console.log(doc.data().totaldonations)
      var totaldonations = doc.data().totaldonations + 1;
      this.afs.collection("users").doc(this.userid).update({"totaldonations":totaldonations})
    })
    this.getRecords()
  }
  getRecords(){
    this.bloodneedlistarray = [];
    var self = this;
    this.bloodneedlistCol.ref
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            if(this.distanceCalculate(self.userposlat,self.userposlng,doc.data().patientposlat,doc.data().patientposlong)
           < this.locationproximity){
             console.log("Current Location Proximity",this.locationproximity);
             this.bloodneedlistarray.push(doc.data());
             console.log("Yes, It's nearby");
           }else{
             console.log("Too Far Away")
           }

          });
  }).then(check => {
    
  })
  console.log(this.bloodneedlistarray)
}
getLocation(){
  var self = this
     // Try HTML5 geolocation.
     if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(function(position) {
         self.lat = position.coords.latitude;
         self.lng = position.coords.longitude;
         console.log("Got Location")
         self.afs.collection("users").doc(self.userid).update({"poslat":self.lat,"poslng":self.lng})
        alert("Updated Current Location")
        
 })
 this.getRecords();
}
   }

  distanceCalculate(userposlat,userposlng,dbposlat,dbposlng){
    console.log(userposlat,userposlng,dbposlat,dbposlng);
    console.log("Calculating..")
    var rad = function(x) {
      return x * Math.PI / 180;
    };
    var p1 = {
      lng:userposlng,
      lat:userposlat
    }
    var p2 = {
      lng:dbposlng,
      lat:dbposlat
    }
    console.log(p1)
    console.log(p2)
  
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((p2.lat - p1.lat) * p)/2 + 
            c(p1.lat * p) * c(p2.lat * p) * 
            (1 - c((p2.lng - p1.lng) * p))/2;
  
    var d=  12742 * Math.asin(Math.sqrt(a)); // 2
      console.log(d)
      return d;
      
    };
  

    }
