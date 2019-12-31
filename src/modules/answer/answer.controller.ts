import {
  Controller,
  Get,
} from "@nestjs/common";
import { AnswerService } from "./answer.service";

@Controller("answer")
export class AnswerController {
  constructor(private readonly service: AnswerService) {}

  @Get()
  findAll() {
    return this.service.getAnswer();
  }
}
