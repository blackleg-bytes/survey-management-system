import { Controller, Get, Query, UsePipes } from "@nestjs/common";
import { AppService } from "./app.service";
import {
  ResponseMessage,
  Transactional,
  TrimPipe,
  ParseIntDefaultPipe,
} from "@shared";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UsePipes(TrimPipe)
  @Transactional()
  @ResponseMessage("Welcome to the API")
  getHello(@Query("times", new ParseIntDefaultPipe(1)) times: number): string {
    console.log(`Executing hello ${times} times`);
    return this.appService.getHello();
  }

  @Get("health")
  @ResponseMessage("Service is healthy")
  health() {
    return {
      status: "ok",
      uptime: process.uptime(),
    };
  }
}
