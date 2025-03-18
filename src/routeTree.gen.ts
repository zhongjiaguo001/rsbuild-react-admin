/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'

// Create Virtual Routes

const IndexLazyImport = createFileRoute('/')()
const SettingsIndexLazyImport = createFileRoute('/settings/')()
const ContactIndexLazyImport = createFileRoute('/contact/')()
const ChatIndexLazyImport = createFileRoute('/chat/')()

// Create/Update Routes

const IndexLazyRoute = IndexLazyImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

const SettingsIndexLazyRoute = SettingsIndexLazyImport.update({
  id: '/settings/',
  path: '/settings/',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/settings/index.lazy').then((d) => d.Route),
)

const ContactIndexLazyRoute = ContactIndexLazyImport.update({
  id: '/contact/',
  path: '/contact/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/contact/index.lazy').then((d) => d.Route))

const ChatIndexLazyRoute = ChatIndexLazyImport.update({
  id: '/chat/',
  path: '/chat/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/chat/index.lazy').then((d) => d.Route))

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/chat/': {
      id: '/chat/'
      path: '/chat'
      fullPath: '/chat'
      preLoaderRoute: typeof ChatIndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/contact/': {
      id: '/contact/'
      path: '/contact'
      fullPath: '/contact'
      preLoaderRoute: typeof ContactIndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/settings/': {
      id: '/settings/'
      path: '/settings'
      fullPath: '/settings'
      preLoaderRoute: typeof SettingsIndexLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexLazyRoute
  '/chat': typeof ChatIndexLazyRoute
  '/contact': typeof ContactIndexLazyRoute
  '/settings': typeof SettingsIndexLazyRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexLazyRoute
  '/chat': typeof ChatIndexLazyRoute
  '/contact': typeof ContactIndexLazyRoute
  '/settings': typeof SettingsIndexLazyRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexLazyRoute
  '/chat/': typeof ChatIndexLazyRoute
  '/contact/': typeof ContactIndexLazyRoute
  '/settings/': typeof SettingsIndexLazyRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/chat' | '/contact' | '/settings'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/chat' | '/contact' | '/settings'
  id: '__root__' | '/' | '/chat/' | '/contact/' | '/settings/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexLazyRoute: typeof IndexLazyRoute
  ChatIndexLazyRoute: typeof ChatIndexLazyRoute
  ContactIndexLazyRoute: typeof ContactIndexLazyRoute
  SettingsIndexLazyRoute: typeof SettingsIndexLazyRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexLazyRoute: IndexLazyRoute,
  ChatIndexLazyRoute: ChatIndexLazyRoute,
  ContactIndexLazyRoute: ContactIndexLazyRoute,
  SettingsIndexLazyRoute: SettingsIndexLazyRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/chat/",
        "/contact/",
        "/settings/"
      ]
    },
    "/": {
      "filePath": "index.lazy.tsx"
    },
    "/chat/": {
      "filePath": "chat/index.lazy.tsx"
    },
    "/contact/": {
      "filePath": "contact/index.lazy.tsx"
    },
    "/settings/": {
      "filePath": "settings/index.lazy.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
