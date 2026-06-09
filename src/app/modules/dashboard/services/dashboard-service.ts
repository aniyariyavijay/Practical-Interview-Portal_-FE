import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivityItem, AiScoreDistribution, AssessmentStatusBreakdown, CandidatePipeline, DashboardData, DashboardStats, QuestionsByDifficulty, RecentSubmission } from '../interfaces/dashboard.interface';
import { Observable, forkJoin, map } from 'rxjs';
import { ApiResponse } from '../../../shared/interfaces/api-response.interface';
import { APIInterfaceService } from '../../../shared/services/api-interface.service';
import { API_ROUTES } from '../../../shared/common/api-routes';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
 
  constructor(private readonly api: APIInterfaceService) {}
 
  getStats(): Observable<ApiResponse<DashboardStats>> {
    return this.api.get<DashboardStats>(API_ROUTES.DASHBOARD.STATS);
  }
 
  getAssessmentStatusBreakdown(days = 30): Observable<ApiResponse<AssessmentStatusBreakdown[]>> {
    const params = new HttpParams().set('days', days);
    return this.api.get<AssessmentStatusBreakdown[]>(API_ROUTES.DASHBOARD.ASSESSMENT_STATUS, params);
  }
 
  getCandidatePipeline(): Observable<ApiResponse<CandidatePipeline>> {
    return this.api.get<CandidatePipeline>(API_ROUTES.DASHBOARD.CANDIDATE_PIPELINE);
  }
 
  getRecentSubmissions(limit = 5): Observable<ApiResponse<RecentSubmission[]>> {
    const params = new HttpParams().set('limit', limit);
    return this.api.get<RecentSubmission[]>(API_ROUTES.DASHBOARD.RECENT_SUBMISSIONS, params);
  }
 
  getQuestionsByDifficulty(): Observable<ApiResponse<QuestionsByDifficulty[]>> {
    return this.api.get<QuestionsByDifficulty[]>(API_ROUTES.DASHBOARD.QUESTIONS_BY_DIFF);
  }
 
  getAiScoreDistribution(): Observable<ApiResponse<AiScoreDistribution[]>> {
    return this.api.get<AiScoreDistribution[]>(API_ROUTES.DASHBOARD.AI_SCORE_DIST);
  }
 
  getRecentActivity(limit = 5): Observable<ApiResponse<ActivityItem[]>> {
    const params = new HttpParams().set('limit', limit);
    return this.api.get<ActivityItem[]>(API_ROUTES.DASHBOARD.RECENT_ACTIVITY, params);
  }
 
  loadAll(): Observable<DashboardData> {    
    return forkJoin({
      stats:                     this.getStats().pipe(map((r) => r.result!)),
      assessmentStatusBreakdown: this.getAssessmentStatusBreakdown().pipe(map((r) => r.result!)),
      candidatePipeline:         this.getCandidatePipeline().pipe(map((r) => r.result!)),
      recentSubmissions:         this.getRecentSubmissions().pipe(map((r) => r.result!)),
      questionsByDifficulty:     this.getQuestionsByDifficulty().pipe(map((r) => r.result!)),
      aiScoreDistribution:       this.getAiScoreDistribution().pipe(map((r) => r.result!)),
      recentActivity:            this.getRecentActivity().pipe(map((r) => r.result!)),
    });
  }
}
