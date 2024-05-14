import { User, Profile,Prisma } from "@prisma/client";
import { Context } from "../../index";
import validator from "validator";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import {JWT_SIGNATURE} from "../../keys"

interface signupArgs {
  credentials: {
    email: string;
    password: string
  }
  name: string;
  bio: string;

}

interface signinArgs {
    credentials:{
        email: string;
        password: string;
    }
}

interface userPayload {
  userErrors: {
    message: string;
  }[];
  token: string | null;
}

export const authResolvers = {
  signUp: async (
    _: any,
    { credentials,name, bio }: signupArgs,
    { prisma }: Context
  ): Promise<userPayload> => {
    const {email,password} = credentials
    const isEmail = validator.isEmail(email);
    if (!isEmail) {
      return {
        userErrors: [
          {
            message: "Invalid Email",
          },
        ],
        token: null,
      };
    }
    const isValidPassword = validator.isLength(password,{
        min:5
    })
    if (!isValidPassword) {
      return {
        userErrors: [
          {
            message: "Invalid Password",
          },
        ],
        token: null,
      };
    }
    if (!name || !bio) {
      return {
        userErrors: [
          {
            message: "Invalid name or bio ",
          },
        ],
        token: null,
      };
    }

    const hasedPassword = await bcrypt.hash(password,10);
     
    const user = await prisma.user.create({
        data :{
            email,
            name,
            password : hasedPassword
        }
    })

    await prisma.profile.create({
        data : {
           bio,
           userId: user.id
        }
    })

    return {
      userErrors: [],
      token : jwt.sign({
        userId: user.id,
    }, JWT_SIGNATURE,{
        expiresIn : 360000
    })
    };

  },
  signin :async(_:any,{credentials}: signinArgs,{prisma}:Context): Promise<userPayload> =>{
     const {email,password} = credentials;

     const user  = await prisma.user.findUnique({
        where :{
            email
        }
     })
     if(!user){
        return {
            userErrors : [{
                message: "invalid email"
            }],
            token : null
        }
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        return {
            userErrors : [{
                message: "invalid password"
            }],
            token : null
        }
     }
      
     return {
        userErrors : [],
        token : jwt.sign({
            userId: user.id,
        }, JWT_SIGNATURE,{
            expiresIn : 360000
        })
     }

  }
};
