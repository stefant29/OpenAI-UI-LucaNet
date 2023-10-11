import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RfiRfpQuestion } from '../RfiRfpQuestion.model';

@Injectable({
  providedIn: 'root'
})
export class OpenAiServiceService {

  // TODO: Replace with our backend service that calls openAi API
  private apiUrl = 'http://localhost:3000/get-answer';

  constructor(private http: HttpClient) { }

  getData(model: RfiRfpQuestion): Observable<RfiRfpQuestion> {
    return this.http.post<RfiRfpQuestion>(this.apiUrl, model);
  }
}
