import { prismaclient } from "db/client";
import type { User } from "../types";
import bcrypt from "bcryptjs";
import type { SignupRequest } from "../types";

class UserModel {
    async getUserByEmail(email: string): Promise<User | null> {
        const res = await prismaclient.user.findFirst({
            where: {
                email: email
            }
        })
        
        console.debug("✅ user by email : ", res);
        return user;
    }

    async getUserById(id: string): Promise<User | null> {
        const res = await prismaclient.user.findFirst({
            where: {
                id: id
            }, select: {
                id: true,
                email: true,
                name: true,
            }
        })
        console.debug("✅ user by id : ", res);
        return res;
    }

    async createUser(userData: SignupRequest): Promise<User | null> {
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        const res = await prismaclient.user.create({
            data: {
                email: userData.email,
                hashedPassword: hashedPassword,
            }
        })
        console.debug("✅ user created : ", res);
        return res;
    }

    async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        const res = await bcrypt.compare(plainPassword, hashedPassword);
        console.log("✅ validate password : ", res);
        return res;
    }
}


/*
Instantiating the UserModel class (new UserModel())
Exporting that instance as the default export
Creating a Singleton - ensuring only one instance exists across the entire application

Why Use This Pattern?
✅ Advantages:

Singleton Behavior: Only one instance exists, so all parts of the app share the same data
Simpler Usage: No need to remember to instantiate with new
Consistent State: All controllers work with the same user data
Memory Efficient: Only one instance in memory
*/

export default new UserModel();


// create user
// get user by id
// get user by email
// validate password

// TODO : future integration
// update user data
