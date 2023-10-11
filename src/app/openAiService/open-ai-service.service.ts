import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RfiRfpQuestion } from '../RfiRfpQuestion.model';

@Injectable({
  providedIn: 'root'
})
export class OpenAiServiceService {

  // TODO: Replace with our backend service that calls openAi API
  private apiUrl = 'https://api.example.com/endpoint';

  constructor(private http: HttpClient) { }

  getData(model: RfiRfpQuestion): Observable<RfiRfpQuestion> {

    // TODO: send the model to the api

    return this.http.get<RfiRfpQuestion>(this.apiUrl);
  }
}
