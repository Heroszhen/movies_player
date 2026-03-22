import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getCategoriesName } from '../../stores/categoryStore';
import { getMoviesByCategories } from '../../stores/movieStore';
import Poster from '../../components/poster/poster';
import ResponsivePagination from 'react-responsive-pagination';
import { wait } from '../../services/utils';

const Category = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(searchParams.get('page') === null ? 1 : parseInt(searchParams.get('page')));
  const [total, setTotal] = useState(0);
  const itemsPerPage = 20;
  const [categories, setCategories] = useState([]);
  const [indexes, setIndexes] = useState([]); //category index
  const [movies, setMovies] = useState([]);
  const [btnShow, setBtnShow] = useState('');
  const [keywords, setKeywords] = useState('');
  const searchRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(null);

  useEffect(() => {
    getCategories();

    (async () => {
      await wait(2);
      window.addEventListener('scroll', storeScrollTop);
    })();
    return () => {
      window.removeEventListener('scroll', storeScrollTop);
    };
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      searchMovies();
    }
  }, [indexes, page, keywords]);

  const getCategories = async () => {
    const result = await getCategoriesName();
    setCategories(result);
    const index = result.findIndex((category) => category.id === parseInt(id));
    setChoicesFromStore(index === -1 ? null : index);
  };

  const changeCategory = (index) => {
    if (indexes.includes(index)) {
      setIndexes(indexes.filter((oldIndex) => oldIndex !== index));
    } else {
      setIndexes([...indexes, index]);
    }
    setPage(1);
  };

  const searchMovies = async () => {
    storeChoices();
    const categoryIds = indexes.map((index) => categories[index]['id']);
    const response = await getMoviesByCategories(categoryIds, keywords, page);
    if (response !== null) {
      setMovies(response['hydra:member']);
      setTotal(response['hydra:totalItems']);
      if (scrollTop !== null) {
        await wait(0.5);
        window.scrollTo({top: scrollTop});
        setScrollTop(null);
      }
    }
  };

  const storeChoices = () => {
    let store = localStorage.getItem('category_page');
    if (store) store = JSON.parse(store);
    else store = {};
    const newStore = {
      indexes: indexes,
      keywords: keywords,
      page: page,
      id: id ?? -1
    }

    localStorage.setItem('category_page', JSON.stringify(Object.assign(store, newStore)));
  }

  const setChoicesFromStore = (index = null) => {
    let newIndexes = [];
    let newPage = page;

    let store = localStorage.getItem('category_page');
    if (store) {
      store = JSON.parse(store);
      if (store.id === (id ?? -1)) {
        if (store.indexes) newIndexes = [...newIndexes, ...store.indexes];
        if (store.keywords) setKeywords(keywords);
        if (store.page) newPage = store.page;
        setScrollTop(store.scrollTop ?? 0);
      }   
    }
    if(index !== null && !newIndexes.includes(index))newIndexes.push(index);
    setIndexes(newIndexes);
    setPage(newPage);
  }

  const searchByKeywords = (e, toSend = false) => {
    const oldKeywords = keywords;
    if (
      (e.type === 'keyup' && e.keyCode === 13) ||
      (e.type === 'change' && !e.nativeEvent.data) ||
      toSend === true
    ) {
      const newKeywords = searchRef.current.value;
      setKeywords(newKeywords);
      if (oldKeywords !== newKeywords)setPage(1);
    }
  };

  const storeScrollTop = () => {
    
    let store = localStorage.getItem('category_page');
    if (store) store = JSON.parse(store);
    else store = {};
    store.scrollTop = window.scrollY;
    localStorage.setItem('category_page', JSON.stringify(store));
  }

  return (
    <section id="category" className="min-vh-100 p-2">
      <div className="container-fluid">
        <div className="row mb-4">
          <h1 className="col-12 mb-4">
            Vidéos avec Catégories
          </h1>
          <div className="col-6">
            <div className="dropdown">
              <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" onClick={() => setBtnShow(btnShow === '' ? 'show' : '')}>
                Catégories
              </button>
              <ul className={"dropdown-menu h-[calc(100vh-200px)] overflow-auto " + btnShow}>
                {categories.map((category, index) => (
                  <li className="ps-1 pe-1" key={index} >
                    <div className="category form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={'checkCategory_' + index}
                        checked={indexes.includes(index)}
                        onChange={() => changeCategory(index)}
                      />
                      <label className="form-check-label" htmlFor={'checkCategory_' + index}>
                        {category.name}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-6">
            <div className="d-flex justify-content-end">
              <div className="input-group input-group-sm md:hero-width-300">
                <input
                  type="search"
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-sm"
                  id="search"
                  name="name"
                  defaultValue={keywords}
                  ref={searchRef}
                  onChange={(e) => searchByKeywords(e)}
                  onKeyUp={(e) => searchByKeywords(e)}
                />
                <span className="input-group-text hero-cursor-pointer" 
                  onClick={(e) => searchByKeywords(e, true)}
                >
                  <i className="bi bi-search"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          {movies.map((movie, index) => (
            <div key={index} className="col-6 col-md-4 col-lg-3 col-xl-2 mb-5">
              <Poster movie={movie} />
            </div>
          ))}

          {movies.length > 0 && (
            <div className="col-12 mt-3">
              <div className="wrap-paginator">
                <ResponsivePagination
                  current={page}
                  total={Math.ceil(total / itemsPerPage)}
                  onPageChange={setPage}
                  maxWidth={400}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
export default Category;
