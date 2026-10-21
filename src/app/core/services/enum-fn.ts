export class EnumFn {
   public static values<T extends object>(enumObj: T): T[keyof T][] {
      return Object.keys(enumObj).map(x => enumObj[x as keyof T]);
   }
}
