import { Component, OnInit } from '@angular/core'; 
import { WheelSelector } from '@ionic-native/wheel-selector/ngx';
import { NavController } from '@ionic/angular';
import { AminoAcid } from '../amino-acid';
import { AminoAcidService } from '../amino-acid.service';
import { ProtectionGroup } from '../protection-group';
import { ProtectionService } from '../protection.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  public protGrps = [];
  public aminoAcids = []
  public protOne = [];
  public peptide = [];
  public protTwo = [];
  public posTrips = []; //[[peptide,protone,prottwo]]
  public massCalc = 0;
  public ticPos = [];
  public ticNeg = [];
 
  constructor(public navCtrl:NavController,
    private svcAA:AminoAcidService,
    private svcPG:ProtectionService,
    private selector:WheelSelector
    ) {}

  /**The first code to be run on initialising */
  ngOnInit(): void {
    this.populateAminoAcids();
    this.populateProtectionGroups();
  }

  /**populates the available amino-acids from assets folder json via service */
  public populateAminoAcids() {
    this.svcAA.getAllAminoAcids().subscribe((res) => this.aminoAcids = res);
  }

  /**populates the available protective-groups from assets folder json via service */
  public populateProtectionGroups() {
    this.svcPG.getAllProtectionGroups().subscribe((res) => this.protGrps = res);
  }

  /**Removes the specified residue and updates the calculated mass */
  public removeResidue(i) {
    this.protOne.splice(i,1);
    this.peptide.splice(i,1);
    this.protTwo.splice(i,1);
    this.posTrips.splice(i,1);
    this.calculateMass();
  }

  /**Opens the peptide builder at the position chosen in app for editing */
  public openPickerAtIndex(i){
    let args = this.posTrips[i];
    this.selector.show({
      title:'Peptide-Builder',
      positiveButtonText:'Select',
      negativeButtonText:'Cancel',
      items:[
        this.protGrps,
        this.aminoAcids,
        this.protGrps
      ],
      defaultItems: [
        {index:0, value:this.protGrps[args[1]].description},
        {index:1, value:this.aminoAcids[args[0]].description},
        {index:2, value:this.protGrps[args[2]].description}
      ]
    }).then((result) => {
      for(let a of this.aminoAcids){
        if(a.description === result[1].description) {
          let residue = new AminoAcid(a.name,a.triple,a.single,a.mass,a.description);
          this.peptide[i] = residue;
          this.posTrips[i][0] = result[1].index;
        }
      }
      for (let p of this.protGrps){
        if(p.description === result[0].description) {
          let protective = new ProtectionGroup(p.name,p.mass,p.description);
          this.protOne[i] = protective;
          this.posTrips[i][1] = result[0].index;
        }
      }
      for (let p of this.protGrps){
        if(p.description === result[2].description) {
          let protective = new ProtectionGroup(p.name,p.mass,p.description);
          this.protTwo[i] = protective;
          this.posTrips[i][2] = result[2].index;
        }
      }
      this.calculateMass();
    });
  }

  /**opens the picker when adding a new residue to the growing peptide */
  public openPicker(){
    this.selector.show({
      title:'Peptide-Builder',
      positiveButtonText:'Select',
      negativeButtonText:'Cancel',
      items:[
        this.protGrps,
        this.aminoAcids,
        this.protGrps
      ],
      defaultItems: [
        {index:0, value:this.protGrps[0].description},
        {index:1, value:this.aminoAcids[0].description},
        {index:2, value:this.protGrps[0].description}
      ]
    }).then((result) => {
      let coords = [];
      for(let a of this.aminoAcids){
        if(a.description === result[1].description) {
          let residue = new AminoAcid(a.name,a.triple,a.single,a.mass,a.description);
          this.peptide.push(residue);
          coords.push(result[1].index);
        }
      }
      for (let p of this.protGrps){
        if(p.description === result[0].description) {
          let protective = new ProtectionGroup(p.name,p.mass,p.description);
          this.protOne.push(protective);
          coords.push(result[0].index);
        }
      }
      for (let p of this.protGrps){
        if(p.description === result[2].description) {
          let protective = new ProtectionGroup(p.name,p.mass,p.description);
          this.protTwo.push(protective);
          coords.push(result[2].index);
        }
      }
      this.posTrips.push(coords);
      this.calculateMass();
    });
  }

  /**Calculates the mass based resdiues and protective groups present in the peptide */
  private calculateMass() {
    let localMass:number = 0;
    let waterWeight = (this.peptide.length - 1) * 18;
    for(let i = 0 ; i < this.peptide.length ; i++) {
      localMass += parseInt(this.peptide[i].mass);
      localMass += parseInt(this.protOne[i].mass);
      localMass += parseInt(this.protTwo[i].mass);
    }
    this.massCalc = localMass - waterWeight;
    if(this.peptide.length === 0) {
      this.massCalc = 0;
    }
    if(this.peptide.length === 0) {
      this.ticNeg = [0];
      this.ticPos = [0]
    } else {
      this.ticPos = [this.massCalc + 1, Math.round((this.massCalc + 2)/2), Math.round((this.massCalc + 3)/3)];//TODO
      this.ticNeg = [this.massCalc - 1, Math.round(2*(this.massCalc-1)), (this.massCalc-1) + 114];//TODO
    }
  }
}
