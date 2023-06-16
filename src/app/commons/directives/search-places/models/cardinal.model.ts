

export class CardinalModel {
  public lat: number;
  public lng: number;

  constructor(latitude?: number, longitude?: number) {
    this.lat = (latitude) ? latitude : 0;
    this.lng = (longitude) ? longitude : 0;
  }
}
