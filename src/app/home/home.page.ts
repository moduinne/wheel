import { Component, OnInit } from '@angular/core'; 
import { WheelSelector } from '@ionic-native/wheel-selector/ngx';
import { NavController, ToastController } from '@ionic/angular';
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

  //  public testOut:string = "placeholder";
  //  public aminoOne = new AminoAcid("test","Tes","Z",3,"Tes");
  //  public testProtOne = new ProtectionGroup("tpgone",1,"tpgone");
  //  public testProtTwo = new ProtectionGroup("tpgtwo",2,"tpgtwo");

  //  public aminoTwo = new AminoAcid("AAA","AAA","A",3434,"AAA");
  //  public testProtThree = new ProtectionGroup("tpgthrees",13434,"tpgthrees");
  //  public testProtFour = new ProtectionGroup("tpgFours",3434,"tpgFours");

  //  public protOne = [this.testProtOne,this.testProtThree];
  //  public peptide = [this.aminoOne,this.aminoTwo];
  //  public protTwo = [this.testProtTwo,this.testProtFour];
    
  public protGrps = [];
  public aminoAcids = []

  public protOne = [];
  public peptide = [];
  public protTwo = [];

  public massCalc:number = 0;
 

  constructor(public navCtrl:NavController,
    private svc:AminoAcidService,
    private svcPG:ProtectionService,
    private selector:WheelSelector,
    public toastCtrl:ToastController
    ) {}

  ngOnInit(): void {
    this.populateAminoAcids();
    this.populateProtectionGroups();
    this.calculateMass();
  }

  public populateAminoAcids() {
    this.svc.getAllAminoAcids().subscribe((res) => this.aminoAcids = res);
  }

  public populateProtectionGroups() {
    this.svcPG.getAllProtectionGroups().subscribe((res) => this.protGrps = res);
  }

  public removeResidue(i) {
    this.protOne.splice(i,1);
    this.peptide.splice(i,1);
    this.protTwo.splice(i,1);
    this.calculateMass();
  }

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

  public calculateMass() {
    let localMass:number = 0;
    let waterWeight = (this.peptide.length - 1) * 18;
    for(let i = 0 ; i < this.peptide.length ; i++) {
      localMass += parseInt(this.peptide[i].mass);
      localMass += parseInt(this.protOne[i].mass);
      localMass += parseInt(this.protTwo[i].mass);
      // localMass += this.peptide[i].mass;
      // localMass +=this.protOne[i].mass;
      // localMass += this.protTwo[i].mass;
    }
    this.massCalc = localMass - waterWeight;
  }
}
