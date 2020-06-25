export class StudyInfo {
  studyName: string;
  description: string;
  nameOfPI: string;
  site: string;
  eligibilityRequirements: string;
  moreInfo: string;
  colValues: string[];

  public constructor(studyName, description, nameOfPI, site, eligibilityRequirements, moreInfo) {
    this.studyName = studyName;
    this.description = description;
    this.nameOfPI = nameOfPI;
    this.site = site;
    this.eligibilityRequirements = eligibilityRequirements;
    this.moreInfo = moreInfo;
    this.colValues = [studyName, description, nameOfPI, site, eligibilityRequirements, moreInfo];
  }
}
