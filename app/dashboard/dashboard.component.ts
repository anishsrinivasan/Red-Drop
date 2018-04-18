import { FormControl } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Component, OnInit,ElementRef, NgZone, ViewChild } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AuthService } from '../core/auth.service';
import { Router } from '@angular/router';
import { DocumentRef } from '@agm/core/utils/browser-globals';
import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import {} from '@types/googlemaps';
let a;
declare var $: any;
let postId:any;
let postRef:any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  
     
  pos:any;
  lat: any;
  lng: any;
  bloodneedlistCol:any;
  bloodneedlist:any;
  patientname:any;
  patientbloodgroup:any;
  patientcontactnumber:any;
  patientlocation:any;


  constructor( private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private afs: AngularFirestore, private router: Router, public auth: AuthService,private afAuth: AngularFireAuth) 
  {

  this.getData()
  postRef = this.afs.collection('bloodneedlist');
   }
   
  ngOnInit() {

}


  getData(){
    this.bloodneedlistCol=  this.afs.collection('bloodneedlist')
    this.bloodneedlist = this.bloodneedlistCol.snapshotChanges()
    .map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() ;
        const id = a.payload.doc.id;
        return { id, data };
      });
    });
      console.log(this.bloodneedlist)
  }

  async postForDoners(){
    console.log("Adding Post")
  
    console.log(this.lat)
    this.afs.collection("bloodneedlist").add({"patientname":this.patientname,
  "patientbloodgroup":this.patientbloodgroup,"patientcontactnumber":this.patientcontactnumber,
"donorstatus":false,"patientposlat":this.lat,"patientposlong":this.lng}).then(function (docRef) {
  postId = docRef.id;
}).then(function () {
  if (postId) {
    postRef.doc(postId).update({ 'bloodpostid': postId });
    console.log("Post ID Updated");
  }
  else {
    alert("Not updated");
  }
})
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "https://api.msg91.com/api/sendhttp.php?sender=REDROP&route=4&mobiles=+919566141671&authkey=199568AG20REygDijF5a904415&country=91&message=HELPPP! "+this.patientname+" needs "+this.patientbloodgroup+" Immediately. So Please Contact this Number "+this.patientcontactnumber+" - Thank you!" ,
  "method": "GET",
  "headers": {}
}

$.ajax(settings).done(function (response) {
  console.log(response);
});
}

  gotDonor(docid){
    a = a+1;
    console.log(a)
    $("#totaldonationnum").html(a)
    console.log(docid)
    this.bloodneedlistCol.doc(docid).update({"donorstatus":true})
  }

  setToFalse(docid){
    this.bloodneedlistCol.doc(docid).update({"donorstatus":false})
  }

  delete(docid){
    this.bloodneedlistCol.doc(docid).delete();
  }

  getLocation(){
   var self = this
      // Try HTML5 geolocation.
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          self.lat = position.coords.latitude;
          self.lng = position.coords.longitude;
          console.log("Got Location")

  })
}
    }

}
