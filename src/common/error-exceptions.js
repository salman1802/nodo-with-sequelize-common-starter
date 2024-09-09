export const HttpStatus = {
    BAD_REQUEST_EXCEPTION: 400,
    UNAUTHORIZED_EXCEPTION: 401,
    ACCESS_DENIED_EXCEPTION: 403,
    NOT_FOUND_EXCEPTION: 404,
    CONFLICT_EXCEPTION: 409,
    PRECONDITION_FAIL_EXCEPTION: 412,
    UNPROCESSABLE_ENTITY_EXCEPTION: 422,
    INTERNAL_SERVER_EXCEPTION: 500,
    NO_CONTENT: 204,
  };
  export class Exception extends Error {
    constructor(message) {
      super();
      this.statusCode = 500;
      if (this instanceof UnprocesssableEntityException) {
        this.statusCode = 422;
      } else if (this instanceof NotFoundException) {
        this.statusCode = 404;
      } else if (this instanceof ForbiddenException) {
        this.statusCode = 403;
      } else if (this instanceof UnauthorizedException) {
        this.statusCode = 401;
      } else if (this instanceof ConflictException) {
        this.statusCode = 409;
      } else if (this instanceof InternalServerError) {
        this.statusCode = 500;
      } else if (this instanceof PreconditionFailedException) {
        this.statusCode = 412;
      } else if (this instanceof BadRequestException) {
        this.statusCode = 400;
      } else {
        this.statusCode = 500;
      }
      this.message = message;
    }
  }
  
  export class UnprocesssableEntityException extends Exception {}
  export class NotFoundException extends Exception {}
  export class ForbiddenException extends Exception {}
  export class ConflictException extends Exception {}
  export class UnauthorizedException extends Exception {}
  export class InternalServerError extends Exception {}
  export class PreconditionFailedException extends Exception {}
  export class BadRequestException extends Exception {}
  