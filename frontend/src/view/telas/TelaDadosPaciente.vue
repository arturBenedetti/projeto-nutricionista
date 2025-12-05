<script setup>
import { ref, onMounted } from "vue";
import { loggedUser } from "../../services/UsuarioService";

function calcIMC() {
  if (localPaciente.value.peso && localPaciente.value.altura) {
    const peso = parseFloat(localPaciente.value.peso);
    const altura = parseFloat(localPaciente.value.altura) / 100;

    if (altura > 0) {
      const imc = peso / (altura * altura);
      localPaciente.value.imc = imc.toFixed(2);
      return;
    }
  }

  localPaciente.value.imc = "";
}

onMounted(() => {
  fetchData();
});

const localPaciente = ref({
  id: "",
  nome: loggedUser.value.name,
  email: loggedUser.value.email,
  sexo: loggedUser.value.sexo,
  dataNascimento: "",
  altura: "",
  peso: "",
  imc: "",
});

const imagensAgrupadas = ref([]);
const uploading = ref(false);
const fileInputRef = ref(null);

async function fetchData() {
  const response = await window.api.consultarDados({
    id: loggedUser.value.id,
  });

  localPaciente.value.id = response.id;
  localPaciente.value.nome = response.nome;
  localPaciente.value.email = response.email;
  localPaciente.value.sexo = response.sexo;
  localPaciente.value.dataNascimento =
    response.dataNascimento.toLocaleDateString("pt-BR");
  localPaciente.value.altura = response.altura;
  localPaciente.value.peso = response.peso;

  calcIMC();

  // Busca imagens após obter o id do paciente
  if (localPaciente.value.id) {
    await fetchImagens();
  }
}

async function fetchImagens() {
  try {
    // Aguarda o id do paciente estar disponível
    if (!localPaciente.value.id) {
      // Tenta buscar novamente após um pequeno delay
      setTimeout(() => {
        if (localPaciente.value.id) {
          fetchImagens();
        }
      }, 200);
      return;
    }

    const response = await window.api.listarImagensEvolucao({
      idPaciente: localPaciente.value.id,
    });

    if (response && Array.isArray(response)) {
      // Garante que as datas sejam tratadas corretamente após serialização
      const imagensProcessadas = response.map((grupo) => ({
        ...grupo,
        data: grupo.data || "",
        dataCompleta: grupo.dataCompleta
          ? new Date(grupo.dataCompleta)
          : new Date(grupo.data),
        imagens: (grupo.imagens || []).map((img) => ({
          ...img,
          date: img.date ? new Date(img.date) : new Date(),
          mimeType: img.mimeType || "image/jpeg",
          imageBase64: img.imageBase64 || "",
        })),
      }));
      imagensAgrupadas.value = imagensProcessadas;
    } else {
      imagensAgrupadas.value = [];
    }
  } catch (error) {
    console.error("Erro ao buscar imagens:", error);
  }
}

function formatarData(dataString) {
  const data = new Date(dataString);
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

async function handleFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;

  // Valida se é uma imagem
  if (!file.type.startsWith("image/")) {
    alert("Por favor, selecione apenas arquivos de imagem.");
    return;
  }

  // Valida tamanho (máximo 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert("A imagem deve ter no máximo 5MB.");
    return;
  }

  uploading.value = true;

  try {
    // Converte a imagem para base64
    const base64 = await fileToBase64(file);

    // Faz upload da imagem
    const sucesso = await window.api.uploadImagemEvolucao({
      idPaciente: localPaciente.value.id,
      imageBase64: base64,
      mimeType: file.type,
    });

    if (sucesso) {
      // Recarrega as imagens
      await fetchImagens();
      alert("Imagem enviada com sucesso!");
    } else {
      alert("Erro ao enviar imagem. Tente novamente.");
    }
  } catch (error) {
    console.error("Erro ao fazer upload da imagem:", error);
    alert("Erro ao enviar imagem. Tente novamente.");
  } finally {
    uploading.value = false;
    // Limpa o input
    if (fileInputRef.value) {
      fileInputRef.value.value = "";
    }
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // Remove o prefixo "data:image/...;base64,"
      const base64 = reader.result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getImageSrc(imagem) {
  if (!imagem) {
    return "";
  }

  if (!imagem.imageBase64) {
    console.warn("Imagem sem imageBase64:", imagem);
    return "";
  }

  // Garante que o base64 não tenha o prefixo data: já incluído
  let base64 = String(imagem.imageBase64).trim();

  // Se já tem o prefixo data:, remove
  if (base64.startsWith("data:")) {
    const parts = base64.split(",");
    if (parts.length > 1) {
      base64 = parts.slice(1).join(",");
    }
  }

  // Remove espaços em branco, quebras de linha e outros caracteres que podem ter sido adicionados durante serialização
  base64 = base64.replace(/\s/g, "").replace(/\n/g, "").replace(/\r/g, "");

  // Valida se o base64 não está vazio após limpeza
  if (!base64 || base64.length < 100) {
    console.warn("Base64 muito curto ou vazio:", base64.length);
    return "";
  }

  const mimeType = imagem.mimeType || "image/jpeg";
  const src = `data:${mimeType};base64,${base64}`;

  return src;
}

function handleImageError(event) {
  console.error("Erro ao carregar imagem");
  // Mostra um placeholder quando a imagem falha
  const placeholder =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5FcnJvIGFvIGNhcnJlZ2FyPC90ZXh0Pjwvc3ZnPg==";
  if (event.target.src !== placeholder) {
    event.target.src = placeholder;
  }
}

function abrirImagem(imagem) {
  const src = getImageSrc(imagem);
  if (!src) {
    alert("Erro ao carregar imagem");
    return;
  }
  const novaJanela = window.open();
  novaJanela.document.write(`
    <html>
      <head>
        <title>Imagem de Evolução</title>
        <style>
          body {
            margin: 0;
            padding: 20px;
            background: #1a1a1a;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
          }
          img {
            max-width: 100%;
            max-height: 100vh;
            object-fit: contain;
          }
        </style>
      </head>
      <body>
        <img src="${src}" alt="Imagem de Evolução" />
      </body>
    </html>
  `);
}
</script>

<template>
  <div class="container">
    <h1>
      Dados de <b>{{ localPaciente.nome }}</b>
    </h1>
    <div class="grid md:grid-cols-2 md:gap-6">
      <div class="relative z-0 w-full mb-5 group">
        <label class="block mb-2">Nome</label>
        <input
          disabled
          v-model="localPaciente.nome"
          type="text"
          class="border w-full p-2 mb-3 rounded"
        />
      </div>
      <div class="relative z-0 w-full mb-5 group">
        <label class="block mb-2">Email</label>
        <input
          disabled
          v-model="localPaciente.email"
          type="text"
          class="border w-full p-2 mb-3 rounded"
        />
      </div>
    </div>
    <div class="grid md:grid-cols-2 md:gap-6">
      <div class="relative z-0 w-full mb-5 group">
        <label class="block mb-2">Sexo</label>
        <input
          disabled
          v-model="localPaciente.sexo"
          type="text"
          class="border w-full p-2 mb-3 rounded"
        />
      </div>
      <div class="relative z-0 w-full mb-5 group">
        <label class="block mb-2">Data de Nascimento</label>
        <input
          disabled
          v-model="localPaciente.dataNascimento"
          type="text"
          class="border w-full p-2 mb-3 rounded"
        />
      </div>
    </div>
    <div class="grid md:grid-cols-3 md:gap-6">
      <div class="relative z-0 w-full mb-4 group">
        <label class="block mb-2">Altura (cm)</label>
        <input
          disabled
          v-model="localPaciente.altura"
          type="text"
          class="border w-full p-2 mb-3 rounded"
        />
      </div>
      <div class="relative z-0 w-full mb-3 group">
        <label class="block mb-2">Peso (kg)</label>
        <input
          disabled
          v-model="localPaciente.peso"
          type="text"
          class="border w-full p-2 mb-3 rounded"
        />
      </div>
      <div class="relative z-0 w-full mb-3 group">
        <label class="block mb-2">IMC</label>
        <input
          disabled
          v-model="localPaciente.imc"
          type="text"
          class="border w-full p-2 mb-3 rounded"
        />
      </div>
    </div>
    <hr class="border-4 border-gray-400 my-6" />

    <!-- Seção de Fotos de Evolução -->
    <div class="mt-8">
      <h2 class="text-xl font-bold text-white mb-4">Fotos de Evolução</h2>

      <!-- Botão de Upload -->
      <div class="mb-6">
        <input
          ref="fileInputRef"
          type="file"
          accept="image/*"
          @change="handleFileSelect"
          class="hidden"
          id="fileInput"
        />
        <label
          for="fileInput"
          class="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg cursor-pointer transition-colors"
        >
          <svg
            class="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          {{ uploading ? "Enviando..." : "Adicionar Foto" }}
        </label>
      </div>

      <!-- Lista de Imagens Agrupadas por Data -->
      <div v-if="imagensAgrupadas.length > 0" class="space-y-6">
        <div
          v-for="grupo in imagensAgrupadas"
          :key="grupo.data"
          class="bg-gray-800 border border-gray-700 rounded-lg p-4"
        >
          <h3 class="text-lg font-semibold text-teal-400 mb-4">
            {{ formatarData(grupo.data) }}
          </h3>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div
              v-for="(imagem, index) in grupo.imagens"
              :key="index"
              class="relative group cursor-pointer bg-gray-700 rounded-lg overflow-hidden"
              @click="abrirImagem(imagem)"
            >
              <img
                :src="getImageSrc(imagem)"
                :alt="`Foto de evolução - ${formatarData(grupo.data)}`"
                class="w-full h-48 object-cover rounded-lg border-2 border-gray-600 hover:border-teal-400 transition-colors"
                @error="handleImageError"
                loading="lazy"
              />
              <div
                class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity rounded-lg flex items-center justify-center pointer-events-none"
              >
                <svg
                  class="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mensagem quando não há imagens -->
      <div
        v-else
        class="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center"
      >
        <svg
          class="w-16 h-16 mx-auto text-gray-500 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p class="text-gray-400">Nenhuma foto de evolução cadastrada ainda.</p>
        <p class="text-gray-500 text-sm mt-2">
          Clique em "Adicionar Foto" para começar a acompanhar sua evolução.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "tailwindcss";

.container {
  @apply rounded-2xl p-[20px] bg-[#111827] w-full;
}

h1 {
  color: rgb(180, 180, 250);
  margin-bottom: 10px;
}

label,
input {
  color: white;
}

:root {
  background-color: #111827;
}
</style>
