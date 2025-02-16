import {useState, useEffect, useRef} from 'react';
import parse from 'html-react-parser';

const Notifier = (props) => {
  const [eventSource, setEventSource] = useState(null);
  const toastRef = useRef(null);
  const [message, setMessage] = useState(null) 

  useEffect(() => {
    if (!props.pathname.includes('/admin') && null !== props.user && process.env.SSE_ENABLED === '1') {
      if (null === eventSource)setNewEventSource();
    } else {
      removeEventSource();
    }
  }, [props.pathname, props.user]);

  useEffect(() => {
    if (message !== null) {
      showToast();
    }
  }, [message]);

  const setNewEventSource = () => {
    const newEventSource = new EventSource(`${process.env.SSE_SERVER}/api/sse`);
    newEventSource?.addEventListener("new_videos", treatSSEEvent, true);
    setEventSource(newEventSource);
  }

  const removeEventSource = () => {
    eventSource?.close();
    eventSource?.removeEventListener("new_videos", treatSSEEvent, true);
    setEventSource(null);
  }

  const treatSSEEvent = (e) => {
    if (e.data !== '') {
      const data = JSON.parse(e.data);
      let str = data.videos.join('<br>');
      setMessage(str);
    }
  }

  const showToast = () => {
    toastRef.current?.classList.add('show');
    setTimeout(() => {
      toastRef.current?.classList.remove('show');
    }, 5000);
  }

  return (
    <>
      <div className="toast-container position-fixed top-0 start-0 p-3">
        <div id="liveToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true" ref={toastRef}>
          <div className="toast-header">
            <strong className="me-auto">Nouvelle vidéos</strong>
            <small></small>
            <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div className="toast-body">
            {message && parse(message)}
          </div>
        </div>
      </div>
    </>
  );
}
export default Notifier;