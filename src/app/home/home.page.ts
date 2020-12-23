import { Component, OnInit } from '@angular/core';
import { WheelSelector } from '@ionic-native/wheel-selector/ngx';
import { NavController, ToastController } from '@ionic/angular';
import { AminoAcidService } from '../amino-acid.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  public aminoAcids = []

  constructor(public navCtrl:NavController, private svc:AminoAcidService, private selector:WheelSelector, public toastCtrl:ToastController) {}

  ngOnInit(): void {
    this.populateAminoAcids();
  }

  public populateAminoAcids() {
    this.svc.getAllAminoAcids().subscribe(res => this.aminoAcids = res);
  }

  public openPicker(){
    this.selector.show({
      title:'Select Amino',
      positiveButtonText:'Choose amino',
      negativeButtonText:'nah',
      items:[
        this.aminoAcids
      ],
      defaultItems: [
        {index:0, value:this.aminoAcids[0].triple}
      ]
    }).then(result => {
      let msg = `Selected ${result[0].triple}`;
      let toast = this.toastCtrl.create({
        message:msg,
        duration:4000
      });
    });
  }
}
