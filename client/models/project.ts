interface Project {
    projectname: string;
    projectpunchline: string;
    projectdescription: string;
    projectmarkdown: string;
    projectimages: string[];
    tags: string[];
    backers: string[]; // public keys
    creator: string; // public key
}