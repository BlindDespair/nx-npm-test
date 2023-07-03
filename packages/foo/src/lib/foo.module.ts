import {BarModule} from '@blinddespair/bar';
import {buzz} from '@blinddespair/buzz';
import {Module} from '@nestjs/common';
import {isFuture} from 'date-fns';

@Module({
  imports: [BarModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class FooModule {
  constructor() {
    console.log(isFuture(new Date()));
    console.log(buzz());
  }
}
