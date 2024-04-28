export default interface Project {
    projectname: string;
    projectuid: string;
    projectpunchline: string;
    projectdescription: string;
    projectmarkdown: string;
    projectdisplayimage: string;
    projectimages: string[];
    tags: string[];
    backers: string[]; // public keys
    creator: string; // public key
    createdat: any;
    deployed: boolean;
}