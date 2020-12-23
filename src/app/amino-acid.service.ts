import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AminoAcid } from './amino-acid';

@Injectable({
  providedIn: 'root'
})
export class AminoAcidService {

  private url:string = '../assets/jsonFiles/amino-acids.json';
  public aminoAcids:AminoAcid[] = [];

  constructor(public http:HttpClient) { }

  getAllAminoAcids():Observable<AminoAcid[]>{
    return this.http.get<AminoAcid[]>(this.url);
  }
}
