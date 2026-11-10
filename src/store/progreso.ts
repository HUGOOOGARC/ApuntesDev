import { persistentMap } from '@nanostores/persistent';
import { supabase } from '../lib/supabase';

// 1. Definimos la forma exacta de los datos del estudiante
export interface PerfilEstudiante {
  temaActivo: string;
  temasDesbloqueados: string[];
  tituloActivo?: string;
  titulosDesbloqueados?: string[];
  xp: number;
  nivel: number;
  monedas: number;
  prestigio: number;
  multiplicadorXP: number;
  cristalesAscension: number; // La moneda premium del Endgame
  apuntesCompletados: string[];
  duelosGanados?: number;
  duelosJugados?: number;
}

// 2. Valores iniciales para un usuario nuevo
const valoresIniciales: PerfilEstudiante = {
  temaActivo: 'default',
  temasDesbloqueados: ['default'],
  tituloActivo: 'Cadete Técnico',
  titulosDesbloqueados: ['Cadete Técnico'],
  xp: 0,
  nivel: 1,
  monedas: 0,
  prestigio: 0,
  multiplicadorXP: 1.0,
  cristalesAscension: 0,
  apuntesCompletados: [],
  duelosGanados: 0,
  duelosJugados: 0
};

// 3. Store persistente sincronizado con localStorage (caché ultrarrápida)
export const perfilStore = persistentMap<PerfilEstudiante>(
  'apuntesdev_perfil:',
  valoresIniciales,
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
);

// --- SINCRONIZACIÓN CON SUPABASE ---

// Guarda TODOS los datos actuales del store en la base de datos de Supabase
async function sincronizarConSupabase(nuevoPerfil: PerfilEstudiante) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { error } = await supabase
        .from('profiles')
        .update({
          xp: nuevoPerfil.xp,
          level: nuevoPerfil.nivel,
          coins: nuevoPerfil.monedas,
          prestigio: nuevoPerfil.prestigio,
          multiplicador_xp: nuevoPerfil.multiplicadorXP,
          cristales_ascension: nuevoPerfil.cristalesAscension,
          apuntes_completados: nuevoPerfil.apuntesCompletados,
          tema_activo: nuevoPerfil.temaActivo,
          temas_desbloqueados: nuevoPerfil.temasDesbloqueados,
          updated_at: new Date().toISOString()
        })
        .eq('id', session.user.id);

      if (error) {
        console.warn('Aviso sincronización Supabase:', error.message);
      }
    }
  } catch (error) {
    console.error('Error al sincronizar con Supabase:', error);
  }
}

// Carga los datos desde Supabase al iniciar sesión o recargar
export async function cargarPerfilDesdeSupabase() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (data && !error) {
        const perfilActual = perfilStore.get();
        // Fusión segura de arrays para no perder progreso local ni remoto
        const apuntesCombinados = Array.from(new Set([
          ...(perfilActual.apuntesCompletados || []),
          ...(data.apuntes_completados || [])
        ]));
        const temasCombinados = Array.from(new Set([
          ...(perfilActual.temasDesbloqueados || ['default']),
          ...(data.temas_desbloqueados || ['default'])
        ]));

        perfilStore.set({
          ...perfilActual,
          xp: data.xp ?? perfilActual.xp,
          nivel: data.level ?? perfilActual.nivel,
          monedas: data.coins ?? perfilActual.monedas,
          prestigio: data.prestigio ?? perfilActual.prestigio,
          multiplicadorXP: data.multiplicador_xp ?? perfilActual.multiplicadorXP,
          cristalesAscension: data.cristales_ascension ?? perfilActual.cristalesAscension,
          apuntesCompletados: apuntesCombinados,
          temaActivo: data.tema_activo ?? perfilActual.temaActivo,
          temasDesbloqueados: temasCombinados
        });
      }
    }
  } catch (error) {
    console.error('Error al cargar perfil de Supabase:', error);
  }
}

// --- FUNCIONES PURAS DE MATEMÁTICAS ---

// Curva de dificultad: Cada nivel cuesta más que el anterior
export const calcularXpNecesaria = (nivel: number) => Math.floor(100 * Math.pow(1.5, nivel - 1));

export function obtenerEstadisticasNivel(nivelActual: number, xpActual: number) {
  const xpRequeridaParaSubir = calcularXpNecesaria(nivelActual);
  const porcentaje = (xpActual / xpRequeridaParaSubir) * 100;
  
  return {
    xpEnEsteNivel: xpActual,
    xpRequerida: xpRequeridaParaSubir,
    porcentaje: Math.min(porcentaje, 100).toFixed(1)
  };
}

// --- ACCIONES CORE DEL SISTEMA ---

export async function completarApunte(idApunte: string, xpBase: number = 50, monedasBase: number = 10) {
  const perfil = perfilStore.get();
  
  // Nivel máximo: No gana más XP hasta que haga Prestigio, pero sí gana monedas
  if (perfil.nivel >= 50) {
    if (!perfil.apuntesCompletados.includes(idApunte)) {
       const perfilActualizado: PerfilEstudiante = {
         ...perfil,
         monedas: perfil.monedas + monedasBase,
         apuntesCompletados: [...perfil.apuntesCompletados, idApunte]
       };
       perfilStore.set(perfilActualizado);
       await sincronizarConSupabase(perfilActualizado);
    }
    return { completado: true, nivelMaximo: true };
  }
  
  if (perfil.apuntesCompletados.includes(idApunte)) return { completado: false, nivelMaximo: false };

  // Multiplicador de XP basado en prestigio
  const xpGanada = Math.floor(xpBase * perfil.multiplicadorXP);
  let nuevaXp = perfil.xp + xpGanada;
  let nuevoNivel = perfil.nivel;
  let nuevasMonedas = perfil.monedas + monedasBase;
  let xpNecesaria = calcularXpNecesaria(nuevoNivel);
  let subioNivel = false;

  // Bucle de subida de nivel
  while (nuevaXp >= xpNecesaria && nuevoNivel < 50) {
    nuevaXp -= xpNecesaria;
    nuevoNivel++;
    nuevasMonedas += 50; // Bono por nivel
    xpNecesaria = calcularXpNecesaria(nuevoNivel);
    subioNivel = true;
  }

  // Si llega a nivel 50, pierde la XP sobrante
  if (nuevoNivel >= 50) {
    nuevoNivel = 50;
    nuevaXp = 0; 
  }

  const perfilActualizado: PerfilEstudiante = {
    ...perfil,
    xp: nuevaXp,
    nivel: nuevoNivel,
    monedas: nuevasMonedas,
    apuntesCompletados: [...perfil.apuntesCompletados, idApunte]
  };

  perfilStore.set(perfilActualizado);
  await sincronizarConSupabase(perfilActualizado);

  return { completado: true, nivelMaximo: nuevoNivel >= 50, subioNivel };
}

// --- EL PROTOCOLO DE ASCENSIÓN (PRESTIGIO) ---

export async function aplicarPrestigio() {
  const perfil = perfilStore.get();
  
  // Verificación de seguridad
  if (perfil.nivel < 50) return false;

  const perfilActualizado: PerfilEstudiante = {
    ...perfil,
    xp: 0,          // Reset de estadísticas
    nivel: 1,       // Reset de estadísticas
    monedas: 0,     // Opcional: Pierde las monedas normales al ascender
    prestigio: perfil.prestigio + 1,
    multiplicadorXP: parseFloat((perfil.multiplicadorXP + 0.25).toFixed(2)), // Sube un 25% la ganancia de XP global
    cristalesAscension: perfil.cristalesAscension + 1 // Recompensa Premium
  };

  perfilStore.set(perfilActualizado);
  await sincronizarConSupabase(perfilActualizado);

  return true;
}

// --- ACCIONES DE LA TIENDA ---

export async function comprarTemaNormal(idTema: string, precio: number) {
  const perfil = perfilStore.get();
  
  if (perfil.monedas >= precio && !perfil.temasDesbloqueados.includes(idTema)) {
    const perfilActualizado: PerfilEstudiante = {
      ...perfil,
      monedas: perfil.monedas - precio,
      temasDesbloqueados: [...perfil.temasDesbloqueados, idTema],
      temaActivo: idTema
    };

    perfilStore.set(perfilActualizado);
    await sincronizarConSupabase(perfilActualizado);
    return true;
  }
  return false;
}

export async function comprarTemaPremium(idTema: string, precioCristales: number) {
  const perfil = perfilStore.get();
  
  if (perfil.cristalesAscension >= precioCristales && !perfil.temasDesbloqueados.includes(idTema)) {
    const perfilActualizado: PerfilEstudiante = {
      ...perfil,
      cristalesAscension: perfil.cristalesAscension - precioCristales,
      temasDesbloqueados: [...perfil.temasDesbloqueados, idTema],
      temaActivo: idTema
    };

    perfilStore.set(perfilActualizado);
    await sincronizarConSupabase(perfilActualizado);
    return true;
  }
  return false;
}

export async function equiparTema(idTema: string) {
  const perfil = perfilStore.get();
  if (perfil.temasDesbloqueados.includes(idTema)) {
    const perfilActualizado: PerfilEstudiante = { ...perfil, temaActivo: idTema };
    perfilStore.set(perfilActualizado);
    await sincronizarConSupabase(perfilActualizado);
    return true;
  }
  return false;
}

export async function comprarBoosterXP(multiplicadorDelta: number, precioMonedas: number, precioCristales: number = 0) {
  const perfil = perfilStore.get();

  if (precioCristales > 0) {
    if (perfil.cristalesAscension >= precioCristales) {
      const nuevoMult = parseFloat((perfil.multiplicadorXP + multiplicadorDelta).toFixed(2));
      const perfilActualizado: PerfilEstudiante = {
        ...perfil,
        cristalesAscension: perfil.cristalesAscension - precioCristales,
        multiplicadorXP: nuevoMult
      };
      perfilStore.set(perfilActualizado);
      await sincronizarConSupabase(perfilActualizado);
      return true;
    }
    return false;
  }

  if (perfil.monedas >= precioMonedas) {
    const nuevoMult = parseFloat((perfil.multiplicadorXP + multiplicadorDelta).toFixed(2));
    const perfilActualizado: PerfilEstudiante = {
      ...perfil,
      monedas: perfil.monedas - precioMonedas,
      multiplicadorXP: nuevoMult
    };
    perfilStore.set(perfilActualizado);
    await sincronizarConSupabase(perfilActualizado);
    return true;
  }
  return false;
}

export async function comprarTitulo(titulo: string, precio: number) {
  const perfil = perfilStore.get();
  const titulos = perfil.titulosDesbloqueados || ['Cadete Técnico'];

  if (perfil.monedas >= precio && !titulos.includes(titulo)) {
    const perfilActualizado: PerfilEstudiante = {
      ...perfil,
      monedas: perfil.monedas - precio,
      titulosDesbloqueados: [...titulos, titulo],
      tituloActivo: titulo
    };
    perfilStore.set(perfilActualizado);
    await sincronizarConSupabase(perfilActualizado);
    return true;
  }
  return false;
}

export async function equiparTitulo(titulo: string) {
  const perfil = perfilStore.get();
  const titulos = perfil.titulosDesbloqueados || ['Cadete Técnico'];
  if (titulos.includes(titulo)) {
    const perfilActualizado: PerfilEstudiante = {
      ...perfil,
      tituloActivo: titulo
    };
    perfilStore.set(perfilActualizado);
    return true;
  }
  return false;
}

export async function abrirCofreMisterioso(precio: number) {
  const perfil = perfilStore.get();
  if (perfil.monedas < precio) return null;

  // Ruleta de recompensas:
  // 60% probabilidad: XP (entre 100 y 350 XP)
  // 30% probabilidad: Monedas bonus (entre 120 y 450 Monedas)
  // 10% probabilidad: 1 Cristal de Ascensión 💎
  const roll = Math.random();
  let tipoRecompensa: 'xp' | 'monedas' | 'cristal' = 'xp';
  let cantidad = 0;

  if (roll < 0.6) {
    tipoRecompensa = 'xp';
    cantidad = Math.floor(Math.random() * 250) + 100;
  } else if (roll < 0.9) {
    tipoRecompensa = 'monedas';
    cantidad = Math.floor(Math.random() * 330) + 120;
  } else {
    tipoRecompensa = 'cristal';
    cantidad = 1;
  }

  let nuevaXp = perfil.xp;
  let nuevoNivel = perfil.nivel;
  let nuevasMonedas = perfil.monedas - precio;
  let nuevosCristales = perfil.cristalesAscension;

  if (tipoRecompensa === 'xp') {
    nuevaXp += Math.floor(cantidad * perfil.multiplicadorXP);
    let xpNecesaria = calcularXpNecesaria(nuevoNivel);
    while (nuevaXp >= xpNecesaria && nuevoNivel < 50) {
      nuevaXp -= xpNecesaria;
      nuevoNivel++;
      nuevasMonedas += 50;
      xpNecesaria = calcularXpNecesaria(nuevoNivel);
    }
  } else if (tipoRecompensa === 'monedas') {
    nuevasMonedas += cantidad;
  } else if (tipoRecompensa === 'cristal') {
    nuevosCristales += cantidad;
  }

  const perfilActualizado: PerfilEstudiante = {
    ...perfil,
    xp: nuevaXp,
    nivel: nuevoNivel,
    monedas: nuevasMonedas,
    cristalesAscension: nuevosCristales
  };

  perfilStore.set(perfilActualizado);
  await sincronizarConSupabase(perfilActualizado);

  return { tipo: tipoRecompensa, cantidad };
}

// --- ACCIONES DE COMBATE Y DUELOS ---

export async function registrarResultadoDuelo(victoria: boolean, xpPremio: number, monedasPremio: number, prestigioPremio: number = 0) {
  const perfil = perfilStore.get();
  const duelosJugados = (perfil.duelosJugados || 0) + 1;
  const duelosGanados = (perfil.duelosGanados || 0) + (victoria ? 1 : 0);

  let nuevaXp = perfil.xp;
  let nuevoNivel = perfil.nivel;
  let nuevasMonedas = perfil.monedas;
  let nuevoPrestigio = perfil.prestigio;

  if (victoria) {
    const xpFinal = Math.floor(xpPremio * perfil.multiplicadorXP);
    nuevaXp += xpFinal;
    nuevasMonedas += monedasPremio;
    nuevoPrestigio += prestigioPremio;

    let xpNecesaria = calcularXpNecesaria(nuevoNivel);
    while (nuevaXp >= xpNecesaria && nuevoNivel < 50) {
      nuevaXp -= xpNecesaria;
      nuevoNivel++;
      nuevasMonedas += 50;
      xpNecesaria = calcularXpNecesaria(nuevoNivel);
    }
  }

  const perfilActualizado: PerfilEstudiante = {
    ...perfil,
    xp: nuevaXp,
    nivel: nuevoNivel,
    monedas: nuevasMonedas,
    prestigio: nuevoPrestigio,
    duelosJugados,
    duelosGanados
  };

  perfilStore.set(perfilActualizado);
  await sincronizarConSupabase(perfilActualizado);

  return {
    victoria,
    nuevoNivel,
    nuevasMonedas,
    duelosGanados,
    duelosJugados
  };
}
