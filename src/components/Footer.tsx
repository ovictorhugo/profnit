import React, { useEffect, useState } from 'react';

export function Footer() {
  const [dataModificacao, setDataModificacao] = useState('');

  useEffect(() => {
    const dataAtual = new Date();
    const dataFormatada = `${dataAtual.getDate()}/${dataAtual.getMonth() + 1}/${dataAtual.getFullYear()}`;

    setDataModificacao(dataFormatada);
  }, []);

  return (
    <div className="w-full h-8 bg-white border-t-[1px] border-t-gray-300 fixed bottom-0 left-0 z-[9999] justify-between flex">
      <div className="flex items-center h-full px-12 ">
        <p className="text-[12px] text-gray-400 font-bold md:flex hidden">Informações Analíticas da Pós-Graduação | versão 1.0.1 (beta)</p>
      </div>

      <div className="flex items-center h-full px-12 ">
        <p className="text-[12px] text-gray-400 font-bold flex">Atualizado em {dataModificacao}</p>
      </div>
    </div>
  )
};