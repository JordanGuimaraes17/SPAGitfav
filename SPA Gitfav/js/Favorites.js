import { GithubUser } from './GithubUser.js'
export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load() // Carrega os favoritos ao instanciar a classe
  }

  load() {
    // Carrega os favoritos do localStorage ou cria uma matriz vazia
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  } // Salva os favoritos no localStorage

  async add(username) {
    try {
      const userExists = this.entries.find(entry => entry.login === username) // Verifica se o usuário já está nos favoritos

      if (userExists) {
        throw new Error('Usuário já cadastrado') // Lança um erro se o usuário já existir nos favoritos
      }

      const user = await GithubUser.search(username) // Busca informações do usuário usando a classe GithubUser

      if (user.login === undefined) {
        throw new Error('Usuário não encontrado!') // Lança um erro se o usuário não for encontrado
      }

      this.entries = [user, ...this.entries] // Adiciona o usuário aos favoritos
      this.update() // Atualiza a visualização dos favoritos
      this.save() // Salva os favoritos atualizados no localStorage
    } catch (error) {
      alert(error.message) // Exibe uma mensagem de erro caso ocorra uma exceção
    }
  }

  delete(user) {
    // Filtra os favoritos, removendo o usuário fornecido

    const filteredEntries = this.entries.filter(
      entry => entry.login !== user.login
    )

    this.entries = filteredEntries // Atualiza a lista de favoritos com os favoritos filtrados
    this.update() // Atualiza a visualização dos favoritos
    this.save() // Salva os favoritos atualizados no localStorage
  }
}
// classe que vai criar a visualização e eventos do HTML
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root) // Chama o construtor da classe pai (Favorites) e passa o parâmetro 'root'

    this.tbody = this.root.querySelector('table tbody') // Obtém a referência ao elemento <tbody> dentro de uma tabela HTML
    // Verifica se o Local Storage está vazio e oculta o elemento addHide se necessário

    this.update() //Chama o método 'update', que atualiza a visualização dos favoritos na tabela
    this.onadd() // Chama o método 'onadd', que adiciona um evento de clique ao botão de adicionar favorito
    document.addEventListener('DOMContentLoaded', () => {
      this.load()
      if (this.entries.length === 0) {
        this.root.querySelector('.Favorites').classList.remove('hide') // Exibe o elemento addHide se não houver usuários
      } else {
        this.root.querySelector('.Favorites').classList.add('hide') // Oculta o elemento addHide se houver usuários
      }
    })
  }

  onadd() {
    const addButton = this.root.querySelector('.search button') // Obtém a referência ao botão de adicionar
    const addHide = this.root.querySelector('.Favorites')
    addButton.onclick = () => {
      // Define uma função de callback para o evento de clique no botão
      const { value } = this.root.querySelector('.search input') // Obtém o valor do campo de entrada de texto

      this.add(value) // Chama o método 'add' passando o valor do campo de entrada como argumento, para adicionar um favorito
      addHide.classList.add('hide')
    }
  }

  update() {
    this.removeAllTr() // Remove todas as linhas de favoritos antes de atualizar

    this.entries.forEach(user => {
      const row = this.createRow() // Cria uma nova linha para cada favorito
      // Preenche os elementos da linha com as informações do favorito
      row.querySelector(
        '.user img'
      ).src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = user.login
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers
      // Adiciona um evento de clique ao botão de remover!
      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Tem certeza que deseja deletar essa linha?')
        if (isOk) {
          this.delete(user) // Remove o favorito ao clicar no botão de remover
        }
      }

      this.tbody.append(row) // Adiciona a linha na tabela de favoritos
    })
    // Verifica se a lista de favoritos está vazia após a atualização
    if (this.entries.length === 0) {
      const addHide = this.root.querySelector('.Favorites')
      addHide.classList.remove('hide') // Exibe o elemento addHide
    }
  }

  createRow() {
    // Cria um elemento <tr> para representar uma linha

    const tr = document.createElement('tr')

    tr.innerHTML = `
      <td class="user">
        <img src="https://github.com/maykbrito.png" alt="Imagem de maykbrito">
        <a href="https://github.com/maykbrito" target="_blank">
          <p>Mayk Brito</p>
          <span>maykbrito</span>
        </a>
      </td>
      <td class="repositories">
        76
      </td>
      <td class="followers">
        9589
      </td>
      <td>
        <button class="remove">Remover</button>
      </td>
    ` // Preenche o conteúdo da linha com informações estáticas (a serem substituídas)

    return tr // Retorna a linha criada
  }

  removeAllTr() {
    // Remove todas as linhas da tabela
    this.tbody.querySelectorAll('tr').forEach(tr => {
      tr.remove()
    })
  }
}
