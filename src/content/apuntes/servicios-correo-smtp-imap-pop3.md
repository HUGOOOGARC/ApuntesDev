---
title: "Servicios de Correo Electrónico: Arquitectura SMTP, IMAP, POP3 y Autenticación SPF/DKIM"
description: "Aprende el funcionamiento del correo en red: roles MTA/MDA/MUA, puertos seguros, protocolos de buzón y configuración de registros DNS anti-spoofing."
date: "2026-11-10"
categoria: "redes"
subcategoria: "servicios-red"
dificultad: "Intermedio"
xp_recompensa: 50
monedas_recompensa: 10
draft: false
---

# ✉️ Servicios de Correo Electrónico: Arquitectura SMTP, IMAP, POP3 y SPF/DKIM

El correo electrónico es uno de los servicios cliente-servidor más antiguos y complejos de Internet. Se compone de múltiples servidores y protocolos que cooperan entre sí para transferir un mensaje desde el teclado del emisor hasta el buzón del destinatario.

---

## 1. Arquitectura y Componentes del Sistema de Correo

```
+---------------+         SMTP (Envío)        +-------------------+         SMTP          +-------------------+
|  Cliente Emisor| ==========================> |  Servidor Origen  | ===================> |  Servidor Destino |
|  (MUA)        |                             |  (MTA - Postfix)  |     (Relay MX)      |  (MTA - Exim)     |
+---------------+                             +-------------------+                       +---------+---------+
                                                                                                    |
                                                                                                    | Entrega Local (MDA)
                                                                                                    v
+---------------+         IMAP / POP3         +-------------------+                       +---------+---------+
| Cliente Recep.| <========================== |  Servidor Buzón   | <==================== |  Buzón en Disco   |
| (MUA: Outlook)|      (Descarga/Sync)        |  (Dovecot)        |                       |  (/var/mail/...)  |
+---------------+                             +-------------------+                       +-------------------+
```

* **MUA (*Mail User Agent*):** El programa cliente con el que interactúa el usuario para redactar y leer correos (ej: Thunderbird, Outlook, Apple Mail o Webmail como Roundcube).
* **MTA (*Mail Transfer Agent*):** El servidor que rutea y envía correos a través de Internet buscando los registros MX del dominio receptor en el DNS (ej: **Postfix**, **Sendmail**, **Exim**).
* **MDA (*Mail Delivery Agent*):** Se encarga de depositar el mensaje entrante en el buzón físico del usuario en el disco del servidor (ej: **Dovecot**).

---

## 2. Protocolos y Puertos Estándar

| Protocolo | Función | Puerto Inseguro (Legado) | Puerto Seguro Cifrado (TLS/SSL) |
| :--- | :--- | :--- | :--- |
| **SMTP** | Envío y transferencia entre servidores de correo. | Puerto 25 (relay) | **Puerto 587 (STARTTLS)** / **Puerto 465 (SMTPS)** |
| **POP3** | Descarga los correos del servidor al equipo local y **los borra** del servidor. | Puerto 110 | **Puerto 995 (POP3S)** |
| **IMAP** | Sincronización bidireccional en la nube (carpetas, leídos/no leídos). Los correos quedan en el servidor. | Puerto 143 | **Puerto 993 (IMAPS)** |

---

## 3. Prevención de Suplantación: SPF, DKIM y DMARC

Cualquier persona puede técnicamente enviar un correo simulando ser otra persona (*Mail Spoofing*) debido a que el protocolo SMTP original de los años 80 carecía de autenticación. Para evitar que tus correos terminen en la carpeta de SPAM, se configuran estos tres registros en el DNS de tu dominio:

### A. Registro SPF (*Sender Policy Framework*)
Es un registro de tipo **TXT** en el DNS que enumera qué servidores o direcciones IP están autorizados para enviar correos en nombre de tu dominio:
```text
# Ejemplo de registro DNS TXT para tudominio.com:
v=spf1 ip4:198.51.100.25 include:_spf.google.com ~all
```
* `~all` (*SoftFail*): El servidor receptor acepta el correo si proviene de otra IP, pero lo marcará como sospechoso o SPAM.
* `-all` (*HardFail*): Rechazo absoluto del mensaje si no proviene de las IPs listadas.

### B. Registro DKIM (*DomainKeys Identified Mail*)
Añade una firma criptográfica con clave asimétrica a la cabecera de cada correo saliente. El emisor firma con su clave privada, y el receptor verifica la autenticidad con la clave pública publicada en el DNS del dominio. Garantiza que el mensaje **no ha sido manipulado** durante el tránsito.

### C. Registro DMARC (*Domain-based Message Authentication*)
Le indica al servidor de correo receptor qué acción tomar si un correo falla las pruebas de SPF o DKIM (políticas: `p=none` para solo monitorizar, `p=quarantine` para mandar a SPAM, o `p=reject` para bloquear el envío directamente).
```text
v=DMARC1; p=reject; rua=mailto:informes-dmarc@tudominio.com
```
