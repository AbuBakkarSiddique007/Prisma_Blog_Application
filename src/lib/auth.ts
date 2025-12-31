import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use true for port 465, false for port 587
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    trustedOrigins: [process.env.APP_URL!],

    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "user"
            },
            phone: {
                type: "string",
                required: false
            },
            status: {
                type: "string",
                defaultValue: "ACTIVE",
                required: false
            }
        }

    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: true
    },

    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url, token }, request) => {
            console.log(`***Send email to ${user.email} with url: ${url} and token: ${token}`);

            const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;

            try {
                const info = await transporter.sendMail({
                    from: `"Prisma Blog App" <${process.env.SMTP_USER}>`,
                    to: user.email,
                    subject: "Verify your email address",
                    html: `<!doctype html>
<html>
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Verify your email</title>
    <style>
        body { font-family: Arial, sans-serif; background-color:#f6f9fc; color:#333; margin:0; padding:0; }
        .container { max-width:600px; margin:40px auto; background:#fff; border-radius:8px; padding:20px; box-shadow:0 2px 6px rgba(0,0,0,0.1); }
        .btn { display:inline-block; padding:12px 20px; color:#fff; background:#0070f3; border-radius:6px; text-decoration:none; }
        .footer { font-size:12px; color:#666; margin-top:20px; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Confirm your email address</h2>
        <p>Hello ${user.email},</p>
        <p>Thanks for signing up for Prisma Blog App. Please confirm your email address by clicking the button below:</p>
        <p><a class="btn" href="${verificationUrl}">Verify Email</a></p>
        <p>If the button doesn't work, copy and paste this URL into your browser:</p>
        <p><a href="${url}">${url}</a></p>
        <p class="footer">If you didn't request this, you can safely ignore this email.</p>
    </div>
</body>
</html>`,
                });

                console.log("Message sent:", info.messageId);
            } catch (error) {
                console.error(`Failed to send verification email to ${user.email}:`, error);
            }
        },
    },
    socialProviders: {
        google: {
            prompt: "select_account consent",
            accessType: "offline",
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
});