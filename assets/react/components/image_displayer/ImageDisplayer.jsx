import { useEffect } from 'react';
import './ImageDisplayer.scss';
import { isEmpty } from '../../services/utils';

const ImageDisplayer = (props) => {
  useEffect(() => {
    document.body.classList.add('overflow-hidden');

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);
  return (
    <>
      {!isEmpty(props.photoUrl) && (
        <div
          id="image-displayer"
          className="d-flex justify-content-center align-items-center w-100 h-100 bg-black fixed z-9999 top-0 start-0 overflow-auto"
          onDoubleClick={() => props.setPhotoUrl(null)}>
          <img src={props.photoUrl} alt="" />
        </div>
      )}
    </>
  );
};
export default ImageDisplayer;
