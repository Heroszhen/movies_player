import { useEffect } from 'react';

const RedditVideoPlayer = (props) => {
  useEffect(() => {
    let redditScript = document.getElementById('reddit-script');
    if (!redditScript) {
      redditScript = document.createElement('script');
      redditScript.src = 'https://embed.reddit.com/widgets.js';
      redditScript.async = true;
      redditScript.charSet = 'UTF-8';
      redditScript.id = 'reddit-script';
      document.body.appendChild(redditScript);
    }
    return () => {
      redditScript?.remove();
    };
  }, [props.url]);
  return (
    <>
      <blockquote className="reddit-embed-bq" style={{ height: '500px' }} data-embed-height="740">
        <a href={props.url}></a>
      </blockquote>
      {/* <script async="" src="https://embed.reddit.com/widgets.js" charSet="UTF-8"></script> */}
    </>
  );
};
export default RedditVideoPlayer;
