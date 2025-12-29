export const menuConfig = [
  {
    type: 'item',
    label: 'Inicio',
    to: '/',
    auth: 'both'
  },
  {
    type: 'item',
    label: 'Sobre Nosotros',
    to: '/sobre-nosotros',
    auth: 'both'
  },
  {
    type: 'item',
    label: 'Blog',
    to: '/blog',
    auth: 'both'
  },
  ,
  {
    type: 'item',
    label: 'Portafolio',
    to: '/portafolio',
    auth: 'both'
  },
  {
    type: 'dropdown',
    label: 'Servicios',
    auth: 'both',
    children: [
      { label: 'Admisiones', to: '/admisiones' },
      { label: 'Académico', to: '/academico' },
      { label: 'Investigación', to: '/investigacion' }
    ]
  },

  /* 🔐 SOLO USUARIO AUTENTICADO */
  {
    type: 'avatar',
    name: 'Abdias',
    src: 'https://i.pravatar.cc/100',
    auth: 'user',
    children: [
      { label: 'Perfil', to: '/admin/profile' },
      { label: 'Cerrar sesión', action: 'logout' }
    ]
  },

  /* 🚪 SOLO INVITADO */
  {
    type: 'item',
    label: 'Iniciar Sesión',
    to: '/login',
    auth: 'guest'
  },
  {
    type: 'item',
    label: 'Crear cuenta gratis',
    to: '/register',
    auth: 'guest'
  }
]
