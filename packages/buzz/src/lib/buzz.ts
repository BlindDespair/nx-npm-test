import { isTomorrow } from "date-fns";

export function buzz(): boolean {
  return isTomorrow(new Date());
}
