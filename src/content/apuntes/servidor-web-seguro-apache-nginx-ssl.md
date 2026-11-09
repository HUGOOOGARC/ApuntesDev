---
title: "Despliegue de Servidores Web (Apache/Nginx) y Certificados SSL/TLS"
description: "Aprende a alojar múltiples sitios web con Virtual Hosts en Apache y Nginx, y asegurar las comunicaciones cifradas con certificados SSL/TLS y HTTPS con Let's Encrypt."
date: "2026-04-21"
categoria: "redes"
subcategoria: "servicios-red"
dificultad: "Intermedio"
xp_recompensa: 50
monedas_recompensa: 10
draft: false
---

# 🌐 Servidores Web Seguros: Apache, Nginx y Cifrado SSL/TLS

El servicio web es el pilar de la interacción digital. Alojar páginas web requiere un demonio capaz de escuchar peticiones en los puertos `80 (HTTP)` y `443 (HTTPS)`. Los dos servidores web más extendidos en el mundo son **Apache HTTP Server** (arquitectura modular basada en procesos) y **Nginx** (arquitectura asíncrona orientada a eventos de alto rendimiento).

---

## 1. Concepto de Virtual Hosts (Alojamiento Múltiple)

Gracias a la cabecera `Host` de HTTP/1.1, un único servidor físico con una sola dirección IP pública puede alojar decenas de páginas web diferentes (ej. `empresa.com` y `tienda.com`):

```text
               Petición a 'empresa.com' ──> [ Servidor Web ] ──> /var/www/empresa/
                                            (IP: 195.55.1.1)
               Petición a 'tienda.com'  ──> [ Servidor Web ] ──> /var/www/tienda/
```

---

## 2. Configuración en Apache2 (Debian / Ubuntu)

### Paso 1: Instalación
```bash
sudo apt update
sudo apt install apache2 -y
```

### Paso 2: Crear la carpeta web y asignar permisos
```bash
sudo mkdir -p /var/www/apuntesdev/html
sudo chown -R www-data:www-data /var/www/apuntesdev/html
sudo chmod -R 755 /var/www/apuntesdev
```

### Paso 3: Configurar el archivo Virtual Host
Creamos `/etc/apache2/sites-available/apuntesdev.conf`:

```apache
<VirtualHost *:80>
    ServerName apuntesdev.local
    ServerAlias www.apuntesdev.local
    ServerAdmin webmaster@apuntesdev.local
    DocumentRoot /var/www/apuntesdev/html

    ErrorLog ${APACHE_LOG_DIR}/apuntesdev_error.log
    CustomLog ${APACHE_LOG_DIR}/apuntesdev_access.log combined

    <Directory /var/www/apuntesdev/html>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

### Paso 4: Habilitar el sitio y recargar
```bash
# Habilitar el sitio con a2ensite (Apache2 Enable Site)
sudo a2ensite apuntesdev.conf

# Validar sintaxis de configuración
sudo apache2ctl configtest

# Recargar el servicio
sudo systemctl reload apache2
```

---

## 3. Configuración en Nginx (Server Block)

En Nginx, los Virtual Hosts se denominan **Server Blocks**. Creamos `/etc/nginx/sites-available/apuntesdev`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name apuntesdev.local www.apuntesdev.local;

    root /var/www/apuntesdev/html;
    index index.html index.htm;

    location / {
        try_files $uri $uri/ =404;
    }

    access_log /var/log/nginx/apuntesdev_access.log;
    error_log /var/log/nginx/apuntesdev_error.log;
}
```

Habilitamos mediante un enlace simbólico y probamos:
```bash
sudo ln -s /etc/nginx/sites-available/apuntesdev /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 4. Seguridad HTTPS con Certificados SSL/TLS

HTTP transmite la información en texto plano, lo que permite a cualquier atacante en la misma red Wi-Fi o mediante un ataque Man-in-the-Middle interceptar contraseñas. **HTTPS** envuelve el tráfico en una capa de cifrado **TLS (Transport Layer Security)** sobre el puerto `443`.

### Cómo funciona el Cifrado Asimétrico:
- **Clave Privada (Private Key):** Reside únicamente en el servidor y **nunca se comparte**.
- **Clave Pública y Certificado (CRT/PEM):** Firmada por una Autoridad de Certificación (CA) de confianza. Se entrega a cada visitante para negociar una clave de sesión simétrica ultra rápida.

### Automatización de Certificados Gratuitos con Let's Encrypt y Certbot
En servidores con dominio público en Internet:

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-apache python3-certbot-nginx -y

# Obtener certificado y reconfigurar HTTPS y redirección automática (Apache)
sudo certbot --apache -d tudominio.com -d www.tudominio.com

# O para Nginx:
sudo certbot --nginx -d tudominio.com -d www.tudominio.com

# Comprobar la renovación automática (se renueva cada 90 días)
sudo certbot renew --dry-run
```
