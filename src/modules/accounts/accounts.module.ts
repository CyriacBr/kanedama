import { Module, HttpModule } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { HttpClient } from '../../common/service/http-client';

@Module({
  imports: [HttpModule],
  providers: [AccountsService, HttpClient],
  exports: [AccountsService],
})
export class AccountsModule {}
