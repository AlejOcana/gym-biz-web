/** Default site content — FitZone Gym (ES). The admin edits a deep copy of this. */
import type { SiteContent } from './types';

export const DEFAULT_SITE: SiteContent = {
  name: 'FitZone Gym',
  vertical: 'gym',
  hero: {
    title: 'Transforma tu cuerpo',
    subtitle:
      'Entrena con los mejores profesionales en instalaciones de primera categoría',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80',
    ctaText: '¡Pide tu primera clase gratuita!',
  },
  services: [
    { id: 's1', name: 'Spinning', description: 'Clases de bicicleta indoor con música y motivación a tope', icon: 'bike', order: 1, imageUrl: 'https://picsum.photos/seed/fitness-spinning/800/600' },
    { id: 's2', name: 'Musculación', description: 'Sala de pesas con equipamiento profesional y asesoramiento', icon: 'dumbbell', order: 2, imageUrl: 'https://picsum.photos/seed/fitness-weights/800/600' },
    { id: 's3', name: 'Yoga', description: 'Clases de yoga para cuidar cuerpo y mente', icon: 'lotus', order: 3, imageUrl: 'https://picsum.photos/seed/fitness-yoga/800/600' },
    { id: 's4', name: 'Boxeo', description: 'Entrenamiento de boxeo para todos los niveles', icon: 'boxing', order: 4, imageUrl: 'https://picsum.photos/seed/fitness-boxing/800/600' },
  ],
  schedule: [
    { id: 'sch1', dayOfWeek: 1, className: 'Spinning', time: '08:00', instructor: 'María', duration: 45, capacity: 12 },
    { id: 'sch2', dayOfWeek: 1, className: 'Yoga', time: '10:00', instructor: 'Carlos', duration: 60, capacity: 10 },
    { id: 'sch3', dayOfWeek: 1, className: 'Boxeo', time: '18:00', instructor: 'Pedro', duration: 60, capacity: 14 },
    { id: 'sch4', dayOfWeek: 2, className: 'Musculación', time: '07:00', instructor: 'Carlos', duration: 90, capacity: 20 },
    { id: 'sch5', dayOfWeek: 2, className: 'Spinning', time: '09:00', instructor: 'María', duration: 45, capacity: 12 },
    { id: 'sch6', dayOfWeek: 2, className: 'Yoga', time: '12:00', instructor: 'Carlos', duration: 60, capacity: 10 },
    { id: 'sch7', dayOfWeek: 3, className: 'Boxeo', time: '17:00', instructor: 'Pedro', duration: 60, capacity: 14 },
    { id: 'sch8', dayOfWeek: 3, className: 'Spinning', time: '19:00', instructor: 'María', duration: 45, capacity: 12 },
    { id: 'sch9', dayOfWeek: 4, className: 'Musculación', time: '08:00', instructor: 'Carlos', duration: 90, capacity: 20 },
    { id: 'sch10', dayOfWeek: 4, className: 'Yoga', time: '11:00', instructor: 'Carlos', duration: 60, capacity: 10 },
    { id: 'sch11', dayOfWeek: 5, className: 'Spinning', time: '08:00', instructor: 'María', duration: 45, capacity: 12 },
    { id: 'sch12', dayOfWeek: 5, className: 'Boxeo', time: '18:30', instructor: 'Pedro', duration: 60, capacity: 14 },
  ],
  pricing: [
    {
      id: 'p1',
      name: 'Básico',
      price: 29,
      features: ['Acceso a sala de musculación', 'Horarios limitados', '1 clase grupal / semana'],
      isPopular: false,
      order: 1,
    },
    {
      id: 'p2',
      name: 'Completo',
      price: 49,
      features: ['Acceso ilimitado', 'Todas las clases grupales', 'Entrenador personal 1 vez / mes', 'Sauna'],
      isPopular: true,
      order: 2,
    },
    {
      id: 'p3',
      name: 'Premium',
      price: 79,
      features: ['Todo incluido', 'Entrenador personal semanal', 'Plan de nutrición', 'Evaluación mensual'],
      isPopular: false,
      order: 3,
    },
  ],
  trainers: [
    { id: 't1', name: 'María López', specialty: 'Spinning · Cardio', bio: '8 años motivando clases a tope. Certificada por Les Mills.', initials: 'ML' },
    { id: 't2', name: 'Carlos Ruiz', specialty: 'Musculación · Yoga', bio: 'Fisioterapeuta y entrenador personal. Especialista en movilidad.', initials: 'CR' },
    { id: 't3', name: 'Pedro Sánchez', specialty: 'Boxeo · HIIT', bio: 'Ex-boxeador amateur. Entrena técnica y condición física.', initials: 'PS' },
  ],
  news: [
    {
      id: 'n1',
      title: 'Nuevo horario de verano',
      content:
        'Durante el mes de agosto modificamos nuestro horario de apertura para adaptarnos a las necesidades de nuestros socios. El nuevo horario permitirá entrenar a primera hora de la mañana y a última hora de la tarde.',
      excerpt: 'Modificaciones en el horario de apertura durante agosto',
      publishedAt: '2024-07-15',
      isActive: true,
    },
    {
      id: 'n2',
      title: 'Clase de prueba gratuita',
      content:
        'Prueba cualquiera de nuestras clases sin compromiso. ¡Ven a conocernos! Te esperamos con los brazos abiertos y un plan de entrenamiento a tu medida.',
      excerpt: 'Ven a probar nuestras instalaciones gratuitamente',
      publishedAt: '2024-06-20',
      isActive: true,
    },
  ],
  contact: {
    email: 'info@fitzonegym.es',
    phone: '+34 612 345 678',
    address: 'Calle Principal 123',
    city: 'Madrid',
    socialLinks: [
      { platform: 'instagram', url: 'https://instagram.com/fitzone' },
      { platform: 'facebook', url: 'https://facebook.com/fitzone' },
    ],
  },
  footer: { copyright: '© 2024 FitZone Gym. Todos los derechos reservados.' },
  lastUpdated: new Date().toISOString(),
};
