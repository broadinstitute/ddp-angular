import { SearchParticipant } from './searchParticipant';

export interface SearchParticipantResponse {
    totalCount: number;
    results: SearchParticipant[];
}
