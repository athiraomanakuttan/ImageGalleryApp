import { UserType } from "@/types/generalTypes";

const BACKEND_URI = process.env.NEXT_PUBLIC_API_URL;

//user signup
export  const UserRegistartion = async (data:UserType)=>{
    const res = await fetch(`${BACKEND_URI}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data}),
    });
    return res
}

// user login

export const userLogin = async (data:UserType)=>{
    const res = await fetch(`${BACKEND_URI}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        });
    return res
}

//password reset request
export const passwordResetRequest = async (email: string)=>{
    const res = await fetch(`${BACKEND_URI}/api/auth/request-reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return res;
}

// updating new password for eset password
export const passwordReset = async (email:string, token:string ,newPassword:string)=>{
     const res = await fetch(`${BACKEND_URI}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, token, newPassword }),
    });
    return res
}



