
import { useRouter } from "next/router";
import { useCallback } from "react";

import useUser from "@/hooks/useUser";
import Image from "next/image";
type AvatarProps ={
  userId: string;
  isLarge?: boolean;
  hasBorder?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ userId, isLarge, hasBorder }) => {
  const router = useRouter();

  const { data: fetchedUser } = useUser(userId);

  const onClick = useCallback((event: any) => {
    event.stopPropagation();

    const url = `/user/${userId}`;

    router.push(url);
  }, [router, userId]);

  return (
    <div
      className={`
        ${hasBorder ? 'border-4 white' : ''}
        ${isLarge ? 'h-32' : 'h-12'}
        ${isLarge ? 'w-32' : 'w-12'}
        rounded-full 
        hover:opacity-90 
        transition 
        cursor-pointer
        relative
        
      `}
    >
      <Image
       height={200}
       width={200}
        style={{
          objectFit: 'cover',
          borderRadius: '100%'
        }}
        
        alt="Avatar"
        onClick={onClick}
        src={fetchedUser?.profileImage || '/random.jpg'}
      
      />
    </div>
  );
}
 
export default Avatar;