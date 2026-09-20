import { Request, Response } from 'express';
export declare const getUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const onboardUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getUserInsights: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const fetchPartnerSummary: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=userController.d.ts.map