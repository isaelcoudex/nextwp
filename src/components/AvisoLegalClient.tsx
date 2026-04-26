"use client";
import { useEffect, useState } from "react";

export default function AvisoLegalClient() {
  const [siteHost, setSiteHost] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setSiteHost(window.location.origin);
    }
  }, []);

  return (
    <div className="bg-slate-100 border border-slate-200 rounded-lg p-4 mb-8 text-xs text-slate-600 text-left max-w-3xl mx-auto" style={{ whiteSpace: 'pre-line' }}>
      <strong>Aviso Legal</strong>
      {`

Sob nenhuma circunstância vamos exigir que você pague para liberar qualquer tipo de produto, incluindo cartões de crédito, empréstimos ou qualquer outra oferta. Se isso acontecer, entre em contato conosco imediatamente. Sempre leia os termos e condições do provedor de serviços, seja uma instituição financeira, órgão privado ou público e outros, com o qual você está entrando em contato. Nós ganhamos dinheiro com publicidade e quando indicamos alguns dos produtos apresentados neste site, ${siteHost}/ . Todas as publicações são baseadas em pesquisas quantitativas e qualitativas, e nossa equipe se esforça para ser a mais justa possível ao comparar opções concorrentes.

Informação sobre Anunciantes

Somos um site de conteúdo independente, objetivo e com suporte de publicidade. Para apoiar nossa capacidade de fornecer conteúdo gratuito aos nossos usuários, as recomendações que aparecem em nosso site podem ser de empresas das quais recebemos compensação de afiliado. Essa compensação pode afetar como, onde e em que ordem as ofertas aparecem em nosso site. Outros fatores, como nossos algoritmos proprietários e dados coletados, também podem afetar como e onde os produtos ou ofertas são colocados neste site. Nós não incluímos todas as ofertas financeiras ou de crédito disponíveis.

Nota Editorial

A compensação que recebemos de nossos parceiros afiliados não influencia as recomendações ou conselhos que nossa equipe de redatores fornece em nossos artigos nem afeta qualquer conteúdo do site. Embora trabalhemos arduamente para fornecer informações precisas e atualizadas que acreditamos que nossos usuários acharão relevantes, não garantimos que todas as informações fornecidas sejam completas e não fazemos representações ou garantias quanto à sua precisão ou aplicabilidade.`}
    </div>
  );
}
