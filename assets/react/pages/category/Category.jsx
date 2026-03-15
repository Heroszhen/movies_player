import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import useMovieStore from '../../stores/movieStore';

const Category = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const page = searchParams.get('page') || 1;
  const { movies, getMovies } = useMovieStore();

  useEffect(() => {
    (async () => {
      if (id) {
        await getMovies(page, '', true, `categories.id=${id}`);
        console.log(movies);
      }
    })();
  }, [id, page]);

  return (
    <section id="category" className="min-vh-100">
      {movies.length}
    </section>
  );
};
export default Category;
