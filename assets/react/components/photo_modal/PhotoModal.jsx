import usePhotoModalStore from '../../stores/photoModalStore';

const PhotoModal = () => {
  const { photos } = usePhotoModalStore();

  return <section className="position-fixed w-100 vh-100 bg-dark top-0 start-0 z-5">{photos.length}</section>;
};
export default PhotoModal;
