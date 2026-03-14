const btn = document.getElementById("menu-mobile-btn");
const menu = document.getElementById("menu-links");
const overlay = document.getElementById("overlay");

/* abrir / fechar menu */
function toggleMenu() {
  btn.classList.toggle("ativo");
  menu.classList.toggle("ativo");
  overlay.classList.toggle("ativo");
  document.body.classList.toggle("menu-aberto");
}

btn.addEventListener("click", toggleMenu);
overlay.addEventListener("click", toggleMenu);

/* fechar ao clicar em um link */
document.querySelectorAll(".menu-links a").forEach(link => {
  link.addEventListener("click", toggleMenu);
});

/* destacar página ativa */
const paginaAtual = location.pathname.split("/").pop();
document.querySelectorAll(".menu-links a").forEach(link => {
  if (link.getAttribute("href") === paginaAtual) {
    link.classList.add("ativo");
  }
});

const estadosInfo = {
  SP: {
    nome: "São Paulo",
    biomas: "Mata Atlântica e Cerrado",
    fauna: "Mico-leão-preto, tucano-de-bico-verde, jaguatirica, capivara",
    flora: "Pau-brasil, palmito-juçara, ipês, bromélias, quaresmeira",
    impactos: "Desmatamento histórico (restam apenas 17% da cobertura original), poluição urbana intensa, expansão urbana sobre áreas de preservação, poluição de rios",
  },

  RJ: {
    nome: "Rio de Janeiro",
    biomas: "Mata Atlântica",
    fauna: "Mico-leão-dourado, preguiça-de-coleira, sagui, papagaio-de-cara-roxa",
    flora: "Pau-brasil, jequitibá-rosa, orquídeas, bromélias, palmeiras",
    impactos: "Apenas 19% da vegetação original preservada, ocupação irregular em encostas, queimadas urbanas, poluição da Baía de Guanabara",
  },

  MG: {
    nome: "Minas Gerais",
    biomas: "Mata Atlântica, Cerrado e Caatinga",
    fauna: "Lobo-guará, tamanduá-bandeira, tatu-canastra, seriema, onça-parda",
    flora: "Ipê-amarelo, pequi, buriti, pau-ferro, canela-de-ema",
    impactos: "Mineração intensiva, desmatamento de 50% do Cerrado, erosão do solo, contaminação de rios por rejeitos de mineração",
  },

  BA: {
    nome: "Bahia",
    biomas: "Mata Atlântica, Caatinga e Cerrado",
    fauna: "Ararinha-azul, tatu-bola, sagui-de-wied, onça-pintada, papagaio-chauá",
    flora: "Pau-brasil, cactos, mandacaru, pequi, jatobá, aroeira",
    impactos: "Desmatamento para agricultura, monocultura de eucalipto, seca prolongada na Caatinga, perda de biodiversidade",
  },

  PE: {
    nome: "Pernambuco",
    biomas: "Mata Atlântica e Caatinga",
    fauna: "Tatu-bola, veado-catingueiro, sagui-de-tufo-branco, ararinha-azul (extinta na natureza)",
    flora: "Pau-brasil, cactos, xique-xique, mandacaru, ipê-roxo",
    impactos: "Desmatamento de 95% da Mata Atlântica original, desertificação na Caatinga, poluição do Rio Capibaribe",
  },

  AL: {
    nome: "Alagoas",
    biomas: "Mata Atlântica e Caatinga",
    fauna: "Peixe-boi-marinho, mutum-de-alagoas (extinto), muriqui, sagui",
    flora: "Pau-brasil, coqueiro, manguezais, mata ciliar",
    impactos: "Apenas 3% da Mata Atlântica preservada, cultivo de cana-de-açúcar, poluição de rios e lagoas",
  },

  SE: {
    nome: "Sergipe",
    biomas: "Mata Atlântica e Caatinga",
    fauna: "Sagui, tatu-peba, peixe-boi-marinho, tartarugas marinhas",
    flora: "Manguezais, coqueiros, pau-brasil, restinga",
    impactos: "Destruição de manguezais, poluição do Rio São Francisco, erosão costeira",
  },

  AM: {
    nome: "Amazonas",
    biomas: "Amazônia",
    fauna: "Onça-pintada, boto-cor-de-rosa, arara-azul-grande, preguiça, macaco-prego",
    flora: "Seringueira, castanheira, açaí, vitória-régia, mogno",
    impactos: "Desmatamento ilegal, garimpo, queimadas, biopirataria, ameaça a povos indígenas",
  },

  PA: {
    nome: "Pará",
    biomas: "Amazônia",
    fauna: "Harpia, jaguar, pirarucu, peixe-boi-amazônico, ariranha",
    flora: "Castanheira, açaí, seringueira, andiroba, mogno",
    impactos: "Um dos estados com maior desmatamento na Amazônia, grilagem de terras, mineração ilegal, conflitos agrários",
  },

  MT: {
    nome: "Mato Grosso",
    biomas: "Amazônia, Cerrado e Pantanal",
    fauna: "Onça-pintada, arara-azul, tamanduá-bandeira, capivara, jacaré",
    flora: "Ipê, pequi, buriti, palmeiras, vitória-régia",
    impactos: "Maior produtor de soja do Brasil com alto desmatamento, queimadas frequentes, poluição por agrotóxicos",
  },

  RO: {
    nome: "Rondônia",
    biomas: "Amazônia",
    fauna: "Macaco-aranha, tucano, harpia, onça-pintada, preguiça",
    flora: "Castanheira, seringueira, mogno, cedro, jatobá",
    impactos: "Alto índice de desmatamento, expansão da pecuária, queimadas, perda de mais de 30% da floresta original",
  },

  AC: {
    nome: "Acre",
    biomas: "Amazônia",
    fauna: "Onça-pintada, macaco-aranha, harpia, peixe-boi, tartaruga-da-amazônia",
    flora: "Seringueira, castanheira, açaí, pau-rosa, mogno",
    impactos: "Extração ilegal de madeira, biopirataria, avanço do desmatamento na fronteira com o Peru",
  },

  AP: {
    nome: "Amapá",
    biomas: "Amazônia",
    fauna: "Harpia, onça-pintada, peixe-boi-amazônico, macaco-aranha, boto",
    flora: "Castanheira, açaí, andiroba, pau-mulato, virola",
    impactos: "Garimpo ilegal de ouro, contaminação por mercúrio, pressão sobre terras indígenas",
  },

  RS: {
    nome: "Rio Grande do Sul",
    biomas: "Pampa e Mata Atlântica",
    fauna: "Capivara, graxaim, quero-quero, veado-campeiro, tuco-tuco",
    flora: "Gramíneas nativas, araucária, canela, timbaúva",
    impactos: "Conversão para agricultura (arroz e soja), pecuária intensiva, arenização do solo, perda de 64% dos campos nativos",
  },

  SC: {
    nome: "Santa Catarina",
    biomas: "Mata Atlântica",
    fauna: "Papagaio-de-cara-roxa, bugio-ruivo, leão-marinho, baleia-franca",
    flora: "Araucária, imbuia, canela, palmito-juçara, figueiras",
    impactos: "Restam apenas 23% da floresta original, poluição industrial, degradação de manguezais",
  },

  PR: {
    nome: "Paraná",
    biomas: "Mata Atlântica",
    fauna: "Onça-pintada, papagaio-de-cara-roxa, mico-leão-da-cara-preta, bugio",
    flora: "Araucária, imbuia, canela, palmito-juçara, ipê",
    impactos: "Apenas 8% da floresta com araucárias preservada, expansão agrícola, poluição de rios",
  },

  ES: {
    nome: "Espírito Santo",
    biomas: "Mata Atlântica",
    fauna: "Mico-leão-da-cara-dourada, papagaio-chauá, muriqui-do-sul, harpia",
    flora: "Pau-brasil, jequitibá, jacarandá, orquídeas, bromélias",
    impactos: "Restam cerca de 11% da cobertura original, monocultura de eucalipto, poluição industrial",
  },

  GO: {
    nome: "Goiás",
    biomas: "Cerrado",
    fauna: "Lobo-guará, tamanduá-bandeira, tatu-canastra, ema, seriema",
    flora: "Pequi, ipê-amarelo, buriti, baru, sucupira",
    impactos: "Mais de 50% do Cerrado destruído, monocultura de soja e milho, uso intensivo de agrotóxicos",
  },

  TO: {
    nome: "Tocantins",
    biomas: "Cerrado e Amazônia",
    fauna: "Arara-azul-grande, lobo-guará, tamanduá, onça-pintada, pato-mergulhão",
    flora: "Pequi, buriti, babaçu, ipê, baru",
    impactos: "Desmatamento para soja e pecuária, queimadas, impacto de hidrelétricas",
  },

  MS: {
    nome: "Mato Grosso do Sul",
    biomas: "Pantanal, Cerrado e Mata Atlântica",
    fauna: "Onça-pintada, arara-azul, jacaré, capivara, tuiuiú, ariranha",
    flora: "Ipê, palmeiras, vitória-régia, piúva, carandá",
    impactos: "Queimadas devastadoras no Pantanal, pecuária extensiva, poluição por agrotóxicos, perda de biodiversidade",
  },

  DF: {
    nome: "Distrito Federal",
    biomas: "Cerrado",
    fauna: "Lobo-guará, tamanduá, tatu, seriema, gavião-carijó",
    flora: "Pequi, ipê, buriti, sucupira, murici",
    impactos: "Expansão urbana acelerada, poluição de nascentes, impermeabilização do solo",
  },

  CE: {
    nome: "Ceará",
    biomas: "Caatinga",
    fauna: "Tatu-bola, veado-catingueiro, ararinha-azul (extinta na natureza), asa-branca",
    flora: "Cactos, mandacaru, xique-xique, jurema, aroeira",
    impactos: "Desertificação crescente, seca prolongada, desmatamento para lenha, sobrepastoreio",
  },

  RN: {
    nome: "Rio Grande do Norte",
    biomas: "Caatinga e Mata Atlântica",
    fauna: "Tartarugas marinhas, boto-cinza, tatu-bola, sagui",
    flora: "Cactos, manguezais, cajueiro, carnaúba",
    impactos: "Degradação de dunas, poluição de praias, extração de sal, desmatamento",
  },

  PB: {
    nome: "Paraíba",
    biomas: "Caatinga e Mata Atlântica",
    fauna: "Tatu-boi, sagui-de-tufo-branco, peixe-boi-marinho, ararinha-azul",
    flora: "Cactos, pau-brasil, manguezais, ipê-roxo",
    impactos: "Desertificação, poluição de rios, desmatamento, degradação de manguezais",
  },

  PI: {
    nome: "Piauí",
    biomas: "Caatinga e Cerrado",
    fauna: "Ararinha-azul, tatu-bola, veado-campeiro, seriema",
    flora: "Cactos, buriti, babaçu, carnaúba, pequi",
    impactos: "Desmatamento do Cerrado, queimadas, desertificação na Caatinga",
  },

  MA: {
    nome: "Maranhão",
    biomas: "Amazônia, Cerrado e Caatinga",
    fauna: "Guariba, papagaio-do-mangue, peixe-boi-marinho, onça-pintada",
    flora: "Babaçu, buriti, carnaúba, juçara,",
    impactos: "Desmatamento acelerado, queimadas, expansão da soja, degradação de manguezais",
  },

  RR: {
    nome: "Roraima",
    biomas: "Amazônia",
    fauna: "Harpia, onça-pintada, arara-vermelha, macaco-aranha, peixe-boi",
    flora: "Seringueira, castanheira, açaí, andiroba",
    impactos: "Garimpo ilegal em terras indígenas, desmatamento, contaminação de rios por mercúrio",
  },
};


document.addEventListener("DOMContentLoaded", () => {
  const states = document.querySelectorAll(".state")
  const infoBox = document.getElementById("info")
  const estadoNome = document.getElementById("estado-nome")
  const estadoInfo = document.getElementById("estado-info")
  const fecharInfo = document.getElementById("fechar-info")
  const container = document.querySelector(".container")

 fecharInfo.addEventListener("click", () => {
  infoBox.classList.remove("active")
  infoBox.classList.add("hidden")

  document.querySelectorAll(".state").forEach((state) => {
    state.classList.remove("active")
  })

  container.classList.remove("info-aberto")

  /* corrige o espaço que sobra */
  container.style.height = "auto"
  document.body.style.height = "auto"
})

  states.forEach((state) => {
    state.addEventListener("click", function (e) {
      e.preventDefault()

      states.forEach((s) => s.classList.remove("active"))
      this.classList.add("active")

      const stateId = this.getAttribute("data-state")
      const info = estadosInfo[stateId]

      if (info) {
        estadoNome.textContent = info.nome
        estadoInfo.innerHTML = `
          <h3>Biomas</h3>
          <p>${info.biomas}</p>
          
          <h3>Fauna Caracteristica</h3>
          <p>${info.fauna}</p>
          
          <h3>Flora Caracteristica</h3>
          <p>${info.flora}</p>
          
          <h3>Impactos Ambientais</h3>
          <p>${info.impactos}</p>
        `

        infoBox.classList.remove("hidden")
        infoBox.classList.add("active")
        if (container) container.classList.add("info-aberto")
      }
    })
  })
})
