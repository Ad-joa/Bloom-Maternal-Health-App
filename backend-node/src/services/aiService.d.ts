import { GoogleGenAI } from '@google/genai';
export declare const ai: GoogleGenAI;
export declare const getAdvisoryResponse: (user_id: number | null, symptoms: string[]) => Promise<string>;
export declare const getPartnerSummary: (user_id: number) => Promise<any>;
//# sourceMappingURL=aiService.d.ts.map