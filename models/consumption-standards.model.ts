import { RestResponse } from '@shared/interfaces/rest-response.interface';

export interface ConsumptionStandardsApi extends RestResponse {
     id: string;
     name: string;
     consumpion_standard: string;
     // data: ConsumptionStandard[];
}

export interface ConsumptionStandard {
     id: string;
     name: string;
     consumpion_standard: string;
}
