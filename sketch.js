// Variável para armazenar a chave da API do TMDb
const apiKey = '1c8a0aae97ba0bde11c2f6b7cf5e1590';

// Função para buscar um filme recomendado com base na idade
async function buscarFilme() {
  // Limpa o conteúdo anterior
  document.getElementById('filme').innerHTML = '';

  // Obtém a idade digitada pelo usuário
  const idade = document.getElementById('idade').value;

  // Determina a categoria de filmes com base na idade
  let genero = '';
  if (idade <= 12) {
    genero = '16'; // Filmes infantis
  } else if (idade <= 18) {
    genero = '18'; // Filmes para adolescentes
  } else {
    genero = '35'; // Filmes para adultos
  }

  // Constrói a URL de consulta para obter um filme aleatório do gênero escolhido, excluindo filmes eróticos
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genero}&sort_by=popularity.desc&page=1`;

  try {
    // Faz a requisição à API do TMDb
    const response = await fetch(url);
    const data = await response.json();

    // Filtra os filmes para não incluir aqueles com gênero "Erotic"
    const filmesFiltrados = data.results.filter(filme => !filme.genre_ids.includes(9598));

    // Se não houver filmes após o filtro, exibe uma mensagem
    if (filmesFiltrados.length === 0) {
      document.getElementById('filme').innerHTML = '<p>Nenhum filme encontrado.</p>';
      return;
    }

    // Obtém um filme aleatório da lista de resultados filtrados
    const filmeSelecionado = filmesFiltrados[Math.floor(Math.random() * filmesFiltrados.length)];

    // Obtém informações detalhadas do filme selecionado
    const detalhesUrl = `https://api.themoviedb.org/3/movie/${filmeSelecionado.id}?api_key=${apiKey}&language=pt-BR`;

    const detalhesResponse = await fetch(detalhesUrl);
    const detalhesData = await detalhesResponse.json();

    // Exibe as informações do filme recomendado
    const filmeElement = document.getElementById('filme');

    // Monta o HTML com título, sinopse, avaliação e poster (limitado a 250px de largura)
    filmeElement.innerHTML = `
      <h2>${filmeSelecionado.title}</h2>
      <div class="filme-info">
        <div class="poster">
          <img src="https://image.tmdb.org/t/p/w500/${filmeSelecionado.poster_path}" alt="Poster de ${filmeSelecionado.title}">
        </div>
        <div class="detalhes">
          <p id="sinopse"><strong>Sinopse:</strong></p>
          <p>${detalhesData.overview}</p>
          <p><strong>Avaliação:</strong> ${filmeSelecionado.vote_average}/10 (${filmeSelecionado.vote_count} votos)</p>
        </div>
      </div>
    `;

  } catch (error) {
    console.error('Erro ao buscar filme:', error);
  }
}