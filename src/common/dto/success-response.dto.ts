export class SuccessResponse {
    static withData<T>(data:T, message?:string){
        return ({
            data,
            message
        })
    }

    static withMessage(message:string) {
        return ({
            message
        })
    }
}