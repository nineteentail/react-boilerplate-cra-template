import { getLocalSetting, SettingKey } from "./localStorage";

export enum RequestMethodKey {
  get = 'GET',
  put = 'PUT',
  post = 'POST',
  delete = 'DELETE'
}
export class ResponseError extends Error {
  public response: Response;

  constructor(response: Response) {
    super(response.statusText);
    this.response = response;
  }
}

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
function parseJSON(response: Response) {
  if (response.status === 204 || response.status === 205) {
    return null;
  }
  return response.json();
}

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
function checkStatus(response: Response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new ResponseError(response);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
export async function request(
  url: string,
  options?: RequestInit,
): Promise<{} | { err: ResponseError }> {
  let _url = `${process.env.REACT_APP_API_URI}${url}`;
  const fetchResponse = await fetch(_url, options);
  const response = checkStatus(fetchResponse);
  return parseJSON(response);
}

/**
 *
 */
export async function authJsonRequest(
  url: string,
  httpMethod: string,
  data?: Object,
): Promise<{} | { err: ResponseError }> {
  let _url = `${process.env.REACT_APP_API_URI}${url}`;
  let access_token = getLocalSetting(SettingKey.AccessToken);
  let options = {
    method: httpMethod,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify(data),
  };
  const fetchResponse = await fetch(_url, options);
  const response = checkStatus(fetchResponse);
  return parseJSON(response);
}
