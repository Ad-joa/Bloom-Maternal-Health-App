export interface UserContext {
    trimester?: number | null;
    medical_conditions?: string | null;
    age?: number | null;
}
export interface AdvisoryResult {
    text: string;
    severity: 'danger' | 'normal' | 'unknown';
}
export declare function evaluateSymptoms(symptoms: string[], userContext?: UserContext | null): AdvisoryResult;
export declare const evaluateRules: (logData: any, rules: any[]) => any[];
//# sourceMappingURL=symptomService.d.ts.map