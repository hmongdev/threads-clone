'use server'

import { User } from '../models/user.model';
import { revalidatePath } from 'next/cache'
import { connectToDB } from '../mongoose';

interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}
// destructuring the properties from User object
export const updateUser = async ({
  userId,
  username,
  name,
  bio,
  image,
  path,

}: Params): Promise<void> => {
  connectToDB();
  
  try {
    await User.findOneAndUpdate({ id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      {
        upsert: true
      }
    );
    
    if (path === '/profile/edit') {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`)
  }
}