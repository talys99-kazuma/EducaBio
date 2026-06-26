const biomasData = {
  'mata-transicao': {
    title: 'Mata de Transição',
    image: 'img/maranhao9.jpg',
    description: 'A Mata de Transição é uma área que apresenta características tanto da Floresta Amazônica quanto do Cerrado. Sua vegetação é diversificada, reunindo espécies dos dois biomas e formando uma importante faixa ecológica de conexão.',
    features: [
      'Presença abundante de palmeiras de babaçu e carnaúba',
      'Clima úmido com estação seca definida',
      'Grande diodiversidade de espécies',
      'Importante corredor ecológico',
      'Transição entre diferentes ecossistemas'
    ]
  },
  'cerrado': {
    title: 'Cerrado',
    image: 'img/maranhao10.jpg',
    description: 'O Cerrado maranhense é caracterizado por vegetação formada por árvores de pequeno porte, arbustos e gramíneas adaptadas ao clima quente e aos períodos de seca. Suas plantas possuem raízes profundas e troncos retorcidos, permitindo maior resistência às variações climáticas.',
    features: [
      'Vegetação de árvores baixas e retorcidas',
      'Presença de gramíneas e arbustos',
      'Raízes profundas e adaptação à seca',
      'Abriga nascentes de rios importantes',
      'Alta biodiversidade vegetal'
    ]
  },
  'campos': {
    title: 'Campos',
    image: 'img/maranhao11.jpg',
    description: 'Os Campos Maranhenses apresentam vegetação predominantemente herbácea, composta por gramíneas e plantas rasteiras. Essas áreas são frequentemente inundadas durante o período chuvoso.',
    features: [
      'Vegetação predominantemente herbácea',
      'Associados a planícies inundáveis',
      'Importante para aves migratórias',
      'Solo geralmente arenoso ou argiloso',
      'Áreas de pastagem natural'
    ]
  },
  'floresta-equatorial': {
    title: 'Floresta Equatorial',
    image: 'img/maranhao12.jpg',
    description: 'A Floresta Equatorial ocupa a porção oeste do Maranhão e apresenta vegetação densa, fechada e extremamente rica em biodiversidade. O ambiente úmido favorece o crescimento de árvores de grande porte e de diversas espécies vegetais.',
    features: [
      'Árvores de grande porte ultrapassando 40 metros de altura',
      'Vegetação densa e fechada',
      'Clima quente e úmido com elevada umidade',
      'Grande biodiversidade',
      'Presença de povos indígenas tradicionais',
    ]
  },

  'restinga': {
    title: 'Vegetação de Restinga',
    image: 'img/maranhao13.jpg',
    description: 'A Restinga ocorre ao longo do litoral maranhense em solos arenosos. Sua vegetação é resistente aos ventos fortes, à salinidade e às condições climáticas da zona costeira.',
    features: [
      'Vegetação adaptada a solos arenosos',
      'Plantas resistentes à salinidade',
      'Importante para fixação de dunas',
      'Habitat de espécies costeiras',
      'Proteção do litoral'
    ]
  },
    'manguezais': {
    title: 'Manguezais',
    image: 'img/maranhao14.jpg',
    description: 'Os manguezais maranhenses estão localizados nas áreas costeiras sujeitas à influência das marés. Sua vegetação é adaptada à água salobra e desempenha papel fundamental na proteção do litoral.',
    features: [
      'Vegetação adaptada à salinidade',
      'Solos lodosos e úmidos',
      'Influência das marés',
      'Berçário de espécies marinhas',
      'Proteção contra erosão costeira'
    ]
  }
};

const labelToKey = {
  'Mata de Transição': 'mata-transicao',
  'Cerrado': 'cerrado',
  'Campos': 'campos',
  'Floresta Equatorial': 'floresta-equatorial',
  'Manguezais': 'manguezais',
  'Vegetação de Restinga': 'restinga'
};

/* ---------- PAINEL INTERATIVO DE BIOMA ---------- */
function mostrarBioma(key) {
  const data = biomasData[key];
  if (!data) return;

  const titulo = document.getElementById('interativo-titulo');
  const descricao = document.getElementById('interativo-descricao');
  const imagem = document.getElementById('interativo-imagem');
  const features = document.getElementById('interativo-features');
  const card = document.getElementById('interativo-card');

  if (titulo) titulo.textContent = data.title;
  if (descricao) descricao.textContent = data.description;
  if (imagem) {
    imagem.src = data.image;
    imagem.alt = data.title;
  }
  if (features) {
    features.innerHTML = data.features.map(f => `<li>${f}</li>`).join('');
  }

  // Destaca a legenda ativa
  document.querySelectorAll('.legend-item-leaflet').forEach(item => {
    item.classList.toggle('active', item.dataset.bioma === key);
  });

  // Pequena animação de destaque
  if (card) {
    card.classList.remove('pulse');
    void card.offsetWidth;
    card.classList.add('pulse');
  }
}

document.addEventListener('DOMContentLoaded', function () {

  /* =========================================================
     MENU MOBILE / DROPDOWNS
  ========================================================= */
  const toggle = document.getElementById('mobile-profile-toggle');
  const menu = document.getElementById('mobile-profile-menu');
  const profileCard = document.getElementById('mobile-user-profile');

  if (toggle && menu) {
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      menu.classList.toggle('show');
      profileCard.classList.toggle('open');
    });
  }

  const btn = document.getElementById('menu-mobile-btn');
  const menuLinks = document.getElementById('menu-links');
  const overlay = document.getElementById('overlay');

  function toggleMenu() {
    btn?.classList.toggle('ativo');
    menuLinks?.classList.toggle('ativo');
    overlay?.classList.toggle('ativo');
    document.body.classList.toggle('menu-aberto');
  }

  btn?.addEventListener('click', toggleMenu);
  overlay?.addEventListener('click', toggleMenu);

  document.querySelectorAll('.menu-links a').forEach(link => {
    link.addEventListener('click', () => {
      if (menuLinks?.classList.contains('ativo')) toggleMenu();
    });
  });

  const paginaAtual = location.pathname.split('/').pop();
  document.querySelectorAll('.menu-links a').forEach(link => {
    if (link.getAttribute('href') === paginaAtual) {
      link.classList.add('ativo');
    }
  });

  document.addEventListener('click', function (e) {
    const userButton = document.getElementById('user-button');
    const desktopDropdown = document.getElementById('desktop-dropdown-menu');
    if (desktopDropdown && userButton && !userButton.contains(e.target) && !desktopDropdown.contains(e.target)) {
      desktopDropdown.classList.remove('show');
    }
    const card = document.getElementById('mobile-user-profile');
    const m = document.getElementById('mobile-profile-menu');
    if (card && !card.contains(e.target)) {
      m?.classList.remove('show');
      card.classList.remove('open');
    }
  });

  /* =========================================================
     LEGENDA -> PAINEL DE BIOMA
  ========================================================= */
  document.querySelectorAll('.legend-item-leaflet').forEach(item => {
    item.addEventListener('click', () => {
      const key = item.dataset.bioma;
      mostrarBioma(key);
      document.getElementById('bioma-interativo')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Mostra o primeiro bioma por padrão
  mostrarBioma('mata-transicao');

  /* =========================================================
     MAPA INTERATIVO (LEAFLET + GEOJSON) — NÃO ALTERAR LÓGICA
  ========================================================= */
  const infoBox = document.getElementById('infoBox');

  function getCentroid(feature) {
    const coords = feature.geometry.type === 'Polygon'
      ? feature.geometry.coordinates[0]
      : feature.geometry.coordinates[0][0];

    let x = 0, y = 0, count = 0;
    for (const [lon, lat] of coords) {
      x += lon;
      y += lat;
      count += 1;
    }
    return { lon: x / count, lat: y / count };
  }

  function classifyBioma(feature) {
    const { lon, lat } = getCentroid(feature);

    if (lon < -46.15) return { label: 'Floresta Equatorial', color: '#2e7d32' };
    if (lat < -4.35) return { label: 'Cerrado', color: '#9ccc65' };
    if (lon > -42.75) return { label: 'Vegetação de Restinga', color: '#1e88e5' };
    if (lat > -2.55) return { label: 'Manguezais', color: '#81d4fa' };
    if (lon < -44.25 && lat < -3.05) return { label: 'Campos', color: '#dce775' };

    if (lon >= -46.15 && lon <= -42.75 && lat >= -4.35 && lat <= -2.55) {
      return { label: 'Mata de Transição', color: '#7cb342' };
    }

    return { label: 'Mata de Transição', color: '#7cb342' };
  }

  const mapEl = document.getElementById('map');
  if (!mapEl) return;

  const map = L.map('map', {
    center: [-5.2, -45.5],
    zoom: 6,
    zoomControl: false,
    attributionControl: false,
    zoomSnap: 0,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    touchZoom: false,
    keyboard: false
  });

  map.createPane('background').style.background = '#0f172a';

  fetch('MA_Municipios_2025.json')
    .then(response => response.json())
    .then(data => {
      const allLayers = [];

      const layer = L.geoJSON(data, {
        style: (feature) => {
          const type = classifyBioma(feature);
          return {
            color: 'rgba(255, 255, 255, 0.6)',
            weight: 1.8,
            fillColor: type.color,
            fillOpacity: 0.95,
            lineCap: 'round',
            lineJoin: 'round'
          };
        },
        onEachFeature: (feature, currentLayer) => {
          const type = classifyBioma(feature);
          const biomeLabel = type.label;

          allLayers.push({ layer: currentLayer, biomeLabel });

          currentLayer.on('mouseover', function () {
            allLayers
              .filter(item => item.biomeLabel === biomeLabel)
              .forEach(item => {
                item.layer.setStyle({
                  weight: 2.4,
                  color: 'rgba(255, 255, 255, 1)',
                  fillOpacity: 0.99
                });
              });
            infoBox.innerHTML = `<strong>Bioma:</strong> ${biomeLabel}`;
          });

          currentLayer.on('mouseout', function () {
            allLayers
              .filter(item => item.biomeLabel === biomeLabel)
              .forEach(item => {
                item.layer.setStyle({
                  weight: 1.8,
                  color: 'rgba(255, 255, 255, 0.6)',
                  fillOpacity: 0.95
                });
              });
          });

          currentLayer.on('click', function () {
            infoBox.innerHTML = `<strong>Bioma predominante:</strong> ${biomeLabel}`;
            // Conecta o clique no mapa ao painel de biomas
            const key = labelToKey[biomeLabel];
            if (key) {
              mostrarBioma(key);
              document.getElementById('bioma-interativo')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          });
        }
      }).addTo(map);

      map.fitBounds(layer.getBounds());
    })
    .catch(err => {
      console.error('Erro ao carregar o GeoJSON:', err);
      infoBox.innerHTML = 'Não foi possível carregar o arquivo do mapa. Abra a página via um servidor local (por exemplo: python -m http.server).';
    });

  console.log('[v0] Página do Maranhão carregada com sucesso!');
});
