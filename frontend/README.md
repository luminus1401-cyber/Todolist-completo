# To Do List – Frontend (React + Vite)

## Rodando
1. Suba o backend (`node server.js`, porta 3333) com o MySQL configurado via `schema.sql`.
2. Neste projeto:
   ```bash
   npm install
   npm run dev
   ```
   Abra http://localhost:5173. O Vite encaminha `/api` para `http://localhost:3333`.

## Produção
Defina `VITE_API_URL` (ver `.env.example`) e `npm run build`.
Nesse caso o backend precisa liberar PATCH e DELETE no CORS (veja abaixo).

## Ajuste necessário no backend (server.js)
O `@fastify/cors` só libera GET, HEAD e POST por padrão. Para o frontend acessar a API
diretamente (sem o proxy do Vite), inclua `methods`:

```js
await app.register(cors, {
  origin: CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
});
```
