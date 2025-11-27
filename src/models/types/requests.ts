import { Request } from "express";

export type TypedRequestBody<T> = Request<{}, any, T>;
export type TypedRequestQuery<T> = Request<any, any, any, T>;
export type TypedRequestParams<T> = Request<T>;
