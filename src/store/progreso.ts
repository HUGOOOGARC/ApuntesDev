import { persistentMap } from '@nanostores/persistent';
import { supabase } from '../lib/supabase';

// 1. Definimos exactamente qué forma tienen los datos de nuestro estudiante
export interface PerfilEstudiante {
  temaActivo: string;
  temasDesbloqueados: string[];
  xp: number;
  nivel: number;
  monedas: number;
  prestigio: number;
  multiplicadorXP: number;
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
  apuntesCompletados: []
};

// 3. Creamos el Store persistente sincronizado con localStorage (funciona de caché rápida)
export const perfilStore = persistentMap<PerfilEstudiante>(
  'apuntesdev_perfil:',
  valoresIniciales,
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
);

// --- FUNCIÓN AUXILIAR DE SINCRONIZACIÓN CON SUPABASE ---
// Guarda TODOS los datos actuales del store en la base de datos de Supabase
async function sincronizarConSupabase(nuevoPerfil: PerfilEstudiante) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase
        .from('profiles')
        .update({
          xp: nuevoPerfil.xp,
          coins: nuevoPerfil.monedas,
          level: nuevoPerfil.nivel,
          prestigio: nuevoPerfil.prestigio,
          multiplicador_xp: nuevoPerfil.multiplicadorXP,
          apuntes_completados: nuevoPerfil.apuntesCompletados,
          // Si añades columnas para los temas en el futuro, las mapeas aquí también
        })
        .eq('id', session.user.id);
    }
  } catch (error) {
    console.error('Error al sincronizar con Supabase:', error);
  }
}

// Función para cargar los datos desde Supabase al iniciar sesión o recargar
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
          apuntesCompletados: data.apuntes_completados ?? perfilActual.apuntesCompletados,
        });
      }
    }
  } catch (error) {
    console.error('Error al cargar perfil de Supabase:', error);
  }
}

// --- FUNCIONES PURAS DE MATEMÁTICAS ---
export const calcularXpNecesaria = (nivel: number) => Math.floor(100 * Math.pow(1.5, nivel - 1));

// --- ACCIONES DEL SISTEMA ---

export async function completarApunte(idApunte: string, xpBase: number = 50, monedasBase: number = 10) {
  const perfil = perfilStore.get();
  
  // Si ya lo completó, no hacemos nada
  if (perfil.apuntesCompletados.includes(idApunte)) return false;

  // Calculamos la XP con el boost del prestigio
  const xpGanada = Math.floor(xpBase * perfil.multiplicadorXP);
  let nuevaXp = perfil.xp + xpGanada;
  let nuevoNivel = perfil.nivel;
  let nuevasMonedas = perfil.monedas + monedasBase;

  let xpNecesaria = calcularXpNecesaria(nuevoNivel);

  // Bucle por si gana tanta XP que sube varios niveles de golpe
  while (nuevaXp >= xpNecesaria) {
    nuevaXp -= xpNecesaria;
    nuevoNivel++;
    nuevasMonedas += 50; // Bono por subir de nivel
    xpNecesaria = calcularXpNecesaria(nuevoNivel);
  }

  const perfilActualizado: PerfilEstudiante = {
    ...perfil,
    xp: nuevaXp,
    nivel: nuevoNivel,
    monedas: nuevasMonedas,
    apuntesCompletados: [...perfil.apuntesCompletados, idApunte]
  };

  // Guardamos en el store local y sincronizamos con Supabase de inmediato
  perfilStore.set(perfilActualizado);
  await sincronizarConSupabase(perfilActualizado);

  return true;
}

export async function aplicarPrestigio() {
  const perfil = perfilStore.get();
  if (perfil.nivel < 50) return false;

  const perfilActualizado: PerfilEstudiante = {
    ...perfil,
    xp: 0,
    nivel: 1,
    monedas: 0,
    prestigio: perfil.prestigio + 1,
    multiplicadorXP: perfil.multiplicadorXP + 0.25,
  };

  perfilStore.set(perfilActualizado);
  await sincronizarConSupabase(perfilActualizado);

  return true;
}

// --- ACCIONES DE LA TIENDA ---

export async function comprarTema(idTema: string, precio: number) {
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