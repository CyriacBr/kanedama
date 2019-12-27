import { Injectable, HttpService, HttpException, HttpStatus } from "@nestjs/common";

@Injectable()
export class HttpClient {
  constructor(private http: HttpService) {}

  async get<T>(url: string) {
    try {
      let { data, status } = await this.http.get<T>(url).toPromise();
      if (status[0] !== '2') {
        throw new Error(`Bad HTTP status from foreign service`);
      } else if (!data) {
        return null;
      }
      return data;
    } catch (error) {
      console.error(error);
      throw new HttpException(`Cannot reach foreign service`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}