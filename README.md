<h1 align="center">🥗 Projeto Nutricionista</h1>

<p align="center">
  <b>Aplicativo desktop para gerenciamento nutricional</b>  
  <br>
  <i>Desenvolvido como parte da disciplina <b>Projeto Temático 2</b></i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Framework-Vue.js_3-42b883?style=for-the-badge&logo=vue.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Desktop-ElectronJS-47848F?style=for-the-badge&logo=electron&logoColor=white" />
  <img src="https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Database-MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
</p>

---

## 🧩 Sobre o Projeto

O **Projeto Nutricionista** é uma aplicação **desktop multiplataforma** desenvolvida para **auxiliar nutricionistas** no gerenciamento de pacientes, planos alimentares e acompanhamento de progresso.

Construído com **ElectronJS** e **Vue.js**, o sistema oferece uma interface moderna e intuitiva, enquanto o backend em **Node + TypeScript**, estruturado em **Arquitetura Limpa**, garante escalabilidade e manutenibilidade.  
A comunicação entre frontend e backend ocorre via **IPC (Inter-Process Communication)**, eliminando a necessidade de uma API REST.

---

## ✨ Funcionalidades Principais

✅ Cadastro, edição e exclusão de pacientes  
✅ Registro de consultas e planos alimentares personalizados  
✅ Cálculo automático de IMC e acompanhamento de evolução corporal  
✅ Armazenamento seguro de dados no **MongoDB Atlas**  
✅ Execução local via **ElectronJS**  
✅ Backend modular com **Arquitetura Limpa**  
✅ Comunicação via **IPC (sem servidor externo)**  

---

## 🧠 Arquitetura & Tecnologias

| Camada | Tecnologias / Conceitos |
|--------|--------------------------|
| 🖥️ **Frontend** | Vue.js 3 • Vite • TailwindCSS • Electron Renderer |
| ⚙️ **Backend** | Node.js • TypeScript • Clean Architecture |
| ☁️ **Banco de Dados** | MongoDB Atlas |
| 🔄 **Comunicação** | Electron IPC |
| 🧩 **Ferramentas** | GitHub • ESLint • Prettier • npm |

---

## 🔄 Ciclo de Desenvolvimento

> O projeto foi desenvolvido seguindo **boas práticas de engenharia de software**, com foco em separação de responsabilidades e organização modular.

**Etapas do desenvolvimento:**
1. 📋 Levantamento e análise de requisitos  
2. 🧱 Modelagem de entidades e camadas da arquitetura  
3. ⚙️ Implementação do backend com **Arquitetura Limpa**  
4. 🎨 Criação do frontend em **Vue.js** com integração IPC  
5. 🧩 Integração e testes de comunicação  
6. 💾 Conexão com **MongoDB Atlas**  
7. 🧪 Testes e refinamentos finais  

---

## 👨‍💻 Autores

| Nome            | Função        |
| --------------- | ------------- |
| Artur Benedetti | Desenvolvedor |
| Felipe Modena   | Desenvolvedor |
| Guilherme Frank | Desenvolvedor |
| Henrique Jacobi | Desenvolvedor |

---

<details>
<summary>⚙️ <b>Como executar o projeto</b></summary>

### 🧾 Pré-requisitos

- **Node.js** v18+
- **npm** v9+
- Conta no **MongoDB Atlas**
- **Git** instalado

### ▶️ Passos

```bash
# 1️⃣ Clonar o repositório
git clone https://github.com/usuario/projeto-nutricionista.git

# 2️⃣ Instalar dependências do backend
cd backend
npm install

# 3️⃣ Instalar dependências do Electron
cd ../electron
npm install

# 4️⃣ Instalar dependências do frontend
cd ../frontend
npm install

# 5️⃣ Rodar o frontend (que inicializa o ambiente)
npm run dev
```

🧠 A comunicação entre as camadas ocorre via IPC, portanto não é necessário expor nenhuma API HTTP.
O sistema roda completamente de forma local e isolada.

</details>

## 🔌 Comunicação Front ↔ Back (IPC)

A integração entre frontend e backend utiliza o mecanismo IPC do Electron, permitindo a troca de dados sem servidor HTTP intermediário.
```Vue (frontend) → canal IPC → Node (backend) → MongoDB Atlas```

<p align="center"> Feito com ❤️ por Artur, Felipe, Guilherme e Henrique. </p>

