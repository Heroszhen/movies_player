import usePhotoModalStore, { setPhotosInModal } from '../../stores/photoModalStore';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import './photoModal.scss';

const PhotoModal = () => {
  const { photos } = usePhotoModalStore();

  return (
    <section id="photo-modal" className="position-fixed w-100 vh-100 bg-dark top-0 start-0 z-5 pt-1 pb-1">
      <div className="position-fixed w-100 top-0 start-0 ps-3 pe-3 z-3 h-[60px] d-flex justify-content-end align-items-center text-white">
        <i className="bi bi-x-lg cursor-pointer fs-3" onClick={() => setPhotosInModal([])}></i>
      </div>
      <Swiper spaceBetween={10} slidesPerView={1} loop style={{ height: '100vh' }}>
        {photos.map((url, index) => (
          <SwiperSlide key={index} className="d-flex justify-content-center align-items-center">
            <img src={url} alt="" />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
export default PhotoModal;
