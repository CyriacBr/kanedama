import { Module } from "@nestjs/common";
import { AnswerService } from "./answer.service";
import { AnswerController } from "./answer.controller";
import { HttpClientModule } from "../../common/service/http-client.module";
import { AccountsModule } from "../accounts/accounts.module";

@Module({
  imports: [HttpClientModule, AccountsModule],
  providers: [AnswerService],
  controllers: [AnswerController],
  exports: [AnswerService]
})
export class AnswerModule {}
