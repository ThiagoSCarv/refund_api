import { Request, Response } from "express";
import { z } from "zod";
import { UserRole } from "@prisma/client";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/app-error";
import { hash } from "bcrypt";

class UsersController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().trim().min(2, { message: "Nome é obrigatório" }),
      email: z
        .string()
        .trim()
        .email({ message: "E-mail é obrigatório" })
        .toLowerCase(),
      password: z
        .string()
        .min(6, { message: "A Senha deve ter pelo menos 6 dígitos" }),
      role: z
        .enum([UserRole.employee, UserRole.manager])
        .default(UserRole.employee),
    });

    const { name, email, password, role } = bodySchema.parse(request.body);

    const userWithSameEmail = await prisma.user.findFirst({
      where: { email: email },
    });

    if (userWithSameEmail) {
      throw new AppError("Usúario com o mesmo e-mail já cadastrado");
    }

    const hashedPassword = await hash(password, 8);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    response.status(201).json(userWithoutPassword);
  }
}

export { UsersController };
