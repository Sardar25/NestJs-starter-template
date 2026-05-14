import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";

export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(
            map((response)=>{
                return ({
                    success: true,
                    data: response?.data ?? null,
                    message: response?.message ?? 'Request Successful'
                })
            })
        )
    }
}