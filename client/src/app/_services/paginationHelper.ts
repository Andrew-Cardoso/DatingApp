import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_models/userParams';

export const getFilterHeaders = (params: HttpParams, { minAge, maxAge, gender, orderBy }: UserParams) => {
	if (minAge) params = params.append('minAge', `${minAge}`);
	if (maxAge) params = params.append('maxAge', `${maxAge}`);
	if (gender) params = params.append('gender', gender);
	if (orderBy) params = params.append('orderBy', orderBy);
	return params;
};
export const getPaginationHeaders = ({ pageNumber, pageSize }: Partial<UserParams>) => {
	let params = new HttpParams();
	if (pageNumber && pageSize) {
		params = params.append('pageNumber', `${pageNumber}`);
		params = params.append('pageSize', `${pageSize}`);
	}
	return params;
};
export const getPaginatedResult = <T>(url: string, params: HttpParams, http: HttpClient) => {
	const paginatedResult = new PaginatedResult<T>();
	return http
		.get<T[]>(url, { observe: 'response', params })
		.pipe(
			map((response) => {
				paginatedResult.result = response.body;
				const pagination = response.headers.get('Pagination');
				if (pagination) paginatedResult.pagination = JSON.parse(pagination);
				return paginatedResult;
			})
		);
};
