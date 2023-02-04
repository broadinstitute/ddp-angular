interface FamilyMember {
    nickname:string;
    sexAtBirth:string;   
    currentlyLiving:boolean;
    ageRange:string;
    cancers: CancerSelection[];
    ancestry: string[];
    sideOfFamily?:string;
}