import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import  { UserContext }  from '../src/contexts/context'
import { Home } from './pages/Home';
import { useState, useContext, useEffect } from 'react';
import { Discover } from './pages/Discover';
import { Indicators } from './pages/Indicators';
import { PesquisadoresPage } from './pages/PesquisadoresPage';
import { Login } from './pages/Login';


import { client } from './lib/apollo'
import { ApolloProvider } from "@apollo/client"

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { auth } from './lib/firebase';
import { Dashboard } from './pages/Dashboard';
import {GoogleAuthProvider, signInWithPopup, User} from 'firebase/auth'
import { Chat } from './pages/Chat';
import { Terms } from './pages/Terms';
import Researcher from './pages/Researcher';
import { StepOne } from './pages/StepOne';
import { StepTwo } from './pages/StepTwo';
import { BaremaPage } from './pages/BaremaPage';
import { HomePageSimcc } from './pages/HomePageSimcc';
import { Magazine } from './pages/Magazine';
import { Profnit } from './pages/Profnit';




//rotas protegidas


export const App = () => {
  const [urlTermExport, setUrlTermExport] = useState('');
  const [valoresSelecionadosExport, setValoresSelecionadosExport] = useState('');

  const [totalPublicacoes, setTotalPublicacoes] = useState('');
  const [totalPesquisadores, setTotalPesquisadores] = useState('');
  const [totalInstituicoes, setTotalInstituicoes] = useState('');

  const [distinct, setDistinct] = useState(false)

  const [valorDigitadoPesquisaDireta, setValorDigitadoPesquisaDireta] = useState('');

  const [botaoPesquisadoresClicado, setBotaoPesquisadoresClicado] = useState(false);
  const [botaoTermosClicado, setBotaoTermosClicado] = useState(true);
  const [botaoResumoClicado, setBotaoResumoClicado] = useState(false);
  const [botaoAreasClicado, setBotaoAreasClicado] = useState(false);
  
  const [urlGeral, setUrlGeral] = useState('http://177.16.238.234:5001/');
  const [pesquisadoresSelecionadosGroup, setPesquisadoresSelecionadosGroups] = useState('');
  const [user, setUser] = useState<User>({} as User)
  const [isOn, setIsOn] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [intituicoesSelecionadasCheckbox, setIntituicoesSelecionadasCheckbox] = useState('');
  const [areasSelecionadasCheckbox, setAreasSelecionadasCheckbox] = useState('');

  const [valoresSelecionadosPopUp, setValoresSelecionadosPopUp] = useState('');
  const [isPopUpVisible, setIsPopUpVisible] = useState(false);

  const [idGraduateProgram, setIdGraduateProgram] = useState('1');

  useEffect(() => {
  setValoresSelecionadosPopUp(valoresSelecionadosExport)
}, [valoresSelecionadosExport]);




  return (
    <ApolloProvider client={client}>
      <Router>
        <UserContext.Provider  
        value={{
          urlTermExport, setUrlTermExport, 
          valoresSelecionadosExport, setValoresSelecionadosExport, 
          totalPublicacoes, setTotalPublicacoes, totalPesquisadores, 
          setTotalPesquisadores, totalInstituicoes, setTotalInstituicoes, 
          valorDigitadoPesquisaDireta, setValorDigitadoPesquisaDireta,
          botaoPesquisadoresClicado, setBotaoPesquisadoresClicado,
          botaoTermosClicado, setBotaoTermosClicado,
          botaoResumoClicado, setBotaoResumoClicado,
          botaoAreasClicado, setBotaoAreasClicado,
          urlGeral, setUrlGeral,
          pesquisadoresSelecionadosGroup, setPesquisadoresSelecionadosGroups,
          user, setUser,
          isOn, setIsOn,
          enabled, setEnabled,
          intituicoesSelecionadasCheckbox, setIntituicoesSelecionadasCheckbox,
          areasSelecionadasCheckbox, setAreasSelecionadasCheckbox,

          valoresSelecionadosPopUp, setValoresSelecionadosPopUp,
          isPopUpVisible, setIsPopUpVisible,
          distinct, setDistinct,


          idGraduateProgram, setIdGraduateProgram
          }}>
          <Routes>
            <Route path='/' >
            <Route path=':userId?' element={<StepOne/>}/>
            </Route>
            <Route path='/search' element={<StepTwo/>}/>
            <Route path='/bem-vindo' element={<HomePageSimcc/>}/>
            <Route path='/discover' element={<Discover/>}/>
            <Route path='/indicators' element={<Indicators/>}/>
            <Route path='/pesquisadoresSelecionados' element={<PesquisadoresPage/>}/>
            <Route path='/terms' element={<Terms/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/chat' element={<Chat/>}/>
            <Route path='/result' element={<Home/>}/>

            <Route path='/profnit' element={<Profnit/>}/>


            <Route path='/barema' element={<BaremaPage/>}/>
            <Route path='/magazine' element={<Magazine/>}/>

            <Route path='researcher'>
              <Route path=':userId/:term?/:type?' element={<Researcher/>}/>
            </Route>


            {user ? (
              <Route path='/dashboard' element={<Dashboard/>}/>
            ) : (
              <div></div>
            )}
            
          </Routes>
        </UserContext.Provider>
      </Router>
    </ApolloProvider>
  )
}

export default App