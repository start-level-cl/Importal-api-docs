import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(
  defineConfig({
    title: 'Pascal Store Docs',
    description: 'Documentación técnica de la plataforma Pascal Store - Backend, Lambdas, Auth y Arquitectura',
    outDir: '../docs',
    cleanUrls: true,
    markdown: {
      math: true
    },
    themeConfig: {
      nav: [
        { text: 'Inicio', link: '/' },
        { text: 'Arquitectura', link: '/architecture' },
        { text: 'Guías', items: [
          { text: 'Autenticación (Auth)', link: '/auth' },
          { text: 'Lambdas y Registro', link: '/lambdas' },
          { text: 'Trabajos Internos (Jobs)', link: '/internal-jobs' },
          { text: 'Ajustes y Reembolsos', link: '/adjustments-refunds' },
          { text: 'Flujo de Bodega', link: '/bodeguero-workflow' },
          { text: 'Notificaciones', link: '/notifications' },
          { text: 'Perfil, Direcciones y Facturación', link: '/user-settings' },
          { text: 'Productos y Catálogo', link: '/products' },
          { text: 'Mensajería (Chats)', link: '/messaging' },
          { text: 'Pedidos y Cargas', link: '/orders-cargas' },
          { text: 'Tickets de Soporte', link: '/support-tickets' },
          { text: 'Dashboards y Métricas', link: '/dashboards-metrics' }
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
            { text: 'Trabajos y Cron Jobs', link: '/internal-jobs' },
            { text: 'Ajustes y Reembolsos', link: '/adjustments-refunds' },
            { text: 'Flujo de Bodega', link: '/bodeguero-workflow' },
            { text: 'Notificaciones', link: '/notifications' },
            { text: 'Perfil, Direcciones y Facturación', link: '/user-settings' }
          ]
        },
        {
          text: 'Módulos de la API',
          items: [
            { text: 'Productos y Catálogo', link: '/products' },
            { text: 'Mensajería (Chats)', link: '/messaging' },
            { text: 'Pedidos y Cargas', link: '/orders-cargas' },
            { text: 'Tickets de Soporte', link: '/support-tickets' },
            { text: 'Dashboards y Métricas', link: '/dashboards-metrics' },
            { text: 'Admin API (Referencia)', link: '/admin-api' }
          ]
        }
      ],
      socialLinks: [
        { icon: 'github', link: 'https://github.com/' }
      ],
      footer: {
        message: 'Portal de Documentación Técnica - Pascal Store',
        copyright: 'Copyright © 2026'
      }
    }
  })
)
