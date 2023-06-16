

export class Dates {

  static toShortDateTime(value: string) {
    return new Date(value).toLocaleString();
  }

  static getTodayShortDate(): string {
    return Dates.toShortDate(new Date().toString());
  }

  static getTodayTime(): number {
    return Dates.getTime(new Date());
  }

  static getTime(value: string | Date): number {
    const formatted = Dates.toYMDFormat(value);
    return new Date(formatted).getTime();
  }

  static toReadableDate(value: string | number) {
    return new Date(value).toDateString();
  }

  /**
   * To Short Date Function
   * @param {String} date the date to parse
   * @returns Date in format dd/MM/yyyy
   */
  static toShortDate(value: string): string {
    const date = new Date(value);
    return date.toLocaleDateString();
  }

  static toYMDFormat(value: string | Date): string {
    const date = new Date(value);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();

    return `${year}-${month}-${day}`;
  }

  static getTodayYMDFormat(): string {
    return Dates.toYMDFormat(new Date());
  }

  static equals(first: string, second: string): boolean {
    const firstFormatted = Dates.toYMDFormat(first);
    const secondFormatted = Dates.toYMDFormat(second);
    return (firstFormatted === secondFormatted);
  }

  static isToday(value: string): boolean {
    const now = Dates.getTodayTime();
    const date = Dates.getTime(value);
    return (now === date);
  }

  static toNormalYMDFormatted(value: string): string {
    const date = new Date(value);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();

    const normalMonth = (month < 10) ? `0${month}` : `${month}`;
    const normalDay = (day < 10) ? `0${day}` : day;
    return `${year}-${normalMonth}-${normalDay}`;
  }

  static toUserDatetime(value: string | Date | number): string {
    if (!value) {
      return "";
    }

    const datetime = (new Date(value)).toISOString();
    const [date, time] = datetime.split('.')[0].split('T');
    const [hours, minutes, seconds] = time.split(':');
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

}
