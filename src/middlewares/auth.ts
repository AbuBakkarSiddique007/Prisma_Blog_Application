import type { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../lib/auth"


export enum UserRole {
    ADMIN = "ADMIN",
    USER = "USER"
}



declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                name: string;
                role: string;
                emailVerified: boolean;
            }
        }
    }
}

const auth = (...roles: UserRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // console.log("middleware calling........");
        // console.log(roles);

        // get user session
        const session = await betterAuth.api.getSession({
            headers: req.headers as any
        })
        console.log(session);

        if (!session) {
            return res.status(401).send({
                message: "Unauthorized"
            })
        }

        if (!session.user.emailVerified) {
            return res.status(403).send({
                message: "Please verify your email to access this resource"
            })
        }

        req.user = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
            role: session.user.role as string,
            emailVerified: session.user.emailVerified
        };

        if (roles.length > 0 && !roles.includes(req.user.role as UserRole)) {
            return res.status(403).send({
                message: "Forbidden! You don't have enough permission to access this resource"
            })
        }
        next();
    }
}

export { auth };