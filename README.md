## Projeto Node.js com Express e MongoDB com JWT
Este projeto é uma API simples construída com Node.js, Express e MongoDB usando Mongoose. A API permite registrar, autenticar e buscar usuários, protegendo algumas rotas com middleware de verificação de token JWT.

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/Venoshk/Autentica-o.git

2. Instale as dependências:
    ```bash
    npm install
    
3. Configurar variáveis de ambiente:
    ```bash
    DB_USER=seu_usuario_mongodb
    DB_PASSWORD=sua_senha_mongodb
    SECRET=sua_chave_secreta_jwt

## Bibliotecas Utilizadas
- express
- mongoose
- dotenv
- bcrypt
- jsonwebtoken



## Rotas
### Registrar Usuário
### Endpoint: /auth/register

Método: POST

Corpo da Requisição:

    {
      "name": "Nome do Usuário",
      "email": "email@example.com",
      "password": "suaSenha",
      "confirmpassword": "suaSenha"
      }


## Resposta de sucesso:
    {
        "msg": "Usuario criado com sucesso!"
    }

## Autenticar Usuário
### Endpoint: /auth/login

Método: POST

Corpo da Requisição:

    {
      "email": "email@example.com",
      "password": "suaSenha"
  }

## Resposta de sucesso

    {
        "user": {
            "_id": "idDoUsuario",
            "name": "Nome do Usuário",
            "email": "email@example.com"
            // Outros campos, exceto a senha
        }
    }
