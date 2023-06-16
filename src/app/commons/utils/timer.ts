

/**
 * ## Timer Class
 * provide an API for time handling with timeout and ontick events, base on interval and timeout property values
 */
export class Timer {
  private $interval: number;
  private timer: number;
  private $timeout: number;
  private $reverse: boolean;

  public get interval(): number {
    return this.$interval;
  }

  public set interval(interval: number) {
    this.$interval = interval;
  }

  public get timeout(): number {
    return this.$timeout;
  }

  public set timeout(value: number) {
    this.$timeout = value;
    this.timer = value;
  }

  public get time(): number {
    return this.timer / 1000;
  }

  public set reverse(value: boolean) {
    this.$reverse = value;
  }

  private timerHandler: any;

  public ontimeout = () => { };

  public ontick = () => { };

  constructor();
  constructor(interval: number);
  constructor(interval?: number) {
    if (arguments.length == 1) {
      this.$interval = <number>interval;
      this.$timeout = 0;
      this.timer = 0;
      this.$reverse = false;
      return;
    }
    this.$interval = 0;
    this.$timeout = 0;
    this.timer = 0;
    this.$reverse = false;
  }

  public start(): void {
    if (this.$reverse) {
      this.runReverse();
    }
    else {
      this.run();
    }
  }

  private run(): void {
    this.timerHandler = window.setInterval(() => {
      if (this.timer === this.$timeout) {
        this.ontimeout();
      }
      else {
        this.ontick();
        this.timer += this.$interval;
      }
    }, this.$interval);
  }

  private runReverse(): void {
    this.timerHandler = window.setInterval(() => {
      if (this.timer === this.$interval) {
        this.ontimeout();
      }
      else {
        this.ontick();
        this.timer -= this.$interval;
      }
    }, this.$interval);
  }

  public stop(): void {
    clearInterval(this.timerHandler);
    this.timer = (this.$reverse) ? this.$timeout : 0;
  }

}
