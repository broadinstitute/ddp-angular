interface CancerSelection {
    cancerSearch: string;
    expectedCancerResult:string;
    time: string; // could be age at diagnosis, year of diagnosis, etc.
    numTimesToHitDownArrow:number; // how many times to press the down key to get from search hit to the result
  }