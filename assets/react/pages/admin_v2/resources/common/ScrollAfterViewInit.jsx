import { useState } from 'react';
import { useEffect } from 'react';
import { useListContext } from 'react-admin';
import { wait } from '../../../../services/utils';

export const ScrollAfterViewInit = (props) => {
  const { isLoading, data } = useListContext();
  const [pageName, setPageName] = useState(null);
  const [canCheckScroll, setCanCheckScroll] = useState(false);

  useEffect(() => {
    (async () => {
      if (!isLoading && data && props.pageName !== pageName) {
        setPageName(props.pageName);
        await wait(0.5);
        const page = getStockedPage();
        if (page.scrollY !== undefined) window.scrollTo(0, page.scrollY);
        setCanCheckScroll(true);
      }
    })();
  }, [isLoading, data, props.pageName]);

  useEffect(() => {
    if (canCheckScroll) window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [canCheckScroll]);

  const getStockedPage = () => {
    try {
      let page = localStorage.getItem(props.pageName);
      if (!page) page = {};
      else page = JSON.parse(page);

      return page;
    } catch {}
  };

  const handleScroll = () => {
    try {
      let page = getStockedPage();
      page.scrollY = window.scrollY;
      localStorage.setItem(props.pageName, JSON.stringify(page));
    } catch {}
  };

  return null;
};
