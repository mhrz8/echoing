import type { Request, Response } from 'express';

export function healthz(): (req: Request, res: Response) => void {
  return (req: Request, res: Response) => {
    res.json({
      health: true,
    });
  };
}
