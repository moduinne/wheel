import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProtectionGroup } from './protection-group';

@Injectable({
  providedIn: 'root'
})
export class ProtectionService {
  private url:string = '../assets/jsonFiles/protect-groups.json';
  public proGrps:ProtectionGroup[] = [];

  constructor(public http:HttpClient) { }

  getAllProtectionGroups():Observable<ProtectionGroup[]> {
    return this.http.get<ProtectionGroup[]>(this.url);
  }
}
