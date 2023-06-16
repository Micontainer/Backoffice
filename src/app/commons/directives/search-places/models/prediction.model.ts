import { CardinalModel } from './cardinal.model';


export class PredictionModel {
  id: string;
  text: string;
  latitude: string;
  longitude: string;
  mainText: string;
  secondaryText: string;
  city: string;
  province: string;
  country: string;

  constructor(id: string = '', text: string = '') {
    this.id = id;
    this.text = text;
    this.latitude = '';
    this.longitude = '';
    this.mainText = '';
    this.secondaryText = '';
    this.city = '';
    this.province = '';
    this.country = '';
  }

  public get latitudeAndLongitude(): CardinalModel {
    return new CardinalModel(+this.latitude, +this.longitude);
  }

  public setCoords(latitude: string, longitude: string): void {
    this.latitude = latitude;
    this.longitude = longitude;
  }

}
