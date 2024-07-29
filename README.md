# NFE Data Extraction and Publishing

Este projeto consiste em uma função Lambda que extrai dados de Nota Fiscal Eletrônica (NFE) de um URL fornecido, processa essas informações e publica os dados extraídos em um tópico SNS da AWS. O sistema utiliza a biblioteca Axios para realizar requisições HTTP e Cheerio para fazer o parsing do HTML.

## Estrutura do Projeto

- **adapters/**
  - `axios-http-gateway.ts`: Implementação do gateway HTTP usando Axios.
  - `cheerio-nfe-parser.ts`: Implementação do parser de NFE usando Cheerio.
  - `sns-message-broker.ts`: Implementação do broker de mensagens usando SNS da AWS.
  
- **bondaries/**
  - `http-gateway.ts`: Interface para o gateway HTTP.
  - `message-broker.ts`: Interface para o broker de mensagens.
  - `nfe-parser.ts`: Interface para o parser de NFE.

- **use-cases/**
  - `extract-and-publish-nfe-use-data-case.ts`: Caso de uso para extrair dados da NFE e publicar no SNS.

- **lambdaHandler.ts**: Função principal que é chamada quando a Lambda é acionada.

## Pré-requisitos

- Node.js instalado
- AWS SDK configurado com as credenciais apropriadas
- Uma fila SQS configurada para acionar a função Lambda
- Um tópico SNS configurado para publicar os dados da NFE

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/andreluis98/scrapper-data.git
   cd scrapper-data
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure suas credenciais da AWS, se ainda não o fez. Você pode fazer isso através do AWS CLI ou configurando variáveis de ambiente.

## Uso

1. Envie uma mensagem para a fila SQS com o seguinte formato:

   ```json
   {
     "Records": [
       {
         "messageId": "059f36b4-87a3-44ab-83d2-661975830a7d",
         "receiptHandle": "AQEBwJnKyrHigUMZj6rYigCgxlaS3SLy0a...",
         "body": "{\"url\": \"https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240500830498000110650010001161201067328154%7C2%7C1%7C1%7C6EDCF28F8E346B24BAF885F49736DAC96040B02F\"}",
         ...
       }
     ]
   }
   ```

2. A função Lambda irá processar cada mensagem, extrair os dados da NFE e publicá-los no tópico SNS configurado.

## Exceções

O sistema lida com algumas exceções personalizadas:

- `NFEExeception`: Lançada quando há falha ao analisar os dados da NFE.
- `NFEParserHTMLNotLoadedException`: Lançada quando o HTML não foi carregado corretamente no parser da NFE.

## Contribuição

Sinta-se à vontade para abrir problemas ou pull requests. Sua contribuição é bem-vinda!

## Licença

Este projeto está licenciado sob a MIT License. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
