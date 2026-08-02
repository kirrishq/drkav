import "server-only";

export type CmsErrorCode =
  | "CMS_CONFIGURATION_ERROR"
  | "CMS_INVALID_RESPONSE"
  | "CMS_REQUEST_TIMEOUT"
  | "CMS_UNAUTHORIZED"
  | "CMS_UNAVAILABLE";

export abstract class CmsError extends Error {
  readonly code: CmsErrorCode;

  protected constructor(
    name: string,
    code: CmsErrorCode,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = name;
    this.code = code;
  }
}

export class CmsConfigurationError extends CmsError {
  constructor(message: string, options?: ErrorOptions) {
    super(
      "CmsConfigurationError",
      "CMS_CONFIGURATION_ERROR",
      message,
      options,
    );
  }
}

export class CmsUnavailableError extends CmsError {
  constructor(
    message = "CMS is temporarily unavailable.",
    options?: ErrorOptions & { timedOut?: boolean },
  ) {
    super(
      "CmsUnavailableError",
      options?.timedOut ? "CMS_REQUEST_TIMEOUT" : "CMS_UNAVAILABLE",
      message,
      options,
    );
  }
}

export class CmsUnauthorizedError extends CmsError {
  constructor(
    message = "CMS rejected the server-to-server credentials.",
    options?: ErrorOptions,
  ) {
    super("CmsUnauthorizedError", "CMS_UNAUTHORIZED", message, options);
  }
}

export class CmsInvalidResponseError extends CmsError {
  constructor(
    message = "CMS returned an invalid response.",
    options?: ErrorOptions,
  ) {
    super(
      "CmsInvalidResponseError",
      "CMS_INVALID_RESPONSE",
      message,
      options,
    );
  }
}

export function getCmsErrorCode(error: unknown): CmsErrorCode {
  return error instanceof CmsError ? error.code : "CMS_INVALID_RESPONSE";
}
