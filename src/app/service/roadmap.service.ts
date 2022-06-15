import { Injectable } from '@angular/core';
// @ts-ignore
import  ProjectData from './../../assets/Frontend_project_sample_data.json';
import {Project} from "../data-model/project";
import {HttpClient} from "@angular/common/http";
import {catchError, Observable,} from "rxjs";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class RoadmapService {

  constructor(private http: HttpClient) { }

  getAllIssues(): Observable<any> {
    return this.http.get('/rest/api/2/search').pipe(
      map((res: any) =>{
        return res?.issues?.length ? res : ProjectData;
      }),
    catchError(() => ProjectData));
  }

  getFormattedIssues(projects:any): Project[] {
    if(!projects?.issues?.length) return [];
    return projects.issues.map((issue: any) => {
      return {
        id: issue?.id,
        key: issue?.key,
        issueType: issue?.fields?.issuetype?.name,
        description: issue?.fields?.issuetype?.description,
        labels: issue?.fields?.labels,
        dueDate: issue?.fields?.duedate,
        originalEstimatedDays: issue?.renderedFields?.timetracking?.originalEstimate,
        originalEstimatedSec: issue?.fields?.timetracking?.originalEstimateSeconds
      };
    })
  }

  getDistinctLabels(projects: any): Set<string> | any {
    if(!projects?.issues?.length) return null;
    let labels = projects.issues.map((issue: any) => [...issue?.fields?.labels]).flat();
    // @ts-ignore
    return labels.filter((val, idx, self) => self.indexOf(val) === idx);
  }
}
