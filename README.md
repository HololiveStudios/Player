# Player - Minimal Music Player & Streaming Server

## 1. Objetivo e Finalidade
Reprodutor de música leve para streaming local de bibliotecas de áudio com leitura de tags ID3.

## 2. Tecnologias Utilizadas
- React, TypeScript, Vite, Node.js, Express, TanStack Query, Multer, node-id3

## 3. Arquitetura e Estrutura de Diretórios
Monorepo full-stack com servidor Express para upload e leitura de metadados (`node-id3`) e frontend SPA com TanStack Query.

## 4. Principais Arquivos e Responsabilidades
- `server/`: API backend para streaming de áudio e leitura de tags ID3.
- `src/`: Player de áudio com controle de reprodução e playlists.
- `package.json`: Scripts de dev simultâneo de cliente e servidor.

## 5. Funcionalidades Identificadas
- Leitura automática de capa de álbum, artista e título via ID3
- Player embutido com barra de progresso e controle de volume
- Upload de músicas para biblioteca do servidor

## 6. Como Compilar ou Executar
```bash
npm install
npm run dev
```

## 7. Estado Atual do Projeto
**Completo**

## 8. Pendências e Limitações Identificadas
Modo de equalizador sonoro em tempo real com Web Audio API.
