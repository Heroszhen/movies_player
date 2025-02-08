import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { wait } from '../../services/utils';

const Editor = forwardRef((props, ref) => {
    const iframeRef = useRef(null);

    useEffect(() => {
        (async()=>{
            await wait(0.5);
            iframeRef.current.contentWindow.setValue(props.value);
        })();
    }, []);

    const getValue = () => {
        return iframeRef.current.contentWindow.getValue();
    }

    useImperativeHandle(ref, () => {
        return {
            getValue
        }
    });

    return (
        <section className="editor" ref={ref}>
            <div>
                <label>{props.label}</label>
            </div>
            <iframe src="/extra/textarea.html" className="w-100 hero-minh-453" ref={iframeRef} ></iframe>
        </section>
    );
});
export default Editor;