import { Link } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";
import { BookOpen, ChartLine, DownloadSimple, ListDashes, MagnifyingGlass, Plus, Textbox, Trash, X } from "phosphor-react";

import cimatec from '../assets/logo_profnit.png';
import { LogoWhite } from "./LogoWhite";

import { UserContext } from '../contexts/context'
import { useEffect, useState, useContext } from "react";

type Research = {
    among: number,
    articles: number,
    book: number,
    book_chapters: number,
    id: string,
    name: string,
    university: string,
    lattes_id: string,
    area: string,
    lattes_10_id: string,
    abstract: string
    city: string,
    orcid: string,
    image: string,
    graduation: string,
    patent: string,
    software: string,
    brand: string,
    lattes_update: Date,
  }

  interface Pesquisadores {
    id: string
    name: string
  }

export function Barema() {

    const [researcher, setResearcher] = useState<Research[]>([]); // Define o estado vazio no início
  const [isLoading, setIsLoading] = useState(false);

  const { urlGeral, setUrlGeral } = useContext(UserContext);
  const { pesquisadoresSelecionadosGroupBarema, setPesquisadoresSelecionadosGroupBarema } = useContext(UserContext);
  const { idGraduateProgram, setIdGraduateProgram } = useContext(UserContext)

  const [pesquisaInput, setPesquisaInput] = useState('');
  
  
  const pesquisaInputFormatado = pesquisaInput.trim().replace(/ \s+/g, ";");
  const urlPesquisador = urlGeral + `/reasercherInitials?initials=${pesquisaInputFormatado}`

  const removerPesquisador = (pesquisador: string) => {
    const novaString = pesquisadoresSelecionadosGroupBarema
      .split(';')
      .filter((name) => name.replace(/%20|\s+/g, '') !== pesquisador.replace(/%20|\s+/g, ''))
      .join(';');
    setPesquisadoresSelecionadosGroupBarema(novaString);
    console.log('removeu')
    console.log(pesquisadoresSelecionadosGroupBarema)
  };

  const apagarGroup = () => {
    setPesquisadoresSelecionadosGroupBarema('');
  }

  let urlTermPesquisadores = `${urlGeral}/researcherName?name=${pesquisadoresSelecionadosGroupBarema}`

    console.log(urlTermPesquisadores)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(urlTermPesquisadores, {
          mode: 'cors',
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600',
            'Content-Type': 'text/plain'
          }
        });
        const data = await response.json();
        if (data) {
          setResearcher(data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [urlTermPesquisadores]);

  const [resultadosPesquisadores, setResultadosPesquisadores] = useState<Pesquisadores[]>([]);

  useEffect(() => {
  fetch(urlPesquisador, {
    mode: 'cors',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '3600',
      'Content-Type': 'text/plain'


    }
  })

    .then((response) => response.json())
    .then((data) => {
      ;
      const newDataPesquisadores = data.map((post: Pesquisadores) => ({
        ...post,
        name: post.name.replace(/\s+/g, "%20")
      }));
      setResultadosPesquisadores([]);
      setResultadosPesquisadores(newDataPesquisadores);

    })
    .catch((err) => {
      console.log(err.message);
    });

  }, [urlPesquisador]);

    console.log(urlPesquisador)

  //pesquisa de pesquisadores

  const [searchState, setSearchState] = useState(false)
 
  const { valorDigitadoPesquisaDireta, setValorDigitadoPesquisaDireta } = useContext(UserContext);

  function handlePesquisaChange(event: React.ChangeEvent<HTMLInputElement>) {
    const valorDigitado = event.target.value;
    setPesquisaInput(valorDigitado);
  }

  //checkboxx pesquisadores

  const handleClickPesquisadores = (name: string) => {
    setPesquisaInput('')
    setResultadosPesquisadores([])
    setPesquisadoresSelecionadosGroupBarema(pesquisadoresSelecionadosGroupBarema + ';' + name)
  };

  const [pesquisadoresSelecionados, setPesquisadoresSelecionados] = useState<string[]>([]);

  const handleCheckboxChangeInputPesquisadores = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = event.target;
    const isChecked = event.target.checked;

    setPesquisadoresSelecionados((prevSelecionados) => {
      if (isChecked) {
        return [...prevSelecionados, name];
      } else {
        return prevSelecionados.filter((item) => item !== name);
      }
    });
  };

 
  


  console.log('pesquisadores selecionados' + pesquisadoresSelecionadosGroupBarema)


  const checkboxPesquisadores = resultadosPesquisadores.map((resultado) => (
    <li
      key={resultado.id}
      className="checkboxLabel group list-none inline-flex  group overflow-hidden"
      onMouseDown={(e) => e.preventDefault()}
    >
      <label className="group-checked:bg-blue-400 whitespace-nowrap cursor-pointer border-[1px]  border-white transition-all flex h-10 items-center px-4 text-white rounded-md text-xs font-bold hover:border-blue-400 hover:bg-white hover:text-blue-400">
        <span className="text-center block">{resultado.name.replace(/%20/g, ' ')}</span>
        <input
          type="checkbox"
          name={resultado.name}
          className="absolute hidden group"
          checked={pesquisadoresSelecionados.includes(resultado.name)}
          id={resultado.name}
          onChange={handleCheckboxChangeInputPesquisadores}
          onClick={() => handleClickPesquisadores(resultado.name)}
         
        />
      </label>
    </li>
  ));

  

  //upload de arquivos

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null; // Use null como fallback
    setSelectedFile(file);
  };

  function handleClick() {
    setValorDigitadoPesquisaDireta(pesquisaInput.replace(/\s+/g, ";"));
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      // Realize a ação de pesquisa aqui, por exemplo, chame uma função de pesquisa
      handleClick();
    }
  };



  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Envie o arquivo para a API aqui usando fetch ou axios.
      fetch('URL_DA_SUA_API', {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          // Lide com a resposta da API aqui.
        })
        .catch((error) => {
          // Lide com erros de envio aqui.
        });
    }
  };


  


    return  (
        <div className="md:px-16 px-6 min-h-screen">
            <div className="absolute z-[-9] w-full top-0 left-0">
                <div className="w-full h-[70vh] bg-blue-400">
                
                </div>
            </div>

            <header className={` z-[9999999] w-full mb-4 h-20 justify-between items-center flex `}>
                <div className=" w-full flex items-center h-12 ">
                    <div className="flex gap-6 items-center h-full justify-center ">
                    <Link to={"/"} className="h-[30px]  "><LogoWhite /></Link>
                    <div className="w-[1px] h-8 bg-gray-400"></div>
                    <Link to={"https://profnit.org.br/"} target="_blank" className="h-[32px] "><img src={cimatec} alt="" className="h-[30px]" /></Link>
                    </div>

                    <div className="md:flex h-full hidden  rounded-md   ml-4">
                    
                    <Link to={"/indicators"} className="flex items-center h-full  px-4 text-white text-sm font-bold transition  gap-2"><ChartLine size={16}  />Indicadores</Link>
                    <Link to={"/terms"} className="flex items-center h-full  px-4 text-white text-sm font-bold transition  gap-2"><ListDashes size={16}  />Dicionário</Link>
                    <Link to={"/magazine"} className="flex items-center h-full  px-4 text-white text-sm font-bold transition  gap-2"><BookOpen size={16} />Revistas</Link>
                    <Link to={"/barema"} className="flex items-center h-full  px-4 text-white text-sm font-bold transition  justify-center gap-2"><Textbox size={16} />Barema {pesquisadoresSelecionadosGroupBarema != ''  ? (<div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>):('')}</Link>
                    </div>
                </div>

                <div className="flex gap-4">
                    <LanguageSwitcher/>
                    </div>
                </header>

           <div className="">

           <div className="flex justify-between gap-4 items-center">
            <div className="mb-[20px]">
                <h1 className="z-[999999] text-4xl mb-4 font-normal max-w-[750px] text-white pt-12 ">

                <strong className="bg-green-400 text-white font-normal">
                Barema 
                </strong>{" "}
                de avaliação dos pesquisadores
                </h1>
                <p className="text-white max-w-[750px] pb-8">O sistema de classificação, é uma estrutura criada para avaliar e classificar pesquisadores com base em critérios específicos como qualidade e quantidade de publicações, impacto da pesquisa, contribuições para a comunidade científica, atividades de ensino e entre outros.</p>

                <div className="flex gap-3 mb-3" >
                {researcher.slice(0,10).map(props => {
                    if(pesquisadoresSelecionadosGroupBarema != '') {
                      return(
                        <div key={props.id} className="group flex transition-all">
                            <Link to={`/researcher/${props.id}`} target="_blank" className=" rounded-lg w-12 h-12 bg-cover bg-center bg-no-repeat group-hover:rounded-l-lg group-hover:rounded-r-none" style={{ backgroundImage: `url(http://servicosweb.cnpq.br/wspessoa/servletrecuperafoto?tipo=1&id=${props.lattes_10_id}) ` }}></Link>
                            <div onClick={() => removerPesquisador(props.name)} className="h-12 w-12 bg-white hidden group-hover:flex items-center justify-center transition-all text-blue-400 rounded-r-lg cursor-pointer" ><X size={16} className="" /></div>
                        </div>
                    )
                    }
                })}
                    <div onClick={() => setSearchState(!searchState)} className={`rounded-lg w-12 h-12 cursor-pointer  border-white border flex items-center justify-center hover:bg-white transition-all  hover:text-blue-400 ${searchState == true ? ('bg-white text-blue-400'): ('text-white')}`}>{searchState == false ? (<Plus size={16} className="" />):(<X size={16} className="" />)}</div>

                    {searchState == true ? (
                  <div>
                    <div className={`flex  items-center h-12 group w-full  text-base font-medium  justify-center transition border-[1px] border-white rounded-lg `}>
                  <MagnifyingGlass size={20} className={` min-w-[52px] text-white`} />
                  
                  <input
                    type="text"
                    value={pesquisaInput}
                    onChange={handlePesquisaChange}
          
                    onKeyPress={handleKeyPress}
                    name=""
                    placeholder="Digite o nome do pesquisador"
                    id="" 
                    className="w-full h-full outline-none rounded-lg bg-blue-400 text-white" />
                </div>

               
                  </div>
                ): ('')}

                {pesquisadoresSelecionadosGroupBarema != '' ? (
                  <div onClick={() => apagarGroup()}  className="rounded-lg cursor-pointer w-12 h-12  border-white border flex items-center justify-center hover:bg-white transition-all text-white hover:text-blue-400"><Trash size={16} className="" /></div>
                ): ('') }

                <div className="text-white font-medium h-12 w-12 flex items-center justify-center">ou</div>
                   
                <form action="">
                    <label for="upload"  className="rounded-lg cursor-pointer px-4 h-12 border-white border flex items-center justify-center gap-3 hover:bg-white transition-all text-white hover:text-blue-400"><input id="upload" type="file" accept=".xml" hidden className=""/><DownloadSimple size={16} className="" />Importar arquivo xml do pesquisador</label>
                    </form>

                </div>

                

                {searchState == true && pesquisaInput != "" ? (
                  <div className="w-full h-10 overflow-x-auto">
                    <div className="w-full flex  gap-4  overflow-x-auto whitespace-nowrap">{checkboxPesquisadores}</div>
                  </div>
                ): ('')}
            </div>

            <div >
            
            </div>
           </div>

           <div className="w-full min-h-[300px] p-8 bg-white border border-gray-300 rounded-2xl">d</div>

           
           </div>
        </div>
    )
}