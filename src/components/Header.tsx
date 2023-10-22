import { Logo } from "./Logo";
import { Link } from "react-router-dom";
import { Ilustracao } from "./Ilustracao";
import { ArrowCircleDown, Info, Funnel, User, File, Buildings, PaperPlaneTilt, ChartLine, Question, SignIn, ListDashes, UserCirclePlus, UserCircle, BookOpen, Textbox, Share } from "phosphor-react";

import logo_1 from '../assets/logo_1.png';
import logo_2 from '../assets/logo_2.png';
import logo_3 from '../assets/logo_3.png';
import logo_4 from '../assets/logo_4.png';

import { Pesquisadores } from "./Pesquisadores";
import { Publicacoes } from "./Publicacoes";

import LanguageSwitcher from './LanguageSwitcher';

type Total = {
  organizations: string,
  publications: string,
  researcher: string
}

import cimatec from '../assets/logo_profnit.png';
import Cookies from "js-cookie";
import { useContext } from "react";
import { UserContext } from "../contexts/context";
import React, { useEffect } from 'react';

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
  }
}



export function Header() {

  useEffect(() => {
    const existingScript = document.getElementById('google-translate-api');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.id = 'google-translate-api';
      document.body.appendChild(script);
    }

    // Define the translation initialization function globally.
    window.googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          autoDisplay: false,
        },
        'google_translate_element'
      );
    };
  }, []);


  
  const { pesquisadoresSelecionadosGroupBarema, setPesquisadoresSelecionadosGroupBarema } = useContext(UserContext);

  return (
    <header className={` z-[9999999] px-6 md:px-16 w-full mb-4 h-20 justify-between items-center flex absolute top-0`}>
      <div className=" w-full flex items-center h-12 ">
        <div className="flex gap-6 items-center h-full justify-center ">
          <Link to={"/"} className="h-[30px]  "><Logo /></Link>
          <div className="w-[1px] h-8 bg-gray-400"></div>
          <Link to={"https://profnit.org.br/"} target="_blank" className="h-[32px] "><img src={cimatec} alt="" className="h-[30px]" /></Link>
        </div>

        <div className="md:flex h-full hidden  rounded-md   ml-4">
          
        <Link to={"/indicators"} className="flex items-center h-full  px-4 text-gray-400 text-sm font-bold transition  gap-2"><ChartLine size={16} className="text-gray-400" />Indicadores</Link>
          <Link to={"/terms"} className="flex items-center h-full  px-4 text-gray-400 text-sm font-bold transition  gap-2"><ListDashes size={16} className="text-gray-400" />Dicionário</Link>
          <Link to={"/magazine"} className="flex items-center h-full  px-4 text-gray-400 text-sm font-bold transition  gap-2"><BookOpen size={16} className="text-gray-400" />Revistas</Link>
          <Link to={"/barema"} className="flex items-center h-full  px-4 text-gray-400 text-sm font-bold transition  gap-2"><Textbox size={16} />Barema{ pesquisadoresSelecionadosGroupBarema != '' ? (<div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>):('')}</Link>
       
        </div>
      </div>

      <div className="flex gap-4">
        <div id="google_translate_element" ></div>
        {/*<LanguageSwitcher/>*/}
        </div>
    </header>
  )
}