export interface Project{
  id: string;
  key: string;
  description: string;
  issueType: string;
  labels: string[];
  originalEstimatedDays: string;
  originalEstimatedSec: number;
  dueDate: string;
  //Id, key, description, issueType, labels, description, timetracking, timeoriginalestimate, duedate
}
