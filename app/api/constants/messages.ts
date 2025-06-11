export const MESSAGES = {
    SAVE_SUCCESS: 'Saved Successfully',
    SAVE_FAILURE: 'Failled To Save',
    DATA_LIST_SUCCESS: 'Data Fetched Successfully',
    DATA_LIST_FAILURE: 'No Record Found',
    MISSING_DATA: 'Missing In Request',
    DELETE_SUCCESS: 'Deleted Successfully',
    DELETE_FAILURE: 'Deleted Failled',
    USER_ALREADY_EXIST: 'User already exists with this email',
    USER_NOT_REGISTERED: 'User not registered',
    INVALID_PASSWORD: 'Invalid Password',
    LOGIN_SUCCESS: 'User loggedin successfully',
    NOT_AUTHORIZED: 'You are not authorized to access this API',
    INVALID_TOKEN: 'Invalid token',
    TOKEN_EXPIRED: 'Token expired'
}

export const getSuccessMessage = (preText: string, postText?: string) => {
    return [preText, MESSAGES.SAVE_SUCCESS, postText].filter(Boolean).join(' ')
}
export const getErrorMessage = (preText: string, postText?: string) => {
    return [preText, MESSAGES.SAVE_FAILURE, postText].filter(Boolean).join(' ')
}
export const missingDataMessage = (text: string) => {
    return [text, MESSAGES.MISSING_DATA].filter(Boolean).join(' ')
}

export interface IResponse {
  success: boolean;
  message: string;
  data: any;
  statusCode: number;
}

export enum HttpStatus {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    INTERNAL_SERVER_ERROR = 500
}