---
title: "Administración de Usuarios y Grupos con PowerShell en Active Directory"
description: "Automatiza la creación masiva de cuentas de usuario, unidades organizativas y asignación a grupos en Windows Server con el módulo ActiveDirectory de PowerShell."
date: "2026-04-08"
categoria: "sistemas"
subcategoria: "sor"
dificultad: "Intermedio"
xp_recompensa: 50
monedas_recompensa: 10
draft: false
---

# 🏢 Automatización de Active Directory con PowerShell

En la administración de **Sistemas Operativos en Red (SOR)** con Windows Server, gestionar cientos de cuentas a través de la interfaz gráfica de *Usuarios y Equipos de Active Directory (ADUC)* resulta ineficiente y propenso a errores humanos. Con **PowerShell**, podemos automatizar altas, bajas y cambios en cuestión de segundos mediante scripts.

---

## 1. Cargar el Módulo de Active Directory

En cualquier Windows Server con el rol de Controlador de Dominio (Domain Controller), abrimos una consola de PowerShell como Administrador:

```powershell
# Importar el módulo si no está cargado
Import-Module ActiveDirectory

# Probar la conectividad con el dominio
Get-ADDomain
```

---

## 2. Creación de Unidades Organizativas (OU)

Las Unidades Organizativas permiten estructurar jerárquicamente los objetos del dominio y vincular Directivas de Grupo (GPO):

```powershell
# Crear una OU principal 'Corporativo'
New-ADOrganizationalUnit -Name "Corporativo" -Path "DC=empresa,DC=local" -ProtectedFromAccidentalDeletion $true

# Crear una sub-OU 'Alumnos' dentro de 'Corporativo'
New-ADOrganizationalUnit -Name "Alumnos" -Path "OU=Corporativo,DC=empresa,DC=local"
```

---

## 3. Creación y Consulta de Usuarios (`New-ADUser`)

Para dar de alta un nuevo usuario con contraseña cifrada y cuenta habilitada:

```powershell
# 1. Convertir la contraseña en texto seguro
$PasswordSegura = ConvertTo-SecureString "PasswordTemporal2026!" -AsPlainText -Force

# 2. Crear el objeto de usuario en la OU deseada
New-ADUser `
  -Name "Carlos Martin" `
  -GivenName "Carlos" `
  -Surname "Martin" `
  -SamAccountName "cmartin" `
  -UserPrincipalName "cmartin@empresa.local" `
  -Path "OU=Alumnos,OU=Corporativo,DC=empresa,DC=local" `
  -AccountPassword $PasswordSegura `
  -Enabled $true `
  -ChangePasswordAtLogon $true

# 3. Consultar las propiedades del usuario creado
Get-ADUser -Identity "cmartin" -Properties EmailAddress, MemberOf, Department
```

---

## 4. Gestión de Grupos de Seguridad (`New-ADGroup`)

Los grupos de seguridad permiten controlar el acceso a carpetas compartidas y permisos NTFS:

```powershell
# Crear un grupo de seguridad de ámbito global
New-ADGroup -Name "GRP_Alumnos_SMR" -GroupScope Global -GroupCategory Security -Path "OU=Corporativo,DC=empresa,DC=local"

# Añadir el usuario al grupo
Add-ADGroupMember -Identity "GRP_Alumnos_SMR" -Members "cmartin"

# Verificar los miembros del grupo
Get-ADGroupMember -Identity "GRP_Alumnos_SMR" | Select-Object Name, SamAccountName
```

---

## 5. Importación Masiva desde Archivo CSV

En un entorno educativo, es común recibir un listado de estudiantes en formato `.csv`:

### Archivo `alumnos.csv`:
```csv
Nombre,Apellido,Usuario,Password
Laura,Gomez,lgomez,Temporal2026!
Marcos,Ruiz,mruiz,Temporal2026!
Sara,Vidal,svidal,Temporal2026!
```

### Script de Creación Automatizada:
```powershell
$RutaCSV = "C:\scripts\alumnos.csv"
$OU_Destino = "OU=Alumnos,OU=Corporativo,DC=empresa,DC=local"

Import-Csv -Path $RutaCSV -Encoding UTF8 | ForEach-Object {
    $Pass = ConvertTo-SecureString $_.Password -AsPlainText -Force
    
    New-ADUser `
      -Name "$($_.Nombre) $($_.Apellido)" `
      -GivenName $_.Nombre `
      -Surname $_.Apellido `
      -SamAccountName $_.Usuario `
      -UserPrincipalName "$($_.Usuario)@empresa.local" `
      -Path $OU_Destino `
      -AccountPassword $Pass `
      -Enabled $true `
      -ChangePasswordAtLogon $true
      
    Write-Host "Usuario $($_.Usuario) creado con éxito ✅" -ForegroundColor Green
}
```
