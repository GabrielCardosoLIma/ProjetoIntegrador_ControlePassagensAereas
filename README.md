# Projeto Controle de Passagem Aérea

Este repositório contém o código-fonte para um sistema de controle de passagem aérea. Siga as instruções abaixo para configurar e executar o projeto.

## Backend

1. **Clone o repositório:**
    ```bash
    git clone https://github.com/GabrielCardosoLIma/PI_Controle_Passagem_Aerea.git
    ```

2. **Navegue até o diretório do backend:**
    ```bash
    cd PI_Controle_Passagem_Aerea/backend
    ```

3. **Instale as dependências:**
    ```bash
    npm install
    ```

4. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` no diretório `backend` e configure as variáveis necessárias para a conexão com o banco de dados.

5. **Compile o TypeScript:**
    ```bash
    tsc
    ```

6. **Inicie o servidor:**
    ```bash
    node build/app.js
    ```

    Se visualizar "Servidor rodando... PARABÉNS! Conexão com o Banco feita com sucesso!", a configuração está correta. Certifique-se de criar as tabelas e sequências conforme definido no arquivo `.sql`.

## Frontend

1. **Instale o Visual Studio Code:**
   Certifique-se de ter o [Visual Studio Code](https://code.visualstudio.com/) instalado.

2. **Instale a extensão Live Server:**
   No VSCode, instale a extensão [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer). Você pode encontrá-la na barra lateral do VSCode, na seção de extensões.

3. **Inicie o servidor para o frontend:**
   Abra o arquivo `index.html` no VSCode e clique em "Go Live" no canto inferior direito da tela.

Isso é tudo! Agora você deve ter o sistema em execução localmente. Certifique-se de seguir essas etapas com atenção para evitar problemas de configuração. Se encontrar algum problema, consulte a documentação ou entre em contato com os desenvolvedores.

---

**Observação:** Certifique-se de que o ambiente Node.js está corretamente configurado em sua máquina antes de iniciar.

**Links para Download:**
- [Node.js](https://nodejs.org/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Extensão Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
