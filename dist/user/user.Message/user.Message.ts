export interface successMessage {
    statusCode : number;
    customCode : String;
    user_id? : number;
    instagram_id? : String;
    message : String;
};

export interface errorMessage {
    statusCode : number;
    customCode : String;
    message : String;
};


export const userError : Record<string, errorMessage> = {
    serverError : { statusCode : 500, customCode : "EC500", message : "서버 에러입니다." },
    notSignUp : { statusCode : 400, customCode : "EC400", message : "회원 정보를 입력하지 않은 유저입니다." },
    unAuthorized : { statusCode : 401, customCode : "EC401", message : "인증 오류, 토큰이 존재하지 않습니다." },
    forbidden : { statusCode : 403, customCode : "EC403", message : "만료된 토큰입니다." },
    missingField : { statusCode : 400, customCode : "EC404", message : "누락값이 존재합니다." },
};

export const userSuccess : Record<string, successMessage> = {

};