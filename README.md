# Challenge Control361

## Descrição do Projeto

Este desafio consiste em uma aplicação que exibe informações de veículos de acordo com os filtros, incluindo localização em um mapa, status, e outros detalhes. Ele utiliza React, React Query, e a API do Google Maps para fornecer uma interface interativa e responsiva.

---

## Como Executar a Aplicação

1. **Baixe as dependências**:
   - Execute o seguinte comando para instalar todas as dependências do projeto:
     ```bash
     npm install
     ```

2. **Configure as variáveis de ambiente**:
   - Crie um arquivo `.env` na raiz do projeto.
   - Use o arquivo `.env.example` como referência para as variáveis necessárias.
   - Os valores das variáveis de ambiente estão disponíveis no e-mail enviado com este desafio.

3. **Execute a aplicação**:
   - Inicie o servidor de desenvolvimento com o comando:
     ```bash
     npm run dev
     ```

4. **Execute os testes**:
   - Para rodar os testes unitários, use o comando:
     ```bash
     npm test
     ```

---

## Estrutura do Projeto

### **Pasta `app`**

#### **Subpasta `(home)`**

##### **`viewModel.tsx`**
- **Descrição**: 
  - Componente principal da página.
  - Integra o hook `useHomeModel` com o componente de visualização `HomeView`.
  - Responsável por passar os métodos e estados gerenciados pelo hook para o componente de visualização.
- **Função Principal**: 
  - Renderiza o componente `HomeView` com as propriedades retornadas pelo `useHomeModel`.

##### **`model.tsx`**
- **Descrição**: 
  - Contém a lógica principal da aplicação.
  - Define o hook `useHomeModel`, que gerencia os estados e funções da página.
  - Inclui funcionalidades como:
    - Gerenciamento de filtros (`filterType`, `inputValue`).
    - Controle de eventos no mapa (Google Maps).
    - Paginação e busca de veículos.
    - Pooling de dados para atualizações periódicas.
- **Função Principal**: 
  - Fornece métodos e estados para o componente `HomeView` por meio do `viewModel`.

##### **`view.tsx`**
- **Descrição**: 
  - Componente de visualização da página.
  - Renderiza a interface do usuário com base nos dados e métodos fornecidos pelo `useHomeModel`.
  - Inclui:
    - Componentes de entrada, como `InputComponent` e `RadioComponent`.
    - Tabela de veículos.
    - Componente de mapa (`MapComponent`).
    - Mensagens de feedback, como "Sem veículos para exibir".
- **Função Principal**: 
  - Exibe a interface do usuário e conecta os eventos de interação com os métodos fornecidos.

---

### **Pasta `components`**

#### **`InputComponent.tsx`**
- **Descrição**: 
  - Componente de entrada de texto.
  - Usado para buscar veículos por placa ou frota.

#### **`RadioComponent.tsx`**
- **Descrição**: 
  - Componente de botão de rádio.
  - Usado para alternar entre os filtros "Rastreados" e "Outros".

#### **`MapComponent.tsx`**
- **Descrição**: 
  - Componente de mapa.
  - Integra o Google Maps para exibir a localização dos veículos.

#### **`TableCellComponent.tsx`**
- **Descrição**: 
  - Componente de célula da tabela.
  - Usado para exibir informações dos veículos na tabela.

#### **`TableHeaderComponent.tsx`**
- **Descrição**: 
  - Componente de cabeçalho da tabela.
  - Usado para exibir os títulos das colunas na tabela de veículos.

#### **`ButtonComponent.tsx`**
- **Descrição**: 
  - Componente de botão.
  - Usado para ações como criar um novo veículo.

#### **`IconComponent.tsx`**
- **Descrição**: 
  - Componente genérico para renderizar ícones de diferentes bibliotecas de ícones, como `react-icons/fa`, `react-icons/md`, entre outras.
  - Permite a personalização de tamanho, cor e classes CSS.
  - Suporta múltiplas bibliotecas de ícones e seleciona dinamicamente o ícone com base no nome fornecido.
- **Propriedades**:
  - `iconName`: Nome do ícone a ser renderizado (obrigatório).
  - `size`: Tamanho do ícone (opcional).
  - `color`: Cor do ícone (opcional).
  - `className`: Classes CSS adicionais para estilização (opcional).
  - `testId`: Identificador para testes (opcional).
- **Função Principal**: 
  - Renderiza o ícone correspondente ao nome fornecido, pesquisando em várias bibliotecas de ícones.
  - Retorna `null` se o ícone não for encontrado.

#### **`MarkerComponent.tsx`**
- **Descrição**: 
  - Componente responsável por renderizar um marcador no mapa do Google Maps.
  - Exibe informações detalhadas sobre o veículo quando o marcador está selecionado.
  - Inclui um ícone personalizado e uma janela de informações (`InfoWindow`) com detalhes como placa, frota, data e localização.
- **Propriedades**:
  - `item`: Objeto do tipo `LocationVehicle` contendo os dados do veículo (obrigatório).
  - `onClick`: Função chamada ao clicar no marcador ou no botão de fechar da janela de informações (opcional).
  - `isSelected`: Indica se o marcador está selecionado e deve exibir a janela de informações (opcional).
- **Funcionalidades**:
  - Renderiza um marcador com um ícone de caminhão (`RiTruckLine`) e uma cor de fundo gerada aleatoriamente.
  - Exibe uma janela de informações (`InfoWindow`) com:
    - Placa do veículo.
    - Frota do veículo.
    - Data e hora formatadas.
    - Link para abrir a localização no Google Maps.
  - Permite fechar a janela de informações clicando no botão de fechar.
- **Função Principal**: 
  - Fornece uma interface visual para representar veículos no mapa, com informações detalhadas e interatividade.
---

### **Pasta `hooks`**

#### **`useDebounce.tsx`**
- **Descrição**: 
  - Hook personalizado que implementa a funcionalidade de debounce.
  - Permite atrasar a execução de uma função até que um determinado período de tempo (`delay`) tenha passado desde a última vez que foi chamada.
  - Utilizado para otimizar chamadas frequentes, como em campos de busca ou eventos de digitação.
- **Propriedades**:
  - `delay`: Tempo em milissegundos para o atraso na execução da função (opcional, padrão: `1000ms`).
- **Retorno**:
  - Uma função `debounceFn(callback: () => void)` que pode ser usada para atrasar a execução de um callback.
- **Funcionalidades**:
  - Garante que a função passada como callback seja executada apenas após o tempo de `delay` sem novas chamadas.
  - Limpa o temporizador (`clearTimeout`) ao desmontar o componente ou ao chamar a função novamente antes do tempo expirar.
- **Uso no Projeto**:
  - Este hook é utilizado na funcionalidade de **pesquisa de veículos**, para evitar chamadas desnecessárias à API enquanto o usuário digita no campo de busca.
- **Função Principal**: 
  - Reduz a frequência de execução de funções, melhorando o desempenho e evitando sobrecarga de chamadas.
---

### **Pasta `services`**

#### **`api.ts`**
- **Descrição**: 
  - Serviço responsável por realizar chamadas à API para buscar a lista de veículos com paginação e filtros.
  - Utiliza a função `fetch` para realizar requisições HTTP.
- **Função Exportada**:
  - `fetchVehicles`: Função assíncrona que busca veículos com base nos parâmetros fornecidos.
- **Parâmetros da Função `fetchVehicles`**:
  - `page` (opcional): Número da página a ser buscada (padrão: `1`).
  - `perPage` (opcional): Número de itens por página (padrão: `20`).
  - `filter` (opcional): Filtro de busca (ex.: placa ou frota).
  - `filterTypeParam` (opcional): Tipo de filtro, podendo ser `'tracked'` ou `'others'` (padrão: `'tracked'`).
- **Retorno**:
  - Retorna um objeto do tipo `VehicleResponse` contendo os dados da API.
- **Funcionalidades**:
  - Monta a URL da requisição com base nos parâmetros fornecidos.
  - Adiciona o cabeçalho de autorização com a chave da API (`NEXT_PUBLIC_API_KEY`).
  - Lança um erro caso a resposta da API não tenha o status `200`.
- **Uso no Projeto**:
  - Utilizado para buscar a lista de veículos exibida na aplicação, com suporte a paginação e filtros.
- **Função Principal**: 
  - Facilitar a comunicação com a API para obter dados de veículos de forma eficiente e segura.
---

### **Pasta `utils`**

#### **`getRandomDarkHexColor.ts`**
- **Descrição**: 
  - Função utilitária que gera uma cor hexadecimal aleatória com tons escuros.
  - A cor gerada é usada para estilizar os ícones de caminhão exibidos no mapa.
- **Funcionamento**:
  - Gera valores aleatórios para os componentes RGB (Red, Green, Blue), limitando o intervalo para tons mais escuros (`0-155`).
  - Converte os valores RGB para o formato hexadecimal e os combina em uma string no formato `#RRGGBB`.
- **Retorno**:
  - Uma string representando uma cor hexadecimal escura (ex.: `#3a5f7b`).
- **Uso no Projeto**:
  - Utilizada para atribuir cores aleatórias aos ícones de caminhão no mapa, garantindo uma aparência visualmente distinta e consistente.
- **Função Principal**: 
  - Fornecer cores aleatórias escuras para estilizar elementos visuais no mapa.
---

### **Pasta `__tests__`**

#### **Subpasta `app/home`**

##### **`viewModel.test.tsx`**
- **Descrição**: 
  - Contém os testes unitários para o componente `Home`.
  - Verifica:
    - Integração entre o `useHomeModel` e o `HomeView`.
    - Renderização do `HomeView`.
- **Função Principal**: 
  - Garantir que o componente `Home` passe corretamente os métodos e estados para o `HomeView`.

##### **`model.test.tsx`**
- **Descrição**: 
  - Contém os testes unitários para o hook `useHomeModel`.
  - Verifica:
    - Inicialização dos estados.
    - Comportamento de funções como `handleInput`, `handleRadio`, e `handleClickOnTruck`.
    - Atualização de estados como `vehicles` e `selectedVehicle`.
- **Função Principal**: 
  - Garantir que o hook `useHomeModel` funcione corretamente e gerencie os estados e eventos da aplicação.

##### **`view.test.tsx`**
- **Descrição**: 
  - Contém os testes unitários para o componente `HomeView`.
  - Verifica:
    - Renderização correta dos elementos.
    - Chamadas de métodos como `handleClickOnTruck` e `handleScroll`.
    - Exibição de mensagens de feedback.
    - Comportamento do mapa e da tabela.
- **Função Principal**: 
  - Garantir que o componente `HomeView` funcione corretamente em diferentes cenários.
---

#### **Subpasta `components`**

##### **`RadioComponent.test.tsx`**
- **Descrição**: 
  - Contém os testes unitários para o componente `RadioComponent`.
  - Verifica:
    - Renderização do texto correto.
    - Ícones exibidos corretamente dependendo do estado de seleção.
    - Chamadas da função `onClick` ao clicar no componente.
- **Função Principal**: 
  - Garantir que o componente `RadioComponent` funcione corretamente em diferentes estados (selecionado ou não).

##### **`TableCellComponent.test.tsx`**
- **Descrição**: 
  - Contém os testes unitários para os componentes `TableCell` e `TableCellLoading`.
  - Verifica:
    - Renderização correta do texto.
    - Aplicação ou não da classe de borda com base na propriedade `hasBorder`.
    - Renderização do componente de carregamento (`Skeleton`) no estado de carregamento.
- **Função Principal**: 
  - Garantir que os componentes de célula da tabela sejam renderizados corretamente e exibam o estado de carregamento quando necessário.

##### **`MarkerComponent.test.tsx`**
- **Descrição**: 
  - Contém os testes unitários para o componente `MarkerComponent`.
  - Verifica:
    - Renderização do marcador na posição correta.
    - Exibição da janela de informações (`InfoWindow`) quando o marcador está selecionado.
    - Chamadas da função `onClick` ao clicar no marcador ou no botão de fechar.
    - Renderização dos detalhes corretos na janela de informações.
- **Função Principal**: 
  - Garantir que o marcador funcione corretamente no mapa, exibindo informações detalhadas e interatividade.

##### **`IconComponent.test.tsx`**
- **Descrição**: 
  - Contém os testes unitários para o componente `IconComponent`.
  - Verifica:
    - Renderização do ícone correto com base no `iconName`.
    - Não renderização de ícones inválidos.
    - Aplicação correta de propriedades como `size`, `color` e `className`.
- **Função Principal**: 
  - Garantir que o componente `IconComponent` renderize ícones corretamente e aplique as propriedades fornecidas.

##### **`InputComponent.test.tsx`**
- **Descrição**: 
  - Contém os testes unitários para o componente `InputComponent`.
  - Verifica:
    - Renderização do campo de entrada com o placeholder correto.
    - Chamadas da função `handleInput` ao alterar o valor do campo.
    - Aplicação das classes de borda corretas com base no estado de foco.
    - Chamadas das funções `onFocus` e `onBlur` ao ganhar ou perder o foco.
- **Função Principal**: 
  - Garantir que o componente de entrada funcione corretamente e interaja com os eventos de foco e alteração de valor.

##### **`ButtonComponent.test.tsx`**
- **Descrição**: 
  - Contém os testes unitários para o componente `ButtonComponent`.
  - Verifica:
    - Renderização do botão com o texto correto.
    - Chamadas da função `onClick` ao clicar no botão.
    - Aplicação da classe CSS fornecida.
- **Função Principal**: 
  - Garantir que o botão funcione corretamente e execute ações ao ser clicado.

##### **`MapComponent.test.tsx`**
- **Descrição**: 
  - Contém os testes unitários para o componente `MapComponent`.
  - Verifica:
    - Renderização do mapa do Google Maps quando carregado.
    - Renderização de marcadores para cada veículo.
    - Exibição do estado de carregamento (`Skeleton`) quando o mapa não está carregado.
    - Não renderização de elementos quando o mapa não está carregado e não está no estado de carregamento.
- **Função Principal**: 
  - Garantir que o componente de mapa funcione corretamente, exibindo marcadores e estados de carregamento conforme necessário.

##### **`TableHeaderComponent.test.tsx`**
- **Descrição**: 
  - Contém os testes unitários para o componente `TableHeaderComponent`.
  - Verifica:
    - Renderização do texto fornecido.
    - Aplicação da classe de borda (`border-r-1 border-blue-30`) quando a propriedade `hasBorder` é `true`.
    - Ausência da classe de borda quando a propriedade `hasBorder` é `false`.
- **Função Principal**: 
  - Garantir que o componente `TableHeaderComponent` funcione corretamente, renderizando o texto e aplicando as classes CSS de acordo com as propriedades fornecidas.
---