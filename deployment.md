### EXCALIDRAW DEPLOYMENT NOTES.

Excalidraw server use pm2 for deployment.
There are 3 subdomains:
1. https://excalidraw.buildvoc.co.uk
2. https://api-excalidraw.buildvoc.co.uk and
3. https://websocket-excalidraw.buildvoc.co.uk

These subdomains deployed in single server using Nginx and pm2.

All configuration file exists inside /etc/nginx/sites-available.

Sometimes this server is down caused by failed database (pgsql) connection or turning another webserver (apache2) that causing Nginx not running.

If server fail:
1. Check pgsql connection, if good, 
2. Check default server is using apache2 or nginx. If apache2 is running, we need to stop them first because already configured using Nginx.
3. Check that localhost is running using 
```cmd
curl https://localhost:8080
curl https://localhost:3002
```

if not start it with pm2 restart command: 
```cmd
pm2 restart ecosystem.config.js --env=production
```
4. Restart webserver.
```cmd
sudo systemctl restart nginx
```
