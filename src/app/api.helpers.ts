import { HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

export function createApiHeaders(): HttpHeaders {
  return new HttpHeaders({
    'X-Api-Key': environment.apiKey || '',
  });
}
