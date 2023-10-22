import { Link } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";
import { BookOpen, CaretDown, CaretUp, ChartLine, Divide, DownloadSimple, FileCsv, ListDashes, MagnifyingGlass, Minus, Plus, Textbox, Trash, UserPlus, X } from "phosphor-react";

import cimatec from '../assets/logo_profnit.png';
import { LogoWhite } from "./LogoWhite";

import { UserContext } from '../contexts/context'
import { useEffect, useState, useContext } from "react";
import { SvgBarema } from "./SvgBarema";

import Papa from 'papaparse';
import Cookies from 'js-cookie';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import woman from '../assets/woman_ilus.png';

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
    somaTotal: number;
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
  const [categorySums, setCategorySums] = useState({});

  const [csvData, setCsvData] = useState<string>(''); // Variável para armazenar os itens concatenados do CSV LattesId
  
  
  const pesquisaInputFormatado = pesquisaInput.trim().replace(/ \s+/g, ";");
  const urlPesquisador = urlGeral + `/reasercherInitials?initials=${pesquisaInputFormatado}`

  const removerPesquisador = (pesquisador: string) => {
    const novaString = pesquisadoresSelecionadosGroupBarema
      .split(';')
      .filter((name) => name.replace(/%20|\s+/g, '') !== pesquisador.replace(/%20|\s+/g, ''))
      .join(';');
    setPesquisadoresSelecionadosGroupBarema(novaString);

  };

  const apagarGroup = () => {
    setPesquisadoresSelecionadosGroupBarema('');
  }

  let urlTermPesquisadores = `${urlGeral}/resarcher_barema?lattes_id=${csvData}&year=2020&year_guidance=1900 `

   
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

// logica dee avaliacao
  const [ano, setAno] = useState(3)
  const anoAtual = new Date().getFullYear();
  const anoFiltro = anoAtual - ano;


 // Os estados para armazenar os dados do arquivo CSV e categorias
 const [categorias, setCategorias] = useState([]);
 const [categoriasMapeadas, setCategoriasMapeadas] = useState({});

 useEffect(() => {
   const handleFileUpload = (e) => {
     const file = e.target.files[0];

     Papa.parse(file, {
       header: true,
       delimiter: ";", // Defina o delimitador como ponto e vírgula
       complete: (result) => {
         if (result.data && result.data.length > 0) {
           const categoriasPai = result.data.filter((item) => item.categoria_pai === '0');
           const categoriasFilhas = result.data.filter((item) => item.categoria_pai !== '0');

           // Organize as categorias filhas pelo código da categoria pai
           const categoriasMapeadas = {};
           categoriasPai.forEach((categoriaPai) => {
             const subCategorias = categoriasFilhas.filter((categoriaFilha) =>
               categoriaFilha.categoria_pai === categoriaPai.codigo
             );
             categoriasMapeadas[categoriaPai.codigo] = subCategorias;
           });

           setCategorias(categoriasPai);
           setCategoriasMapeadas(categoriasMapeadas);
         }
       },
     });
   };

   const fileInput = document.getElementById('fileInput');
   fileInput.addEventListener('change', handleFileUpload);

   return () => {
     fileInput.removeEventListener('change', handleFileUpload);
   };
 }, []);
  

  ///////////////////////////////


  //visibilidade

  const [isCloseHidden, setIsCloseHidden] = useState(false); //Produção geral
  const [isPopUp, setIsPopUp] = useState(true);

  const handleFileInputChange = (event) => {
    // Check if a file is selected
    if (event.target.files.length > 0) {
      setIsPopUp(false); // Set isPopUp to false when a file is selected
    }
  };


  //checkbox quallis

    const [qualis, setQualis] = useState([
    { id: 1, itens: 'A1' },
    { id: 2, itens: 'A2' },
    { id: 3, itens: 'A3' },
    { id: 4, itens: 'A4' },
    { id: 5, itens: 'B1' },
    { id: 6, itens: 'B2' },
    { id: 7, itens: 'B3' },
    { id: 8, itens: 'B4' },
    { id: 10, itens: 'C' },
    { id: 11, itens: 'SQ' },
  ]);

  function getColorForInstitution(qualis: Qualis) {
    const colors = {
      A1: '#006837',
      A2: '#8FC53E',
      A3: '#ACC483',
      A4: '#BDC4B1',
      B1: '#F15A24',
      B2: '#F5831F',
      B3: '#F4AD78',
      B4: '#F4A992',
      B5: '#F2D3BB',
      C: '#EC1C22',
      SQ: '#560B11',
      NP: '#560B11',
    };
    return colors[qualis] || '#000000';
  }

  const qualisColor: { [key: string]: string } = {
    'A1': 'bg-[#006837]',
    'A2': 'bg-[#8FC53E]',
    'A3': 'bg-[#ACC483]',
    'A4': 'bg-[#BDC4B1]',
    'B1': 'bg-[#F15A24]',
    'B2': 'bg-[#F5831F]',
    'B3': 'bg-[#F4AD78]',
    'B4': 'bg-[#F4A992]',
    'C': 'bg-[#EC1C22]',
    'SQ': 'bg-[#560B11]',
  }

  const [itensSelecionados, setItensSelecionados] = useState<string[]>([]);

  type CheckboxStates = {
    [index: number]: boolean;
  };

  const [checkboxStates, setCheckboxStates] = useState<CheckboxStates>({});

  const handleCheckboxChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const itemId = event.target.name;
    const isChecked = event.target.checked;

    setCheckboxStates((prevStates) => ({ ...prevStates, [itemId]: isChecked }));

    setItensSelecionados((prevSelecionados) => {
      const selectedQualis = qualis.find((q) => q.id === parseInt(itemId));
      if (selectedQualis) {
        if (isChecked) {
          return [...prevSelecionados, selectedQualis.itens];
        } else {
          return prevSelecionados.filter((item) => item !== selectedQualis.itens);
        }
      } else {
        // handle the case where selectedQualis is undefined
        return prevSelecionados;
      }
    });
  };

  const checkboxQualis = qualis.map((quali) => {
    const isChecked = checkboxStates[quali.id];
    return (
      <li
        key={quali.id}
        className="checkboxLabel group list-none inline-flex  group overflow-hidden"
        onMouseDown={(e) => e.preventDefault()}
      >
        <label
          className={`group-checked:bg-blue-400 cursor-pointer border-[1px] gap-3 bg-white border-gray-300 flex h-10 items-center px-4 text-gray-400 rounded-md text-xs font-bold hover:border-blue-400 hover:bg-blue-100 ${isChecked ? 'activeTab' : ''}`}
        >
          <div className={`rounded-sm h-4 w-4 ${qualisColor[quali.itens]}`}></div>
          <span className="text-center block">{quali.itens}</span>
          <input
            type="checkbox"
            name={quali.id.toString()}
            className="absolute hidden group"
            onChange={handleCheckboxChangeInput}
            id={quali.itens}
            checked={isChecked}
          />
        </label>
      </li>
    );
  });
  

  //
             researcher.sort((a, b) => {
  const somaTotalA = titulacao[a.id] + researcherSums[a.id];
  const somaTotalB = titulacao[b.id] + researcherSums[b.id];
  return somaTotalB - somaTotalA;
});


//gráfico

const options: Highcharts.Options = {
  chart: {
    type: 'column',
  },
  title: {
    text: 'Pontuação Total dos Pesquisadores',
  },
  xAxis: {
    categories: researcher.map((researcher) => researcher.name),
    title: {
      text: 'Pesquisador',
    },
  },
  yAxis: {
    title: {
      text: 'Pontuação Total',
    },
  },
  series: [
    {
      name: 'Pontuação Total',
      data: researcher.map((researcher) => researcher.somaTotal),
    },
  ],
};


/// importar dados LATTES 10 ID


  const handleFileInputChangeLattesId = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          // Result.data é uma matriz com os dados do CSVf
          const csvItems = result.data.map((row) => row[0]); // Supondo que o CSV tenha apenas uma coluna
          const concatenatedItems = csvItems.join(';'); // Concatenar os itens com ';'
          setCsvData(concatenatedItems);
        },
        header: true, // Se o CSV tiver um cabeçalho
      });
    }
  };


  console.log(csvData)


    return  (
        <div className=" min-h-screen ">

    <div className="absolute  w-full top-0 left-0 ">
                <div className="w-full  h-[70vh] bg-blue-400 ">
                  
                </div>
            </div>

          <div className="backgroundGradient h-full w-full md:px-16 px-6 pb-16">
            

            {isPopUp == true ? (
              <div className="fixed px-16 top-0 left-0 h-screen w-full bg-blue-400 z-[9999] bg-opacity-60 backdrop-blur-md">
              <div className="w-full grid grid-cols-2 gap-2 h-creen items-center">
                <div className="flex justify-center h-screen gap-4 flex-col">

                <h1 className="text-4xl mb-4 font-normal max-w-[400px] text-white pt-12 ">

                <strong className="bg-green-400 text-white font-normal">
                Barema 
                </strong>{" "}
                de avaliação dos pesquisadores
                </h1>
                <div className="gap-4 flex"><label for="fileInput"  className="rounded-lg cursor-pointer px-4 h-12 border-white border flex items-center justify-center gap-3 hover:bg-white transition-all text-white hover:text-blue-400"><input  id="fileInput" type="file" accept=".csv" hidden/><DownloadSimple size={16} className="" />Importar arquivo .csv com barema</label>
                <div onClick={() => apagarGroup()}  className="rounded-lg cursor-pointer w-12 h-12  border-white border flex items-center justify-center hover:bg-white transition-all text-white hover:text-blue-400"><FileCsv size={16} className="" /></div></div>
                </div>

                <div className="flex flex-col gap-8">
                  <div className="flex gap-4 items-center">
                    <div className="rounded-full   opacity-20 border-white h-32 min-w-[128px] border-4 flex items-center justify-center text-white font-medium text-5xl"> 1</div>
                    <div><h4 className="text-white text-2xl  mb-2">Primeiro passo</h4><p className="text-white text-md">Baixe o modelo de arquivo .csv disponibilizado no site e defina os critérios de avaliação, assim como sua pontuação e quantidade máxima. Você pode remover os critérios pré-existentes</p></div>
                  </div>

                  <div className="flex gap-4 items-center">
                    <div className="rounded-full opacity-60 border-white h-32 min-w-[128px] border-4 flex items-center justify-center text-white font-medium text-5xl"> 2</div>
                    <div><h4 className="text-white text-2xl mb-2">Segundo passo</h4><p className="text-white text-md">Importe o arquivo modiicado no site, certifique-se de que se encontra no formato UTF-8 e separado por ( ; ) ponto e vírgula</p></div>
                  </div>

                  <div className="flex gap-4 items-center">
                    <div className="rounded-full border-white h-32 min-w-[128px] border-4 flex items-center justify-center text-white font-medium text-5xl"> 3</div>
                    <div><h4 className="text-white text-2xl mb-2">Terceiro passo</h4><p className="text-white text-md">Com os parâmetros definidos, você pode importar os pesquisadores direto da plataforma, importando um arquivo .csv com o Id Lattes ou pelo .xml do docente</p></div>
                  </div>
                </div>
              </div>
            </div>
            ):('')}

           

            <header className={` z-[9999999999] w-full mb-4 h-20 justify-between items-center flex `}>
                <div className=" w-full flex items-center h-12  z-[9999999999] ">
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

                <div className="flex gap-4 z-[9999999999]">
                    <LanguageSwitcher/>
                    </div>
                </header>

           <div className="">

           <div className="flex justify-between gap-4 items-center ">
            <div className="mb-[20px] z-[99]">
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
                    className="placeholder-white::placeholder w-full h-full outline-none rounded-lg bg-blue-400 text-white" />
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
                  <div className="h-10 overflow-x-auto element relative max-w-[750px]">
                    <div className="w-full flex  gap-4  overflow-x-auto ">{checkboxPesquisadores}</div>
                  </div>
                ): ('')}
            </div>

            <div >
            
            </div>

            <div className="top-0 right-0 absolute h-[500px] ml-auto z-[999] "><SvgBarema/></div>
           </div>

           
           {/*teste*/}

           <div>
      
      
          <div className=" relative">
      <div  className=" flex flex-col gap-8 w-full  p-12 mb-12 bg-white border border-gray-300 rounded-2xl" >
      <div >
      <h1 className=" text-2xl mb-2 font-normal max-w-[750px] ">
                <strong className="bg-blue-400 text-white font-normal">Configurações da avaliação</strong> 
              </h1>
              <p className="text-gray-400 max-w-[750px]">Estas configurações incluem o nome do barema para exportação, o período de ano a ser considerado para a análise, a importação de um arquivo CSV contendo os critérios de avaliação e as classificações Qualis atribuídas a cada publicação</p>
      </div>

              <div className="flex gap-4 items-center">
                <p className="text-gray-400  flex items-center gap-2">
                Nome do barema:
              <input
                  type="text"
                  min="0" max="100"
                  className="hover:border-blue-400 transition-all border-[1px] min-w-[350px]  bg-white  border-gray-300 flex h-12 items-center px-4 text-gray-400 rounded-md text-xs font-bold  outline-none"
                  
                  
                />
                </p>

              <label for="fileInput" onChange={handleFileInputChange} className="rounded-lg w-fit cursor-pointer hover:bg-blue-100 px-4 h-12 border-gray-300 border flex items-center justify-center gap-3 hover:border-blue-400 transition-all text-gray-400 hover:text-blue-400"><input id="fileInput" type="file" accept=".csv" hidden/><DownloadSimple size={16} className="" />Importar arquivo .csv com barema</label>
              <label for="fileInputLattesId" onChange={handleFileInputChangeLattesId} className="rounded-lg w-fit cursor-pointer hover:bg-blue-100 px-4 h-12 border-gray-300 border flex items-center justify-center gap-3 hover:border-blue-400 transition-all text-gray-400 hover:text-blue-400"><input  id="fileInputLattesId" type="file" accept=".csv" hidden/><UserPlus size={16} className="" />Importar arquivo .csv com Id Lattes</label>
              </div>

              <div className="flex gap-8">
                <p className="text-gray-400  flex items-center gap-2">
                Será considerada APENAS as orientações em andamento e concluidas dos últimos
              <input
                  type="number"
                  min="0" max="100"
                  className="hover:border-blue-400 transition-all border-[1px] w-12 bg-white border-gray-300 flex h-10 items-center px-4 text-gray-400 rounded-md text-xs font-bold  outline-none"
                  value={ano}
                  
                />
                anos
                </p>

                <div className="w-[1px] bg-gray-300 h-12"></div>

              <p className="text-gray-400  flex items-center gap-2">
                Será considerada APENAS a produção dos últimos
              <input
                  type="number"
                  min="0" max="100"
                  className="hover:border-blue-400 transition-all border-[1px] w-12 bg-white border-gray-300 flex h-10 items-center px-4 text-gray-400 rounded-md text-xs font-bold  outline-none"
                  value={ano}
                  
                />
                anos
                </p>
              </div>
                <div className="flex gap-4 items-center">
                        <p className="text-gray-400  whitespace-nowrap">Selecione os qualis desejados</p>
                        <div className="gap-4 flex flex-wrap ">
                          {checkboxQualis}
                        </div>
                      </div>
      </div>
      </div>

      {/* Renderização dos blocos por categoria */}
      {categorias.map((categoriaPai) => (
        // Verifica se é uma sessão principal (critério pai == 0)
     

        <div className="mb-12">
        <div  className="z-[-999999] flex flex-col gap-4 w-full  p-12  bg-white border border-gray-300 rounded-t-2xl" key={categoriaPai.codigo} >
          {/* Título da categoria */}
          <div className="flex justify-between">
            <div>
              <h1 className="z-[999999] text-2xl mb-2 font-normal max-w-[750px] ">
                <strong className="bg-blue-400 text-white font-normal">{' '}</strong> 
              </h1>
              <p className="text-gray-400 mb-8">
              dd
            </p>
            </div>
            <div  onClick={() => setIsCloseHidden(!isCloseHidden)} className=" button-to-toggle z-[999] text-gray-400 cursor-pointer rounded-full hover:bg-gray-100 h-[38px] w-[38px] transition-all flex items-center justify-center">
              {isCloseHidden == false ? (<CaretUp size={16} className="" />):(<CaretDown size={16} className="" />)}
            </div>
          </div>

          {/* Tabela para exibir os dados da categoria */}
          <div className={isCloseHidden ? 'hidden' : ''}>
            <div className="w-full grid grid-cols-4 mb-4">
              <p className="text-gray-400">Critérios</p>
              <p className="text-gray-400">Pontos</p>
              <p className="text-gray-400">Pontuação máxima</p>
              <p className="text-gray-400">Total</p>
            </div>

            <div className="w-full flex gap-4 flex-col">
            {dados[categoria].map((item, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 border-t pt-4 border-gray-300">
                  <div className="border-[1px] bg-white border-gray-300 flex h-10 items-center px-4 text-gray-400 rounded-md text-xs font-bold w-fit truncate overflow-ellipsis max-w-[100%]">{item.criterio}</div>
                  <div>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="hover:border-blue-400 transition-all border-[1px] bg-white border-gray-300 flex h-10 items-center px-4 text-gray-400 rounded-md text-xs font-bold w-fit outline-none"
                      value={item.pontos}
                      onChange={(e) => handleInputChange(index, 'pontos', e.target.value)}
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="hover:border-blue-400 transition-all border-[1px] bg-white border-gray-300 flex h-10 items-center px-4 text-gray-400 rounded-md text-xs font-bold w-fit outline-none"
                      value={item.quantidade}
                      onChange={(e) => handleInputChange(index, 'quantidade', e.target.value)}
                    />
                  </div>

                  <div className="flex gap-4 w-full overflow-x-auto element pb-2">
                    aquio
                  </div>
                </div>
              ))}

           
            </div>
          </div>
        </div>

        <div className="flex border py-6 gap-8 border-gray-300 px-12  rounded-b-2xl bg-gray-50 items-center justify-between ">
            
            {/* subtotal  */}
            <p className="text-gray-400 whitespace-nowrap  flex items-center gap-2">
              Subtotal (máximo a ser considerado
            <input
                type="number"
                min="0"
                className="border-[1px] w-12 bg-white border-gray-300 flex h-10 items-center px-4 text-gray-400 rounded-md text-xs font-bold  outline-none"
               
                
              />
              pontos)
              </p>

              <div className="flex gap-4 w-full overflow-x-auto element pb-2">
              aqui2
              </div>
              

          </div>
        </div>
      
      ))}
    </div> 

    <div className="z-[-999999] mb-12 justify-center flex flex-col items-center gap-4 w-full  p-12  bg-white border border-gray-300 rounded-2xl">
    <h1 className=" w-full text-4xl text-center mb-4 font-normal max-w-[750px]  py-12 ">

      <strong className="bg-green-400 text-white font-normal">
      Resultado
      </strong>{" "}
      e classificação dos pesquisadores
      </h1>

      <div className="flex flex-col gap-4 w-full">
      <div className="w-full grid grid-cols-3 mb-4">
              <p className="text-gray-400">Ranking</p>
              <div className="text-gray-400 grid grid-cols-4 gap-4">
              <p className="text-gray-400 truncate">Titulação ou estágio de estudo e pesquisa</p>
              <p className="text-gray-400 truncate">Produção Bibliográfica</p>
              <p className="text-gray-400 truncate">Formação de recursos humanos</p>
              <p className="text-gray-400 truncate">Participação de Eventos</p>
              </div>
              <p className="text-gray-400 text-right">Pontuação total</p>
            </div>

            {researcher.map((props, index) => {
  // Titulação ou estágio de estudo e pesquisa
 

  return (
    <div
      className="group grid grid-cols-3 gap-4 w-full transition-all pr-4 border-[1px] bg-white border-gray-300  h-20 items-center text-gray-400 rounded-md text-xs font-bold"
      key={props.id} // Certifique-se de adicionar uma chave única para cada item na lista
    >
      <div className="flex gap-4 items-center h-full">
        <div className="p-4 w-20 flex justify-center rounded-l-md h-full items-center bg-gray-50 text-lg">{index + 1}</div>
        <div className="w-20 h-20 p-3">
          <div
            className="rounded-md w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(http://servicosweb.cnpq.br/wspessoa/servletrecuperafoto?tipo=1&id=${props.lattes_10_id}) ` }}
          ></div>
        </div>

        <div className="text-base font-medium truncate">{props.name}</div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        aqui 3
      </div>

      <div className="flex justify-end">
        <div className="border-[1px] bg-blue-400 border-gray-300 flex h-10 items-center px-4 text-white rounded-md text-xs font-bold w-fit">
     pontos
        </div>
      </div>
    </div>
  );
})}

      </div>
      
    </div>  

    <div className="z-[-999999] justify-center flex flex-col items-center gap-4 w-full  p-12  bg-white border border-gray-300 rounded-2xl">
    <h1 className=" w-full text-4xl text-center mb-4 font-normal max-w-[750px]  py-12 ">

    <strong className="bg-green-400 text-white font-normal">
    Gráfico
    </strong>{" "}
    de pontuação total e ranking
    </h1>

    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
    </div>
           
    </div>
           </div>
        </div>
    )
}