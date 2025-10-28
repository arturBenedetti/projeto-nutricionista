# Backend - Projeto Nutricionista

## Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
MONGO_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/
DB_NAME=projeto-nutricionista
```

### Instalação de Dependências

```bash
npm install
```

### Compilação

```bash
npm run build
```

## Melhorias de Segurança Implementadas

### ✅ Hash de Senhas

- Implementado bcrypt com salt rounds = 12
- Senhas são hasheadas antes de serem salvas no banco
- Verificação de senha usando bcrypt.compare()

### ✅ Geração de IDs Seguros

- Substituído Date.now() por UUID v4
- IDs únicos e não previsíveis

### ✅ DTOs Seguros

- UserResponseDTO não expõe senhas
- Controllers retornam apenas dados públicos

### ✅ Entidade User Segura

- Senha é privada (\_password)
- Método getPublicData() para dados seguros
- Getter para acesso interno à senha

### ✅ Tratamento de Erros

- Try/catch nos casos de uso
- Logs de erro adequados
- Validação de credenciais melhorada

## Estrutura de Arquivos

```
src/
├── application/
│   ├── controllers/     # Controllers da aplicação
│   ├── dtos/           # Data Transfer Objects
│   ├── interfaces/     # Interfaces dos repositórios
│   └── ipc/           # Comunicação IPC com Electron
├── domain/
│   ├── entities/       # Entidades do domínio
│   ├── services/       # Serviços de domínio
│   └── useCases/       # Casos de uso
└── infrastructure/
    ├── config/         # Configurações
    ├── db/            # Conexão com banco
    └── repositories/   # Implementações dos repositórios
```
