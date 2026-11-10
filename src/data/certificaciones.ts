export interface Certificacion {
  id: string;
  categoria: 'sistemas' | 'redes' | 'programacion' | 'global';
  codigoPrefijo: string;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  totalRequerido: number;
  colorAcento: string;
  icono: string;
  competencias: string[];
  nivelMinimo?: number;
}

export const CATALOGO_CERTIFICACIONES: Certificacion[] = [
  {
    id: 'cert-sistemas',
    categoria: 'sistemas',
    codigoPrefijo: 'SYS',
    titulo: 'Especialista en Administración de Sistemas y Servidores',
    subtitulo: 'Certificación Profesional de Sistemas Operativos Monopuesto y en Red (SOM / SOR)',
    descripcion: 'Acredita competencias operativas avanzadas en administración de terminal Linux, gestión del sistema de archivos FHS, permisos octales, particionado de discos con fstab, servicios systemd, Active Directory en Windows Server, directivas GPO, hipervisores y contenedores Docker.',
    totalRequerido: 13,
    colorAcento: '#10b981',
    icono: '🖥️',
    competencias: [
      'Administración de Consola Bash y Shell Scripting',
      'Estructura FHS y Seguridad de Permisos (chmod/chown)',
      'Gestión de Almacenamiento, fstab y Niveles de RAID',
      'Auditoría Forense con systemd journalctl y syslog',
      'Active Directory y GPOs en Windows Server',
      'Virtualización Bare-Metal y Despliegue con Docker'
    ]
  },
  {
    id: 'cert-redes',
    categoria: 'redes',
    codigoPrefijo: 'NET',
    titulo: 'Arquitecto de Redes y Telecomunicaciones',
    subtitulo: 'Certificación Técnica en Infraestructura, Enrutamiento y Servicios de Red',
    descripcion: 'Acredita el dominio técnico del modelo OSI/TCP-IP, direccionamiento IPv4 y VLSM avanzado, despliegue de IPv6 con SLAAC, diseño de VLANs y troncales 802.1Q en switches Cisco, enrutamiento inter-VLAN, OSPF multiárea, ACLs de filtrado y servidores DHCP/DNS/SSH/VPN WireGuard.',
    totalRequerido: 14,
    colorAcento: '#38bdf8',
    icono: '🌐',
    competencias: [
      'Subnetting IPv4 (VLSM) y Direccionamiento IPv6',
      'Configuración de VLANs y Trunking 802.1Q Cisco',
      'Enrutamiento Dinámico con Protocolo OSPF',
      'Listas de Control de Acceso (ACLs Estándar y Extendidas)',
      'Servidores de Infraestructura: DHCP, BIND9 DNS y Apache/Nginx',
      'Seguridad Inalámbrica WPA3, RADIUS (802.1X) y VPNs'
    ]
  },
  {
    id: 'cert-programacion',
    categoria: 'programacion',
    codigoPrefijo: 'DEV',
    titulo: 'Desarrollador Full-Stack & Python Core',
    subtitulo: 'Certificación en Fundamentos de Desarrollo de Software, APIs y Arquitectura Web',
    descripcion: 'Acredita solvencia en estructuras de datos, programación orientada a objetos (POO) en Python, manejo de excepciones, consultas parametrizadas a bases de datos relacionales SQLite, desarrollo de APIs RESTful con FastAPI, maquetación moderna CSS Grid/Flexbox, manipulación del DOM y control de versiones con Git/GitHub.',
    totalRequerido: 13,
    colorAcento: '#a855f7',
    icono: '💻',
    competencias: [
      'Fundamentos y POO Avanzada en Python 3',
      'Persistencia Relacional y Consultas Seguras SQL',
      'Diseño y Consumo de APIs REST con FastAPI y Swagger',
      'JavaScript Moderno Asíncrono (Promesas, Fetch y Async/Await)',
      'Arquitectura Web Moderna, Componentes y Manejo de Estados',
      'Control de Versiones Profesional con Git y GitHub'
    ]
  },
  {
    id: 'cert-master-root',
    categoria: 'global',
    codigoPrefijo: 'ROOT',
    titulo: 'Diploma de Honor: Arquitecto Maestro Root',
    subtitulo: 'Máxima Distinción Académica y de Liderazgo Tecnológico ApuntesDev',
    descripcion: 'El más alto galardón de la academia otorgado a los estudiantes de élite que han dominado la totalidad de los módulos de Sistemas, Redes y Desarrollo, alcanzando un rango avanzado en el Salón de la Fama.',
    totalRequerido: 40,
    nivelMinimo: 10,
    colorAcento: '#ffd700',
    icono: '👑',
    competencias: [
      'Dominio Integral de Sistemas Operativos Libres y Propietarios',
      'Diseño, Seguridad y Optimización de Redes de Comunicaciones',
      'Desarrollo Backend, Arquitectura de APIs y Frontend Moderno',
      'Prácticas de Ciberseguridad Defensiva y Hardening de Servidores',
      'Capacidad de Resolución Autónoma de Incidentes Tecnológicos Complejos',
      'Superación del Cuadro de Honor con Calificación Sobresaliente'
    ]
  }
];
