
import Highcharts from 'highcharts';
import Highmaps from 'highcharts/highmaps';
import HighchartsAccessibility from 'highcharts/modules/accessibility';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsOfflineExporting from 'highcharts/modules/offline-exporting';

import { UserContext } from '../contexts/context'
import { useEffect, useState, useContext } from "react";

// Initialize Highcharts modules
HighchartsAccessibility(Highcharts);
HighchartsExporting(Highcharts);
HighchartsOfflineExporting(Highcharts);

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
  instituicao: string
  url_image: string
  region: string
  sigla: string
  latitude: string
  longitude: string
}

// Importar dados GeoJSON do Brasil
import brazilStatesGeoJSON from './br_states.json'; // Substitua pelo caminho correto

function BrasilMap() {
  const { urlGeral, setUrlGeral } = useContext(UserContext);
  const { idGraduateProgram, setIdGraduateProgram } = useContext(UserContext);
  const [graduatePrograms, setGraduatePrograms] = useState<GraduateProgram[]>([]);

  const { estadoSelecionado, setEstadoSelecionado } = useContext(UserContext);
  const [selectedGraduateProgramId, setSelectedGraduateProgramId] = useState<string | null>(null);
  
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

  console.log(urlGraduateProgram)

  // UseEffect para inicializar o gráfico quando o componente for montado
  useEffect(() => {
    // Assumindo que você já tenha os dados dos programas de pós-graduação em graduatePrograms

// Crie um objeto para armazenar a contagem de programas por estado
const stateProgramCount: Record<string, number> = {};

// Mapeie os programas e conte-os por estado
graduatePrograms.forEach(program => {
  const state = program.state;
  if (stateProgramCount[state]) {
    stateProgramCount[state] += 1;
  } else {
    stateProgramCount[state] = 1;
  }
});

// Agora você pode criar o array brazilStateData com base na contagem
const brazilStateData = Object.entries(stateProgramCount).map(([state, count]) => [state, count]);

// Ordenar o array por estado (opcional)
brazilStateData.sort((a, b) => a[0].localeCompare(b[0]));
    // Inicialize o gráfico
    const chart = Highmaps.mapChart('container', {
      chart: {
        map: brazilStatesGeoJSON,
        backgroundColor: 'transparent',
        zoom: 2, // Defina o zoom global do mapa aqui
        panning: true, // Permitir arrastar o mapa
        paddingLeft: '300px',
        center: [150, 50], // Defina a longitude e latitude do centro do mapa
      },
      title: {
        text: '',
      },
      credits: {
        enabled: false,
      },
      events: {
        load: function () {
          // Ajustar o zoom inicial
          this.mapZoom(2); // Defina o zoom inicial para 200%
  
          // Ajustar a posição inicial
          const chart = this;
          const projection = chart.projection;
  
          // Ajuste a posição inicial aqui
          const x = projection.lon2px(150); // Substitua pela longitude desejada
          const y = projection.lat2px(50); // Substitua pela latitude desejada
  
          chart.mapZoom(200); // Defina o zoom inicial para 200%
          chart.mapNavigation.setPosition({
            x: x,
            y: y,
          });
        },
      },
       mapNavigation: {
        enabled: true,
        buttonOptions: {
          verticalAlign: 'bottom',
          horizontalAlign: 'bottom',
        },
      },
   
      legend: {
        enabled: false, // Defina esta propriedade como false para remover a legenda
      },
      colorAxis: {
        tickPixelInterval: 100,
      },
      series: [
        {
          type: 'map',
          data: brazilStateData,
          keys: ['PK_sigla', 'value'],
          joinBy: 'PK_sigla',
          
       
          // Habilitar drilldown para estados
          allowPointSelect: false,
          cursor: 'pointer',
          tooltip: {
            enabled: false, // Desativar o popup de hover
          },
          point: {
            events: {
              // Lidar com o evento de clique para os estados
              click: function () {
                const state = this.options['PK_sigla']; // Obter o código do estado
                // Implementar lógica de zoom ou drilldown aqui

                if (stateProgramCount[state] === 1) {
                  
                  // Procurar pelo programa de pós-graduação com o estado correspondente e obter o ID
                  const programWithState = graduatePrograms.find(program => program.state === state);
                  if (programWithState) {
                
                    const programId = programWithState.graduate_program_id;
                    console.log('aq porra')
                    // Definir o ID do programa selecionado em selectedGraduateProgramId
                    setIdGraduateProgram(programId);
                    console.log(idGraduateProgram)
                  }
                }

                setEstadoSelecionado(state);

                if (stateProgramCount[state] > 1) {
                  setIdGraduateProgram('0');
                }
           
                // Por exemplo, você pode atualizar o gráfico com dados detalhados para o estado clicado
                console.log(`Estado clicado: ${state}`);
                // Dar zoom no estado clicado
               
              },
            },

            
          },
          
          center: [150, 50], // Defina o centro do mapa
          zoom: 2, // Defina o zoom inicial para 200%
        },
      ],
    });


    // Limpar o gráfico quando o componente for desmontado
    return () => {
      chart.destroy();
    };
  }, [graduatePrograms]); // O array vazio garante que o useEffect seja executado apenas uma vez na montagem

  return <div className='w-full h-[100%] absolute ' id="container" />;
}

export default BrasilMap;
