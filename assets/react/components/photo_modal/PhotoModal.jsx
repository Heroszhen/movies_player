import { useEffect } from 'react';
import usePhotoModalStore, { setPhotosInModal } from '../../stores/photoModalStore';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Zoom } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/zoom';
import './photoModal.scss';

const PhotoModal = () => {
  const { photos } = usePhotoModalStore();
  console.log(photos);
  useEffect(() => {
    document.body.classList.add('overflow-hidden');

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  return (
    <section id="photo-modal" className="position-fixed w-100 vh-100 bg-dark top-0 start-0 z-5 pt-1 pb-1 z-9999">
      <div className="position-fixed w-100 top-0 start-0 ps-3 pe-3 z-3 h-[60px] d-flex justify-content-end align-items-center text-white">
        <i className="bi bi-x-lg cursor-pointer fs-3" onClick={() => setPhotosInModal([])}></i>
      </div>
      <Swiper spaceBetween={10} slidesPerView={1} loop style={{ height: '100vh' }} modules={[Zoom]} zoom={true}>
        {photos.map((url, index) => (
          <SwiperSlide key={index} className="d-flex justify-content-center align-items-center">
            <div className="swiper-zoom-container">
              <img src={url} alt="" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
export default PhotoModal;
