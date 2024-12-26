import type { Request, Response } from 'express';

export function home(serviceName: string): (req: Request, res: Response) => void {
  return (req: Request, res: Response) => {
    res.send(`${serviceName} is awake!`);
  };
}
