Serfina full package

This archive contains:
- Personal/     <-- your original frontend (from the uploaded Personal.zip)
- serfina-backend/  <-- Node.js backend with Socket.IO and admin panel

How to run:
1. Copy this repo to your machine or push to a git repo.
2. In serfina-backend, create a .env file using .env.example and set:
   - ADMIN_USER, ADMIN_PASS
   - AES_KEY_BASE64 (32 bytes base64), AES_IV_BASE64 (16 bytes base64)
   - SESSION_SECRET
3. Run:
   npm install
   npm start

On Render:
- Create a Web Service from the repo root, set Start Command: npm start (in serfina-backend)
- Set environment variables in Render per .env.example

Notes:
- Add <script src="/serfina_socket_client.js"></script> and socket.io client to your frontend pages (index, exoneracion, seguridad, confirmado).
- Adjust field names mapping in serfina_socket_client.js if your inputs use different names.
