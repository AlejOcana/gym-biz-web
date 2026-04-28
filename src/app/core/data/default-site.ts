import { BusinessSite } from '../models/site.models';

export const DEFAULT_SITE: BusinessSite = {
  id: 'gym-demo',
  name: 'FitZone Gym',
  vertical: 'gym',
  hero: {
    title: 'Transforma tu cuerpo',
    subtitle: 'Entrena con los mejores profesionales en instalaciones de primera categoría',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80',
    ctaText: '¡Pide tu primera clase gratuita!',
    ctaLink: '#contact'
  },
  services: [
    { id: 's1', name: 'Spinning', description: 'Clases de bicicleta indoor con música y motivación', icon: 'bike', order: 1 },
    { id: 's2', name: 'Musculación', description: 'Sala de pesas con equipamiento profesional', icon: 'dumbbell', order: 2 },
    { id: 's3', name: 'Yoga', description: 'Clases de yoga para cuerpo y mente', icon: 'lotus', order: 3 },
    { id: 's4', name: 'Boxeo', description: 'Entrenamiento de boxeo para todos los niveles', icon: 'boxing', order: 4 }
  ],
  news: [
    { id: 'n1', title: 'Nuevo horario de verano', content: 'Durante el mes de agosto modificamos nuestro horario de apertura para adaptarnos a las necesidades de nuestros socios. El nuevo horario permitirá entrenar a primera hora de la mañana y última hora de la tarde.', excerpt: 'Modificaciones en el horario de apertura durante agosto', publishedAt: new Date('2024-07-15'), isActive: true },
    { id: 'n2', title: 'Clase de prueba gratuita', content: 'Prueba cualquiera de nuestras clases sin compromiso. ¡Venga a conocernos! Te esperamos con los brazos abiertos.', excerpt: 'Ven a probar nuestras instalaciones gratuitamente', publishedAt: new Date('2024-06-20'), isActive: true }
  ],
  schedule: [
    { id: 'sch1', dayOfWeek: 1, className: 'Spinning', time: '08:00', instructor: 'María', duration: 45 },
    { id: 'sch2', dayOfWeek: 1, className: 'Yoga', time: '10:00', instructor: 'Carlos', duration: 60 },
    { id: 'sch3', dayOfWeek: 1, className: 'Boxeo', time: '18:00', instructor: 'Pedro', duration: 60 },
    { id: 'sch4', dayOfWeek: 2, className: 'Musculación', time: '07:00', instructor: '', duration: 0 },
    { id: 'sch5', dayOfWeek: 2, className: 'Spinning', time: '09:00', instructor: 'María', duration: 45 },
    { id: 'sch6', dayOfWeek: 2, className: 'Yoga', time: '12:00', instructor: 'Carlos', duration: 60 },
    { id: 'sch7', dayOfWeek: 3, className: 'Boxeo', time: '17:00', instructor: 'Pedro', duration: 60 },
    { id: 'sch8', dayOfWeek: 3, className: 'Spinning', time: '19:00', instructor: 'María', duration: 45 },
    { id: 'sch9', dayOfWeek: 4, className: 'Musculación', time: '08:00', instructor: '', duration: 0 },
    { id: 'sch10', dayOfWeek: 4, className: 'Yoga', time: '11:00', instructor: 'Carlos', duration: 60 }
  ],
  pricing: [
    { id: 'p1', name: 'Básico', price: 29, period: 'month', features: ['Acceso a sala de musculación', 'Horarios limitados', '1 clase grupal/semana'], isPopular: false, order: 1 },
    { id: 'p2', name: 'Completo', price: 49, period: 'month', features: ['Acceso ilimitado', 'Todas las clases grupales', 'Entrenador personal 1 vez/mes', 'Sauna'], isPopular: true, order: 2 },
    { id: 'p3', name: 'Premium', price: 79, period: 'month', features: ['Todo incluido', 'Entrenador personal semanal', 'Nutrición', 'Evaluación mensual'], isPopular: false, order: 3 }
  ],
  contact: {
    email: 'info@fitzonegym.es',
    phone: '+34 612 345 678',
    address: 'Calle Principal 123',
    city: 'Madrid',
    socialLinks: [
      { platform: 'instagram', url: 'https://instagram.com/fitzone' },
      { platform: 'facebook', url: 'https://facebook.com/fitzone' }
    ]
  },
  footer: {
    copyright: '© 2024 FitZone Gym. Todos los derechos reservados.'
  },
  lastUpdated: new Date()
};