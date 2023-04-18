import { useRouter } from "next/router";
import { useCallback } from "react";
import { BiArrowBack } from "react-icons/bi";

interface HeaderProps {
  showBackArrow?: boolean;
  label: string;
  sublebel?: string;
}

const Header: React.FC<HeaderProps> = ({showBackArrow, label,sublebel }) => {
  const router = useRouter();

  const handleBack = useCallback(() => {
    router.push("/");
  }, [router]);

  return (
    <div className="border-b-[2px]  border-gray-300 p-5">
      <div className="flex flex-row items-center gap-2">
        {showBackArrow && (
          <BiArrowBack 
            onClick={handleBack} 
            color="black" 
            size={20} 
            className="
              cursor-pointer 
              hover:opacity-70 
              transition
          "/>
        )}
        <div className="flex flex-col gap-1 items-center">
        <h1 className="text-black text-xl font-semibold">
          {label}
        </h1>
        <h1 className="text-lg font-normal text-gray-400">{sublebel}</h1>

        </div>
      </div>
    </div>
  );
}

export default Header;