import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

export interface Info {
  level: number;
  cost: number;
  funds: number;
  lastUpdated: number;
  production: number;
}

function getCost(level) {
  return Math.pow(1.2, level);
}

function getProductionPerSecond(level) {
  return Math.pow(1.1, level);
}


@Controller()
export class AppController {

  private level: number;
  private info: Info;

  constructor(private readonly appService: AppService) {
    this.level = 0;
    this.info = {
      level: this.level,
      cost: getCost(this.level),
      production: getProductionPerSecond(this.level),
      lastUpdated: new Date().getTime(),
      funds: 0,
    };
  }

  private upgrade() {
    const cost = this.info.cost;
    const newFunds = this.calculateNowFunds() - cost;

    if (newFunds < 0) {
      return;
    }

    this.level++;
    this.info = {
      level: this.level,
      cost: getCost(this.level),
      production: getProductionPerSecond(this.level),
      lastUpdated: new Date().getTime(),
      funds: newFunds
    };
  }

  private calculateNowFunds() {
    const now = new Date().getTime();
    const then = this.info.lastUpdated;
    const diffSinceThen = now - then;

    return this.info.funds + (this.info.production / 1000 * diffSinceThen);
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('info')
  getInfo(): Info {
    return { ...this.info, funds: this.calculateNowFunds() };
  }

  @Post('upgrade')
  getUpgrade(): Info {
    this.upgrade();
    return this.info;
  }
}
