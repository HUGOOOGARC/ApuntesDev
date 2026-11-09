import { persistentMap } from '@nanostores/persistent';
import { supabase } from '../lib/supabase';

// 1. Definimos la forma exacta de los datos del estudiante
export interface PerfilEstudiante {
  temaActivo: string;
  temasDesbloqueados: string[];
  xp: number;
  nivel: number;
  monedas: number;
  prestigio: number;
  multiplicadorXP: number;
  cristalesAscension: number; // NUEVO: La moneda premium del Endgame
  apuntesCompletados: string[];
}

// 2. Valores iniciales para un usuario nuevo
const valoresIniciales: PerfilEstudiante = {
  temaActivo: 'default',
  temasDesbloqueados: ['default'],
  xp: 0,
  nivel: 1,
  monedas: 0,
  prestigio: 0,
  multiplicadorXP: 1.0,
  cristalesAscension: 0,
  apuntesCompletados: []
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
      await supabase
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
          temas_desbloqueados: nuevoPerfil.temasDesbloqueados
        })
        .eq('id', session.user.id);
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
        perfilStore.set({
          ...perfilActual,
          xp: data.xp ?? perfilActual.xp,
          nivel: data.level ?? perfilActual.nivel,
          monedas: data.coins ?? perfilActual.monedas,
          prestigio: data.prestigio ?? perfilActual.prestigio,
          multiplicadorXP: data.multiplicador_xp ?? perfilActual.multiplicadorXP,
          cristalesAscension: data.cristales_ascension ?? perfilActual.cristalesAscension,
          apuntesCompletados: data.apuntes_completados ?? perfilActual.apuntesCompletados,
          temaActivo: data.tema_activo ?? perfilActual.temaActivo,
          temasDesbloqueados: data.temas_desbloqueados ?? perfilActual.temasDesbloqueados
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
    monedas: 0,     // Opcional: Pierde las monedas normales al ascender (ajusta a gusto)
    prestigio: perfil.prestigio + 1,
    multiplicadorXP: perfil.multiplicadorXP + 0.25, // Sube un 25% la ganancia de XP global
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