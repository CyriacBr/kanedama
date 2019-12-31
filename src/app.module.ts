import { Module } from '@nestjs/common';
import { AccountsModule } from './modules/accounts/accounts.module';
import { AnswerModule } from './modules/answer/answer.module';

@Module({
  imports: [AccountsModule, AnswerModule]
})
export class AppModule {}
