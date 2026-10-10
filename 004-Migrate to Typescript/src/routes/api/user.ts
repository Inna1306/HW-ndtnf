import express, { type Request, type Response } from 'express';

const router = express.Router();

interface UserDto {
    id: number;
    mail: string;
}

router.post('/login', (_req: Request, res: Response<UserDto>) => {
    res.status(201).json({ id: 1, mail: 'test@mail.ru' });
});

export default router;
