import { Request, Response } from "express";
import { z } from "zod";

class RefundsController {
  async create(request: Request, response: Response) {
    response.status(201).json({ message: "ok" });
  }
}

export { RefundsController };
