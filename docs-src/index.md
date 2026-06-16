---
layout: home

hero:
  name: "Importal Docs"
  text: "Portal Técnico de la Plataforma"
  tagline: "Documentación unificada de Backend, Auth, Lambdas y Arquitectura de Sistemas"
  actions:
    - theme: brand
      text: Comenzar Guías
      link: /architecture
    - theme: alt
      text: Referencia API
      link: /reference.html
  image:
    src: https://vitepress.dev/vitepress-logo-large.png
    alt: Importal Logo

features:
  - icon: 🛡️
    title: Autenticación Unificada (Auth)
    details: Flujo de tokens JWT de corta duración y refresh tokens en cookies seguras HTTPS/Only.
  - icon: ⚙️
    title: Backend NestJS
    details: Lógica de negocio transaccional para Clientes, Vendedores y Bodegueros con PostgreSQL.
  - icon: ⚡
    title: Arquitectura Serverless (Lambdas)
    details: Microservicios en AWS Lambdas para el flujo de registro, verificación OTP y colas SQS.
  - icon: 📈
    title: Tareas Programadas y Cron Jobs
    details: Conciliación financiera de pagos, cálculo de moras con intereses y reportes PDF.
---
