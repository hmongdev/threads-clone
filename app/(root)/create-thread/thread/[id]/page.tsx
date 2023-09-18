// Get params from url in NextJS
// destructure: { params }: { params: { id: string } }
// 

import ThreadCard from '@/components/cards/ThreadCard';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const Page = async ({ params }: { params: { id: string } }) => {  
  // check for id
  if (!params.id) return null;
  
  // check for user
  const user = await currentUser();
  if (!user) return null;
  
  const userInfo = await fetchUser(user.id)
  if (!userInfo?.onboarded) redirect('/onboarding')
  
  // how do we know which thread we're viewing? thread.actions.ts
  const thread = await fetchThreadById(params.id);
  
  return (
    <section className="relative">
      <div>
      <ThreadCard
                key={thread._id}
                  id={thread._id}
                  currentUserId={user?.id || ""}
                  parentId={thread.parentId}
                  content={thread.text}
                  author={thread.author}
                  community={thread.community}
                  createdAt={thread.createdAt}
                  comments={thread.children}
                />
      </div>
    </section>
  )
}

export default Page