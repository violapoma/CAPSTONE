import{ useState } from 'react';

import ListSkeletonItem from './ListSkeletonItem';

function LazyLoadedAvatar({ src, username, className }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const AvatarSkeleton = () => (
    <div className="placeholder-glow me-3" style={{ width: '2em', height: '2em', borderRadius: '50%' }}>
      <span className="placeholder w-100 h-100 rounded-circle bg-secondary"></span>
    </div>
  );

  return (
    <>
      {!imageLoaded && <AvatarSkeleton />}
      <img
        src={src}
        className={`${className} me-3`}
        alt={`Profile pic of ${username}`}
        onLoad={() => setImageLoaded(true)}
        style={{ display: imageLoaded ? 'block' : 'none' }}
      />
    </>
  );
}

export default LazyLoadedAvatar;