import ASNextImage from '@/components/ASNextImage';

export default function ProfileImageSettings(props: {
  profileImageUrl: string;
  altText: string;
  onUpload: (file: File) => void;
}) {
  return (
    <div
      className={
        'flex relative justify-center items-center cursor-pointer group'
      }
      onClick={() => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = () => {
          const file = fileInput.files?.[0];
          if (file) {
            props.onUpload(file);
          }
        };
        fileInput.click();
      }}>
      <ASNextImage
        className={
          'w-full h-64 rounded-lg bg-white object-cover border border-gray-200 group-hover:border-gray-400'
        }
        src={props.profileImageUrl}
        alt={props.altText}
        width={300}
        height={300}
      />
      <div
        className={
          'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
        }>
        <p className={'text-sm text-gray-500 bg-white/50 backdrop-blur'}>
          프로필 이미지를 변경하려면 클릭하세요.
        </p>
      </div>
    </div>
  );
}
