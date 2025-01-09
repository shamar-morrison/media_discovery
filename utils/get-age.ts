import { differenceInYears } from "date-fns";

export function getAge(birthday: Date) {
  return differenceInYears(new Date(), birthday);
}
