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
    public amino_keys = [
      {
          description: "Ala"
      },
      {
          description: "Arg"
      },
      {
          description: "Asn"
      },
      {
          description: "Asp"
      },
      {
          description: "Cys"
      },
      {
          description: "Gln"
      },
      {
          description: "Glu"
      },
      {
          description: "Gly"
      },
      {
          description: "His"
      },
      {
          description: "Ile"
      },
      {
          description: "Leu"
      },
      {
          description: "Lys"
      },
      {
          description: "Met"
      },
      {
          description: "Phe"
      },
      {
          description: "Pro"
      },
      {
          description: "Ser"
      },
      {
          description: "Thr"
      },
      {
          description: "Trp"
      },
      {
          description: "Tyr"
      },
      {
          description: "Val"
      }
  ]

  public aminoAcids = []

  constructor(public navCtrl:NavController, private svc:AminoAcidService, private selector:WheelSelector, public toastCtrl:ToastController) {}

  ngOnInit(): void {
    this.populateAminoAcids();
  }

  public populateAminoAcids() {
    this.svc.getAllAminoAcids().subscribe((res) => this.aminoAcids = res);
  }

  public openPicker(){
    this.selector.show({
      title:'bitch Amino',
      positiveButtonText:'rape amino',
      negativeButtonText:'nah',
      items:[
        this.amino_keys
      ],
      defaultItems: [
        {index:0, value:this.amino_keys[0].description}
      ]
    });
  }
}
