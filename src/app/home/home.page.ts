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
  public massCalc = 0;
 
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
    this.calculateMass();
  }

  /**Opens the peptide builder at the position chosen in app for editing */
  public openPickerAtIndex(i){
    let indexChosen:number = i;
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
        {index:0, value:this.protGrps[indexChosen].description},
        {index:1, value:this.aminoAcids[indexChosen].description},
        {index:2, value:this.protGrps[indexChosen].description}
      ]
    }).then((result) => {
      for(let a of this.aminoAcids){
        if(a.description === result[1].description) {
          let residue = new AminoAcid(a.name,a.triple,a.single,a.mass,a.description);
          this.peptide[indexChosen] = residue;
        }
      }
      for (let p of this.protGrps){
        if(p.description === result[0].description) {
          let protective = new ProtectionGroup(p.name,p.mass,p.description);
          this.protOne[indexChosen] = protective;
        }
      }
      for (let p of this.protGrps){
        if(p.description === result[2].description) {
          let protective = new ProtectionGroup(p.name,p.mass,p.description);
          this.protTwo[indexChosen] = protective;
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
      for(let a of this.aminoAcids){
        if(a.description === result[1].description) {
          let residue = new AminoAcid(a.name,a.triple,a.single,a.mass,a.description);
          this.peptide.push(residue);
        }
      }
      for (let p of this.protGrps){
        if(p.description === result[0].description) {
          let protective = new ProtectionGroup(p.name,p.mass,p.description);
          this.protOne.push(protective);
        }
      }
      for (let p of this.protGrps){
        if(p.description === result[2].description) {
          let protective = new ProtectionGroup(p.name,p.mass,p.description);
          this.protTwo.push(protective);
        }
      }
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
  }
}
