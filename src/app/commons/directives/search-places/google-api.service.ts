import { Injectable } from '@angular/core';
import { PredictionModel } from './models/prediction.model';


declare const google: any;

@Injectable()
export class GoogleAPIService {

  private autocompleteService: any;
  private geocoder: any;

  constructor() {
    this.autocompleteService = new google.maps.places.AutocompleteService();
    this.geocoder = new google.maps.Geocoder();
  }

  getGooglePredictions(input: string): Promise<PredictionModel[]> {
    let request = {
      input,
      types: ['address'],
      componentRestrictions: {
        country: 'ar',
      } as GoogleRestrictions,
    } as GoogleRequest;

    return new Promise((resolve) => {
      this.autocompleteService.getPlacePredictions(request, (predictions: any, status: any) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
          return;
        }

        const collection = new Array<PredictionModel>();
        for (const prediction of predictions) {
          const address = new PredictionModel();
          address.id = prediction.place_id;
          address.text = prediction.description;
          address.mainText = prediction.structured_formatting.main_text;
          address.secondaryText = prediction.structured_formatting.secondary_text;

          const [country, province, city] = prediction.structured_formatting.secondary_text.split(',').reverse();
          address.country = country.trim();
          address.province = province.trim();
          address.city = (city) ? city.trim() : province.trim();

          collection.push(address);
        }
        resolve(collection);
      });
    });
  }

  getGeocodePlace(address: PredictionModel): Promise<PredictionModel> {
    const request = {
      placeId: address.id,
    };

    return new Promise((resolve) => {
      this.geocoder.geocode(request, (results: any, status: any) => {
        if (status !== google.maps.GeocoderStatus.OK) {
          return;
        }

        address.latitude = results[0].geometry.location.lat();
        address.longitude = results[0].geometry.location.lng();
        resolve(address);
      });
    });
  }

}

interface GoogleRequest {
  input: string;
  componentRestrictions?: GoogleRestrictions;
  types: string[];
}

interface GoogleRestrictions {
  country: string;
}
