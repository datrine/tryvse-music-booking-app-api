export interface CreateEventListingEntryInput {
  title: string;
  artist_id: number
  description: string;
  venue: string;
  city: string;
  date_and_time: Date;
}


export interface GetMultipleEventListingEntryFiltersInput {
  title?: string;
  artist_id?: number;
  description?: string;
  venue?: string
  city?: string;
  date_and_time?: Date;
}

export interface UpdateEventListingEntryInput {
  title?: string;
  description?: string;
  venue?: string
  city?: string;
  date_and_time?: Date;
}