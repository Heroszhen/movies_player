import { useRef, useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import { wait } from '../../services/utils';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const Editor = forwardRef((props, ref) => {
  const iframeRef = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    (async () => {
      await wait(0.5);
      iframeRef.current.contentWindow.setValue(props.value);
    })();
  }, []);

  const getValue = () => {
    return iframeRef.current.contentWindow.getValue();
  };

  useImperativeHandle(ref, () => {
    return {
      getValue,
    };
  });

  return (
    <section className="editor" ref={ref}>
      <div>
        <label>
          {props.label}
          {!shown && <KeyboardArrowUpIcon className="cursor-pointer" onClick={() => setShown(true)} />}
          {shown && <KeyboardArrowDownIcon className="cursor-pointer" onClick={() => setShown(false)} />}
        </label>
      </div>
      <iframe 
        src="/extra/textarea.html" 
        className={`w-100 ${shown ? '' : 'hidden'}`}
        style={{ minHeight: `${props.height ?? 400}px` }} 
        ref={iframeRef}
      ></iframe>
    </section>
  );
});
// Set displayName for the component
Editor.displayName = 'Editor';
export default Editor;
