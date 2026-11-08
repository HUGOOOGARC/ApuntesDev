import { persistentMap } from '@nanostores/persistent';

// 1. Definimos exactamente qué forma tienen los datos de nuestro estudiante
export interface PerfilEstudiante {
  xp: number;
  nivel: number;
  monedas: number;
  prestigio: number;
  multiplicadorXP: number;
  apuntesCompletados: string[]; // Guardaremos las URLs de los apuntes leídos
}

// 2. Valores iniciales para un usuario nuevo
const valoresIniciales: PerfilEstudiante = {
  xp: 0,
  nivel: 1,
  monedas: 0,
  prestigio: 0,
  multiplicadorXP: 1.0,
  apuntesCompletados: []
};

// 3. Creamos el Store persistente. Esto se guarda solo en localStorage y se sincroniza.
// El 'json' indica que vamos a guardar un objeto complejo.
export const perfilStore = persistentMap<PerfilEstudiante>(
  'apuntesdev_perfil:',
  valoresIniciales,
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
);

// --- FUNCIONES PURAS DE MATEMÁTICAS ---

// Fórmula: Cada nivel pide un 50% más de XP que el anterior (base 100)
export const calcularXpNecesaria = (nivel: number) => Math.floor(100 * Math.pow(1.5, nivel - 1));

// --- ACCIONES DEL SISTEMA ---

export function completarApunte(idApunte: string, xpBase: number = 50, monedasBase: number = 10) {
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

  // Guardamos todo el estado actualizado de golpe
  perfilStore.set({
    ...perfil,
    xp: nuevaXp,
    nivel: nuevoNivel,
    monedas: nuevasMonedas,
    apuntesCompletados: [...perfil.apuntesCompletados, idApunte]
  });

  return true;
}

export function aplicarPrestigio() {
  const perfil = perfilStore.get();
  
  // Condición para el prestigio (ej. ser nivel 50 mínimo)
  if (perfil.nivel < 50) return false;

  perfilStore.set({
    ...perfil,
    xp: 0, // Reseteo
    nivel: 1, // Reseteo
    monedas: 0, // Reseteo
    prestigio: perfil.prestigio + 1, // Sube un rango de prestigio
    multiplicadorXP: perfil.multiplicadorXP + 0.25, // +25% de XP permanente por cada prestigio
    // Ojo: no reseteamos los apuntesCompletados para que la web siga marcando lo que ya ha leído,
    // a menos que quieras que tenga que leer todo de nuevo.
  });

  return true;
}