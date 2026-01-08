import { prisma } from '../lib/prisma';
import { UserRole } from '../middlewares/auth';


async function seedAdmin() {
    try {

        // Check user existence before seeding
        const adminData = {
            name: "Admin User",
            email: "admin1@example.com",
            password: "password123",
            role: UserRole.ADMIN
        };

        const existingAdmin = await prisma.user.findUnique({
            where: {
                email: adminData.email
            }
        });

        if (existingAdmin) {
            throw new Error("Admin already exit!")
        }

        const signUpAdmin = await fetch(`${process.env.BASE_URL}/api/auth/sign-up/email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(adminData)
        })

        console.log(signUpAdmin);

        if (signUpAdmin.ok) {
            console.log("Admin user seeded successfully.");

            await prisma.user.update({
                where: {
                    email: adminData.email
                },
                data: {
                    emailVerified: true
                }
            })
        }


    } catch (error) {
        console.error("Error seeding admin user:", error);

    }
}
seedAdmin();