import React, { useContext, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { UserContext } from "../contexts/context";
import { ArrowRight, BookmarkSimple, GraduationCap, MagnifyingGlass, MapPin, Star, X } from "phosphor-react";
import { Link } from "react-router-dom";
import { Circle } from "./Circle";
import DropdownMultiSelect from "./DropdownMultiSelect";
import { SvgLines } from "./SvgLines";

import logo_1 from '../assets/logo_1.png';
import logo_2 from '../assets/logo_2.png';
import logo_3 from '../assets/logo_3.png';
import logo_4 from '../assets/logo_4.png';
import logo_5 from '../assets/logo_5.png';

interface GraduateProgram {
  area: string;
  code: string;
  graduate_program_id: string;
  modality: string;
  name: string;
  rating: string;
  type: string;
  city: string
  state: string
}

interface GraphNode extends GraduateProgram {
  x: number | undefined;
  y: number | undefined;
}

interface GraphLink {
  source: string;
  target: string;
}

interface Graph {
  nodes: GraphNode[];
  links: GraphLink[];
}

export function MapProfnit() {
  const { urlGeral, setUrlGeral } = useContext(UserContext);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [graduatePrograms, setGraduatePrograms] = useState<GraduateProgram[]>([]);
  const [selectedGraduateProgramId, setSelectedGraduateProgramId] = useState<string | null>(null);
  const [isSimulationRunning, setIsSimulationRunning] = useState<boolean>(true);

  const { idGraduateProgram, setIdGraduateProgram } = useContext(UserContext)

  function handleClick(name: string) {
    setIdGraduateProgram(name);
  }
  

  const urlGraduateProgram = `${urlGeral}/graduate_program_profnit`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(urlGraduateProgram, {
          mode: "cors",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "3600",
            "Content-Type": "text/plain",
          },
        });
        const data = await response.json();
        if (data) {
          setGraduatePrograms(data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [urlGraduateProgram]);

  useEffect(() => {

    const COLORS = ["#238536", "#FFCF00", "#173DFF"];

function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * COLORS.length);
  return COLORS[randomIndex];
}
    const width = window.innerWidth; // Largura máxima igual à largura da janela
    const height = window.innerHeight; // Altura igual à altura da janela

    const graph: Graph = {
        nodes: graduatePrograms.map((program, index) => ({
          ...program,
          x: Math.random() * width,
          y: Math.random() * height,
          color: getRandomColor(), // Atribui uma cor aleatória a cada nó
        })),
        links: [],
      };

    // Criar links com base em programas que compartilham a mesma área
    graduatePrograms.forEach((programA, indexA) => {
      graduatePrograms.forEach((programB, indexB) => {
        if (programA.area === programB.area && indexA !== indexB) {
          graph.links.push({
            source: programA.graduate_program_id,
            target: programB.graduate_program_id,
          });
        }
      });
    });

    const svg = d3.select(svgRef.current)
      .attr("width", "100%") // Define a largura como 100% da largura máxima
      .attr("height", "100vh"); // Define a altura como 100vh

    const simulation = d3
      .forceSimulation<GraphNode, GraphLink>(graph.nodes)
      .force("charge", d3.forceManyBody().strength(0))
      .force("center", d3.forceCenter(width / 2, height / 2))
     
      .force("link", d3.forceLink(graph.links).id((d) => d.graduate_program_id))
      .alphaDecay(0) // Reduza a taxa de decaimento alpha
      .on("tick", () => {
        link
          .attr("x1", (d: GraphLink) => (d.source as GraphNode).x || 0)
          .attr("y1", (d: GraphLink) => (d.source as GraphNode).y || 0)
          .attr("x2", (d: GraphLink) => (d.target as GraphNode).x || 0)
          .attr("y2", (d: GraphLink) => (d.target as GraphNode).y || 0);
      
        node.attr("cx", (d: GraphNode) => d.x || 0).attr("cy", (d: GraphNode) => d.y || 0);

       
      });

      function tick() {
        // Restante do código relacionado ao tick
        if (isSimulationRunning) {
          simulation.alpha(0.1).restart(); // Reinicie a simulação se estiver em execução
        }else {
            simulation.alphaTarget(0); // Reduza o alphaTarget para acelerar a simulação em standby
          }
          // ... (outros códigos relacionados ao tick)
          requestAnimationFrame(tick);
      }

      // Inicie o loop de animação
    requestAnimationFrame(tick);

     // Detectar quando a guia está em standby
     document.addEventListener("visibilitychange", () => {
        setIsSimulationRunning(document.visibilityState === "visible");
      });

      

    const link = svg
      .selectAll("line")
      .data(graph.links)
      .enter()
      .append("line")
      .attr("stroke", "#999")
      .attr("stroke-width", 1);

      const node = svg
      .selectAll("circle")
      .data(graph.nodes)
      .enter()
      .append("circle")
      .attr("r", 10)
      .attr("fill", "#174EA6")
      .attr("cursor", "pointer")
      .call(
        d3
          .drag()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.9).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      )
      .on("click", (event, d) => {
        simulation.alpha(0.3).restart();
        setSelectedGraduateProgramId(d.graduate_program_id);
        console.log(`Nó clicado: ${d.name}`);
      })
      .on("mouseover", (event, d) => {
        d3.select(event.currentTarget).attr("fill", "#238536"); // Mudar a cor ao passar o mouse
      })
      .on("mouseout", (event, d) => {
        d3.select(event.currentTarget).attr("fill", "#174EA6"); // Restaurar a cor quando o mouse sai
      });
    
  


    node.append("title").text((d) => d.name);
  }, [graduatePrograms]);

  //OUTRA LÓGICAAAA

  const toggleButtonOff = () => {
    setSelectedGraduateProgramId("0");
  };

  //pesquisa

  const [filterValue, setFilterValue] = useState("");
  const filteredResults = graduatePrograms.filter(props =>
    props.name.toUpperCase().includes(filterValue.toUpperCase())
  );

  const estadosBrasileiros= [
    'Acre',
    'Alagoas',
    'Amapá',
    'Amazonas',
    'Bahia',
    'Ceará',
    'Distrito Federal',
    'Espírito Santo',
    'Goiás',
    'Maranhão',
    'Mato Grosso',
    'Mato Grosso do Sul',
    'Minas Gerais',
    'Pará',
    'Paraíba',
    'Paraná',
    'Pernambuco',
    'Piauí',
    'Rio de Janeiro',
    'Rio Grande do Norte',
    'Rio Grande do Sul',
    'Rondônia',
    'Roraima',
    'Santa Catarina',
    'São Paulo',
    'Sergipe',
    'Tocantins'
  ];

   //
   const [isOpen, setIsOpen] = useState(false);
   const dropdownRef = useRef<HTMLDivElement>(null);
   const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

   

  return (
    <div className="">

      <div className="backgroundGradient opacity-70 h-screen w-full backdrop-blur-lg absolute top-0 z-[-9999]">
      </div>

      <div className="h-screen absolute right-0"><SvgLines/></div>
      <div>
      <svg
        ref={svgRef}
        width="800"
        height="600"
        className=" p-0 m-0 absolute top-0 "
      ></svg>
      </div>

      <div className="px-6 md:px-16 flex justify-center h-screen flex-col">
        <div className="h-[350px] absolute z-[-9] ml-16 "><Circle/></div>
      <h1 className="text-5xl mb-4 font-medium max-w-[750px] "><strong className="bg-blue-400 text-white font-normal">Escolha um programa</strong> e veja o que a plataforma filtra para você.</h1>
          <p className="max-w-[620px]  text-lg text-gray-400">Arraste ou clique em um dos pontos no gráfico para selecionar o programa de pós-graduação. Você também pode escolher pela lista abaixo </p>

          <div className="max-w-[700px] flex gap-3 items-center mt-6 z-[999999]">
            <DropdownMultiSelect options={estadosBrasileiros} selectedOptions={selectedOptions} setSelectedOptions={setSelectedOptions} />
          <div className="flex  items-center  justify-center h-10 border-gray-300 border-[1px] rounded-lg bg-white hover:border-blue-400">
                        <MagnifyingGlass size={20} className={`text-gray-400 min-w-[52px] `} />
                        <input
                          type="text"
                          value={filterValue}
                          onChange={e => setFilterValue(e.target.value)}
                          placeholder="Nome da instituição"
                          className="w-full outline-none text-sm"
                        />
                      </div>

                      <Link to={"/result"} className="w-fit h-10 whitespace-nowrap flex items-center gap-4 bg-blue-400 text-white rounded-full px-6 py-2 justify-center hover:bg-blue-500 text-base font-medium transition">
                        <ArrowRight size={16} className="text-white" /> Avançar
                    </Link>
          </div>

          
      </div>

      <div className=" flex  rounded-md z-[-99] bg-opacity-80 flex-wrap gap-6 mt-8 fixed bottom-10 px-6 md:px-16">
                                      <img src={logo_1} className=" relative w-auto h-12"/>
                                      <img src={logo_2} className=" relative w-auto h-12"/>
                                      <img src={logo_3} className=" relative w-auto h-12"/>
                                      <img src={logo_5} className=" relative w-auto h-12"/>
                                      <img src={logo_4} className=" relative w-auto h-12"/>
                                      
                                  </div>

      <div className="h-screen fixed top-0 right-0 pr-16 py-32">
      {graduatePrograms.map(props => {
         if (props.graduate_program_id === selectedGraduateProgramId) {
              return (
                <li
                  key={props.graduate_program_id}
                  className=" checkboxLabel group transition-all list-none h-full inline-flex group w-[350px]"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <label className={`justify-between w-full p-6 flex-col cursor-pointer border-[1px] bg-white bg-opacity-70 backdrop-blur-sm border-gray-300 flex text-gray-400 rounded-md text-xs font-bold hover:border-blue-400 `}>
                    <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                    <div className="border-[1px] border-gray-300 py-2 flex px-4 text-gray-400 rounded-md text-xs font-medium w-fit ">{props.area}</div>
                    <div onClick={toggleButtonOff} className={`cursor-pointer rounded-full hover:bg-gray-100 h-[38px] w-[38px] transition-all flex items-center justify-center `}>
                        <X size={24} className={'rotate-180 transition-all text-gray-400'} />
                        </div>
                     
                    </div>
                      <span className=" whitespace-normal text-base text-gray-400 mb-2 font-bold">{props.name}</span>
                      <p className="font-medium">{props.code}</p>

                      <div className="flex gap-3 items-center text-base mt-8 font-medium ">
                      <MapPin size={20} className="textwhite" /> {props.city}
                      </div>

                      <div className="flex gap-2 mt-8 flex-wrap">
                      {props.type.split(';').map((value, index) => {
                        const ratingValues = props.rating.split(';');
                        const ratingDoutorado = ratingValues[0]; // Valor correspondente a DOUTORADO
                        const ratingMestrado = ratingValues[1]; // Valor correspondente a MESTRADO

                        return (
                          <div
                            key={index}
                            className={`py-2 px-4 text-white w-fit rounded-md text-xs font-bold flex gap-2 items-center ${value.includes('MESTRADO') ? 'bg-blue-200' : 'bg-blue-300'
                              }`}
                          >
                            <GraduationCap size={12} className="textwhite" />
                            {value.trim()}
                            <p className=" flex gap-2 items-center"><Star size={12} className="textwhite" /> {props.type.split(';').length == 2 ? (value.includes('MESTRADO') ? ratingMestrado : ratingDoutorado) : (props.rating)}</p>
                          </div>
                        );
                      })}

                      <div className="bg-blue-400 py-2 px-4 text-white rounded-md text-xs font-bold flex gap-2 items-center">
                        <BookmarkSimple size={12} className="textwhite" />
                        {props.modality}
                      </div>
                    </div>
                    </div>

                    <div>
                    <Link to={"/result"} className="w-full whitespace-nowrap flex items-center gap-4 bg-blue-400 text-white rounded-full px-6 py-2 justify-center hover:bg-blue-500 text-base font-medium transition">
                        <ArrowRight size={16} className="text-white" /> Avançar
                    </Link>
                    </div>


                    <input
                      type="checkbox"
                      name={props.name}
                      className="absolute hidden group"
                      onClick={() => handleClick(props.graduate_program_id)}
                      id={props.name}

                    />
                  </label>
                </li>
              )
                    }
            })}
      </div>
    </div>
  );
}
