export type TomTomPlace = {
  id: string;
  label: string;
  alamat: string;
  kota: string;
  lat: number;
  lng: number;
};

export type TomTomPlaceSearchResponse = {
  data: TomTomPlace[];
  message?: string;
};
