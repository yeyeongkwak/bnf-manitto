import { FC } from 'react';

interface AvatarProps {
   username: string | null;
   profileUrl: string | null;
}

export const AvatarCircle: FC<AvatarProps> = ({ username, profileUrl }) => {
   const initial = username?.[0]?.toUpperCase() ?? '?';

   return (
      <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-red-100 shadow-md overflow-hidden">
         {profileUrl ? (
            <img src={profileUrl} alt={username ?? 'profile'} className="h-full w-full object-cover" />
         ) : (
            <span className="text-2xl font-bold text-blue-500-500">{initial}</span>
         )}
      </div>
   );
};
