
import axios from "axios";

import { useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";

import useCurrentUser from "./useCurrentUser";
import useLoginModal from "./useLoginModal";
import useUser from "./useUser";

const useFollow = (userId: string) => {

  const { data: currentUser, mutate: mutateCurrentUser } = useCurrentUser();
  const {mutate: mutateFetchedUser } = useUser(userId);


  const loginModal = useLoginModal();

  const isFollowing = useMemo(() => {
    const list = currentUser?.user.followingId || [];

    return list.includes(userId);
  }, [currentUser, userId]);
  const isFollower = useMemo(() => {
    const list = currentUser?.user.followerId || [];

    return list.includes(userId);
  }, [currentUser, userId]);

  const toggleFollow = useCallback(async () => {
    if (!currentUser) {
      return loginModal.onOpen();
    }

    try {
      let request;

      if (isFollowing ) {
        
        request = () => axios.delete('/api/following',{data:{userId} } );
      }
      
      else {
        request = () => axios.post('/api/following', { userId });
        if(currentUser.user.id !== userId){
          axios.post('/api/following', { userId:currentUser.user.id });
        }
      
      }

   
   
      await request();
      toast.success('Success');
      mutateCurrentUser();
      mutateFetchedUser();
  


    } catch (error) {
      toast.error('Something went wrong');
    }
  }, [currentUser, isFollowing, userId, mutateCurrentUser, mutateFetchedUser, loginModal]);

  return {
    isFollowing,
    toggleFollow,
    isFollower,
  }
}

export default useFollow;
