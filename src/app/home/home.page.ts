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

  public pos = 0;

  public peptide = [];

  public chosen;

  constructor(public navCtrl:NavController,
    private svc:AminoAcidService,
    private selector:WheelSelector,
    public toastCtrl:ToastController
    ) {}

  ngOnInit(): void {
    this.populateAminoAcids();
  }

  public populateAminoAcids() {
    this.svc.getAllAminoAcids().subscribe((res) => this.aminoAcids = res);
  }

  public openPicker(){
    this.selector.show({
      title:'Amino Acid Picker',
      positiveButtonText:'Select',
      negativeButtonText:'Cancel',
      items:[
        this.aminoAcids
      ],
      defaultItems: [
        {index:0, value:this.aminoAcids[0].description}
      ]
    }).then((result) => {
      this.chosen = result.data;
      this.peptide.push(this.chosen);
    });
  }
}
