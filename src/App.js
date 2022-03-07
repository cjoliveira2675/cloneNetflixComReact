import React, { useEffect, useState } from "react"
import Tmdb from './Tmdb'

import './App.css'

import MovieRow from "./components/MovieRow"
import FeaturedMovie from "./components/FeaturedMovie"
import Header from "./components/Header"

export default () => {

  const [movieList, setMovieList] = useState([])
  const [movieItem, setMovieItem] = useState(null)
  const [featuredData, setFeaturedData] = useState(null)
  const [blackHeader, setBlackHeader] = useState(false)

  useEffect(() => {
    const loadAll = async () => {
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      let originals = list.filter(i => i.slug === 'originals')
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1))
      let chosen = originals[0].items.results[randomChosen]
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv')
      setFeaturedData(chosenInfo)
    }
    loadAll();
  }, []);

  useEffect(() => {
    const scrlloListener = () => {
      if (window.scrollY > 10) {
        setBlackHeader(true)
      } else {
        setBlackHeader(false)
      }
    }
    window.addEventListener('scroll', scrlloListener)
    return () => {
      window.removeEventListener('scroll', scrlloListener)
    }
  }, [])

  return (
    <div className="page">
      <Header black={blackHeader} />
      {featuredData &&
        <FeaturedMovie item={featuredData} />
      }
      <section className="lists">
        {movieList.map((item, key) => (
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>
      <footer>
        Feito por CJOliveira, acompanhando live no canal da
        <a href="https://www.youtube.com/watch?v=tBweoUiMsDg&t=5775s">  B7Web</a><br />
        Direitos de imagem para
        <a href="https://www.netflix.com/br/">  Netflix</a><br />
        Dados pegos do site
        <a href="https://www.themoviedb.org/">  TMDB</a>
      </footer>
      {movieList.length <= 0 &&
        <div className="loading">
          <img src="https://i.pinimg.com/originals/e2/82/e2/e282e2739af30635723b9e2701bb8148.gif" />
        </div>}
    </div>
  );
}