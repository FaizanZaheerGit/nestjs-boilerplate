
const responses = {
    // RETURN RESPONSE FUNCTION
    get_response_object: (statusCode: Number, data: any, message: string | null) : Object => {
        /*
            This function covnerts statusCode, data and message into a JSON and returns the JSON Objects
            parameters:  statusCode, data, mesage
        */
        const response: { statusCode: Number, data?: Object | string | null, message?: string | null } = {statusCode: statusCode};
        if (data) {
            response["data"] = data;
        }
        if (message) {
            response["message"] = message;
        }
        return response;
    },

    // CODES
    CODE_SUCCESS: 200,
    CODE_CREATED: 201,
    CODE_UNAUTHORIZED_ACCESS: 401,
    CODE_NOT_FOUND: 404,
    CODE_UNPROCESSABLE_ENTITY: 422,
    CODE_GENERAL_ERROR: 452,
    CODE_MISSING_PARAMETERS: 4001,
    CODE_ALREADY_EXISTS: 4002,
    CODE_VALIDATION_FAILED: 4003,
    CODE_INVALID_CALL: 4004,
    CODE_INVALID_DATA: 4005,
    CODE_INVALID_OTP: 4006,

    // MESSAGES
    MESSAGE_SUCCESS: "SUCCESS",
    MESSAGE_UNAUTHORIZED_ACCESS: "Unauthorized Access",
    MESSAGE_INVALID_EMAIL_ADDRESS_OR_PASSWORD: "Invalid email address or password",
    MESSAGE_GENERAL_ERROR: "Something Went Wrong",
    MESSAGE_SERVER_ERROR: "Internal Server Error",
    MESSAGE_VALIDATION_FAILED: "Validation failed ",
    MESSAGE_INVALID_CALL: "Invalid Call",
    MESSAGE_INVALID_TOKEN: "Invalid Token",
    MESSAGE_OTP_EXPIRED: "OTP has expired",
    MESSAGE_SAME_PASSWORD: "You are using an older password",
    MESSAGE_PASSWORD_UPDATED_SUCCESSFULLY: "Password has been updated successfully",
    MESSAGE_INVITE_LINK_EXPIRED: "",
    MESSAGE_OTP_SENT_SUCCESSFULLY: "OTP Sent Successfully",
    MESSAGE_MAIL_SENT_SUCCESSFULLY: (param: string) => `${param} mail has been sent successfully`,
    MESSAGE_CREATED: (collection_name: string) => { return `${collection_name} created successfully` },
    MESSAGE_NOT_FOUND: (params: Array<string>) => { return `${params[0]} with this ${params[1]} is not found` },
    MESSAGE_ALREADY_EXISTS: (params: Array<string>) => { return `${params[0]} with this ${params[1]} already exists` },
    MESSAGE_MISSING_PARAMTERS: (params: Array<string>) => { return `Some Paramters Are Missing: ${params}` },
    MESSAGE_INVALID_DATA: (param: string) => { return `Invalid ${param}` },
    MESSAGE_NOT_ACTIVE: (collection_name: string) => { return `${collection_name} is not active` },
    MESSAGE_INVALID_FILE_TYPE: (allowed_file_types: Array<string>) => { return `Invalid File Type, allowed file types are: ${allowed_file_types}` }
};

export default responses;
