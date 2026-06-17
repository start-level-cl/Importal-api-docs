import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Importal Docs',
  description: 'Documentación técnica de la plataforma Importal - Backend, Lambdas, Auth y Arquitectura',
  outDir: '../docs',
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: 'Inicio', link: '/' },
      { text: 'Arquitectura', link: '/architecture' },
      { text: 'Guías', items: [
        { text: 'Autenticación (Auth)', link: '/auth' },
        { text: 'Lambdas y Registro', link: '/lambdas' },
        { text: 'Trabajos Internos (Jobs)', link: '/internal-jobs' }
      ]},
      { text: 'Referencia API ↗', link: '/reference.html', target: '_blank' }
    ],
    sidebar: [
      {
        text: 'Información General',
        items: [
          { text: 'Introducción', link: '/' },
          { text: 'Arquitectura Global', link: '/architecture' }
        ]
      },
      {
        text: 'Servicios y Procesos',
        items: [
          { text: 'Autenticación y Sesiones', link: '/auth' },
          { text: 'Registro y Lambdas', link: '/lambdas' },
          { text: 'Trabajos y Cron Jobs', link: '/internal-jobs' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/' }
    ],
    footer: {
      message: 'Portal de Documentación Técnica - Importal',
      copyright: 'Copyright © 2026'
    }
  }
})
