export type Jurisdiction = {
  id: number;
  name: string;
  loading: boolean;
  loaded: boolean;
  subjurisdictions: Jurisdiction[];
};

export type SelectedJurisdiction = {
  id: number;
  name: string;
};
