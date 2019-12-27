import { Module, HttpModule } from "@nestjs/common";
import { HttpClient } from "./http-client";

@Module({
  imports: [HttpModule],
  providers: [HttpClient],
  exports: [HttpClient]
})
export class HttpClientModule {}
