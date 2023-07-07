import {isTomorrow} from 'date-fns';
import {privateServer} from '#server';

export function buzz(): boolean {
  console.log(privateServer);
  return isTomorrow(new Date());
}
