
import Milestone from './milestone';

export default interface CreateProject {
    projectpunchline: string;
    projectdescription: string;
    /* projectmarkdown: string; */
    projectdisplayimage: string;
    /* projectimages: string[]; */
    tags: string[];
    expiry: any;
}

export default interface Project {
    // created on start
    projectname: string;
    projectuid: string;
    creator: string; // public key
    createdat: any;
    deployed: boolean;

    // to set
    projectpunchline: string;
    projectdescription: string;
    /* projectmarkdown: string; */
    projectdisplayimage: string;
    /* projectimages: string[]; */
    tags: string[];
    expiry: any;

    // to set - used in contract deploy
    fundinggoal: number;
    milestones: Milestone[];

    // read
    backers: string[]; // public keys
}