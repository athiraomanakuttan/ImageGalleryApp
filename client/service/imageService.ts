import { ImageOrderType } from "@/types/generalTypes";

const BACKEND_URI = process.env.NEXT_PUBLIC_API_URL;

// get all images
export const getImages = async (accessToken:string)=>{
    const res = await fetch(`${BACKEND_URI}/api/images`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return res
}

//re arrange images
export const rearrangeOrder = async (accessToken: string,imagesToSave:ImageOrderType[])=>{
    const res = await fetch(`${BACKEND_URI}/api/images/reorder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ images: imagesToSave }),
      });
      return res
}

// edit single image
export const editImage  = async (accessToken:string,formData:FormData, imageId:string)=>{
    const res = await fetch(`${BACKEND_URI}/api/images/${imageId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    return res
}

// delete single image
export const deleteImage = async (accessToken:string,imageId:string)=>{
    const res = await fetch(`${BACKEND_URI}/api/images/${imageId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res
}

// upload image
export const uploadImage =async (accessToken:string,formData:FormData)=>{
    const res = await fetch(`${BACKEND_URI}/api/images/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });
      return res;
}

