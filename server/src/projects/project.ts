export interface Milestone {
    milestonename: string;
    milestonedescription: string;
/*     milestonenumber: number; */
}

export interface CreateProject {
    projectpunchline: string;
    projectdescription: string;
    /* projectmarkdown: string; */
    projectdisplayimage: string;
    /* projectimages: string[]; */
    tags: string[];
    expiry: any;
    fundinggoal: number;
    milestones: Milestone[];
}

export default interface CreateProjectSuperset extends CreateProject {
    projectuid: string;
}