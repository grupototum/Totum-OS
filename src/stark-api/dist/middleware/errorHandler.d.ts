import { Request, Response, NextFunction } from 'express';
export interface HttpError extends Error {
    statusCode?: number;
}
export declare const errorHandler: (err: HttpError, _req: Request, res: Response, _next: NextFunction) => void;
export declare const notFoundHandler: (req: Request, res: Response, _next: NextFunction) => void;
//# sourceMappingURL=errorHandler.d.ts.map