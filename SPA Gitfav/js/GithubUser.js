export class GithubUser {
  static search(username) {
    const endpoint = `https://api.github.com/users/${username}` // Constrói o URL do endpoint da API do GitHub para buscar informações do usuário

    return fetch(endpoint) // Realiza uma requisição fetch para o endpoint
      .then(data => data.json()) // Converte a resposta em formato JSON
      .then(({ login, name, public_repos, followers }) => ({
        // Extrai as propriedades relevantes da resposta JSON
        login,
        name,
        public_repos,
        followers
      }))
  }
}
