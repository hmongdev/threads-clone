'use client'

import Image from "next/image";
import { ChangeEvent, useState } from "react"

// shadcn form // require => npx shadcn-ui@latest add [textarea]
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// this will simplify our forms for us
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
// import { ChangeEvent, useState } from "react";
// zod is a ts-first schema validation => create diff schemas for the form
import { zodResolver } from "@hookform/resolvers/zod";
import { useUploadThing } from "@/lib/uploadthing";

import { isBase64Image } from "@/lib/utils";
import { UserValidation } from "@/lib/validations/user";
import { updateUser } from "@/lib/actions/user.actions";

interface Props {
  user: {
    id:string;
    objectId:string;
    username: string;
    name: string;
    bio: string;
    image: string;
  },
  btnTitle: string,
}

const AccountProfile = ({ user, btnTitle }: Props) => {
  const [files, setFiles] = useState<File[]>([])
  const { startUpload } = useUploadThing("media")
  
  const router = useRouter();
  const pathname = usePathname();
  const form = useForm({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      profile_photo: user?.image || "",
      name: user?.name || "",
      username: user?.username || "",
      bio: user?.bio || "",
    }
  });
  
  // allows us to change the onboarding image
  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();
    const fileReader = new FileReader();
    
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      setFiles(Array.from(e.target.files));
      
      // if no images, exit immediately
      if (!file.type.includes('image')) return;
      
      // if images exist
      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || '';
        
        fieldChange(imageDataUrl);
      }
      fileReader.readAsDataURL(file);
    }
  };
  // reupload new image and update the user in the database
const onSubmit = async (values: z.infer<typeof UserValidation>) => {
    // get value from profile photo "blob"
    const blob = values.profile_photo;
    
    const hasImageChanged = isBase64Image(blob);
    
    if (hasImageChanged) {
      const imgRes = await startUpload(files);
      
      if (imgRes && imgRes[0].fileUrl) {
        // react hook form => don't have to worry about useState
        values.profile_photo = imgRes[0].fileUrl;
      }
    }
  // TODO: Update user profile
  // wrapping this in object to avoid type errors
  await updateUser({
    userId: user.id,
    username: values.username,
    name: values.name,
    bio: values.bio,
    path: pathname,
    image: values.profile_photo,
  });

  if (pathname === "/profile/edit") {
    router.back();
  } else {
    router.push("/");
  }
};
  
  
  return (
    <Form {...form}>
      <form
        className='flex flex-col justify-start gap-10'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name='profile_photo'
          render={({ field }) => (
            <FormItem className='flex items-center gap-4'>
              <FormLabel className='account-form_image-label'>
                {field.value ? (
                  <Image
                    src={field.value}
                    alt='profile_icon'
                    width={96}
                    height={96}
                    priority
                    className='rounded-full object-contain'
                  />
                ) : (
                  <Image
                    src='/assets/profile.svg'
                    alt='profile_icon'
                    width={24}
                    height={24}
                    className='object-contain'
                  />
                )}
              </FormLabel>
              <FormControl className='flex-1 text-base-semibold text-gray-200'>
                {/* profile photo */}
                <Input
                  type='file'
                  accept='image/*'
                  placeholder='Add profile photo'
                  className='account-form_image-input'
                  onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Name
              </FormLabel>
              <FormControl>
                <Input
                  type='text'
                  className='account-form_input no-focus'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Username
              </FormLabel>
              <FormControl>
                <Input
                  type='text'
                  className='account-form_input no-focus'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='bio'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Bio
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={10}
                  className='account-form_input no-focus'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='bg-primary-500'>
          {btnTitle}
        </Button>
      </form>
    </Form>
  )
}

export default AccountProfile