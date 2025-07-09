import 'express';

declare global {
    namespace Express {
        export interface Response {
            success(success: any): this;
            error(error: {
                errorCode?: string,
                reason?: string | null,
                data?: any | null
            }): this;
        }
    }
}