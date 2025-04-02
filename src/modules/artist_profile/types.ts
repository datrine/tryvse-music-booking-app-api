export interface CreateArtistProfileInput{
    email:string;
    password:string;
    stage_name:string;
    first_name:string;
    last_name:string
}


export interface GetMultipleArtistProfileFiltersInput{
    stage_name?:string;
    first_name?:string;
    last_name?:string
}

export interface UpdateArtistProfileInput{
    email?:string;
    password?:string;
    stage_name?:string;
    first_name?:string;
    last_name?:string
}