rem cloudflared --version
start npm start
rem http://localhost:3000
start cloudflared tunnel --url http://localhost:3000
