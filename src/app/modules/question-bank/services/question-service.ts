import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../shared/interfaces/api-response.interface';
import { Category, Question } from '../interfaces/question.interfase';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private readonly apiUrl = 'http://localhost:8080/questions';

  constructor(private readonly http: HttpClient) { }

  getQuestions() : Observable<ApiResponse<Question[]>> {
    return this.http.get<ApiResponse<Question[]>>(this.apiUrl);
  }

  getQuestionbyId(id : number) :  Observable<ApiResponse<Question>>  {
    return this.http.get<ApiResponse<Question>>(`${this.apiUrl}/${id}`);
  }

  createQuestion(payload: any) :  Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      this.apiUrl,
      payload
    );
  }

  updateQuestion (
    id: number,
    payload: any
  )  :  Observable<ApiResponse<string>>  {
    return this.http.put<ApiResponse<string>>(
      `${this.apiUrl}/${id}`,
      payload
    );
  }

  deleteQuestion(id: number):  Observable<ApiResponse<string>>  {
    return this.http.delete<ApiResponse<string>>(`${this.apiUrl}/${id}`);
  }

  getCategories():  Observable<ApiResponse<Category[]>>  {
    return this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/category`);
  }

}
