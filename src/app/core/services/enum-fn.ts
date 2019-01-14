export class EnumFn {
   public static values(enumObj: any) {
      return Object.keys(enumObj).map(x => enumObj[x]);
   }
}
