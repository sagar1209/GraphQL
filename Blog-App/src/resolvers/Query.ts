import { Context } from "../index"

export const Query = {

       me: (_:any,__:any,{prisma,userInfo}:Context)=>{
          if(!userInfo) return null;
          return prisma.user.findUnique({
            where :{
              id : userInfo.userId
            }
          })
       },
       profile:async(_:any,{userId} :{userId: string},{prisma,userInfo}:Context)=>{
           const isMyprofile = Number(userId)===userInfo?.userId;
           
            const profile = await prisma.profile.findUnique({
              where :{
                 userId : Number(userId)
              }
            })

            return {
               ...profile,
               isMyprofile
            }
       },
       posts : (_:any,__:any,{prisma} : Context)=>{
          return prisma.post.findMany({
            where :{
              published :true
            },
            orderBy : [
                {
                    createdAt: "desc"
                }
            ]
          });
       }
    }