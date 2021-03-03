import router from 'page';
import { createSignal } from 'solid-js'
import Home from 'pages/home'
import NotFound from 'pages/404'

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/about',
    component: () => import('pages/about')
  },
  {
    path: '*',
    component: NotFound
  }
]

export default () => {
  const [page, setPage] = createSignal(null)
  
  const addRouter = (path, component) => {
    router(path, async () => {
      if (typeof component().then === 'function') {
        // Preloader for dynamic page
        setPage(() => (<div>Loading ...</div>))

        await component().then(resp => {
          setPage(resp.default())
        })
      }
      else {
        setPage(component())
      }
    })
  }
  
  // Add each routes to Router
  routes.forEach(({ path, component }) => {
    addRouter(path, component)
  })
  
  // Router start listening
  router({ hashbang: true })

  return page
}