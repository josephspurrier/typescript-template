import { z } from '@/lib/z';

interface RouteList {
  [property: string]: () => JSX.Element;
}

// Both set of different routes and template generation functions
const routes = {} as RouteList;

// Register a template (this is to mimic a template engine)
// const templates = {} as RouteList;
// export const template = (
//   name: string,
//   templateFunction: () => JSX.Element,
// ): (() => JSX.Element) => {
//   return (templates[name] = templateFunction);
// };

// Define the routes. Each route is described with a route path & a template to render
// when entering that path. A template can be a string (file name), or a function that
// will directly create the DOM objects.
export const route = (
  parent: HTMLElement,
  path: string,
  template: () => JSX.Element,
): (() => JSX.Element) => {
  z.state.rootParent = parent;

  // Register the router event listeners.
  if (!z.state.routerActive) {
    console.log('Router active.');
    z.state.routerActive = true;
    // For first load or when routes are changed in browser url box.
    window.addEventListener('load', router);
    window.addEventListener('hashchange', router);
  }

  return (routes[path] = template);
};

// Give the correspondent route (template) or fail
const resolveRoute = (route: string) => {
  try {
    return routes[route];
  } catch (error) {
    throw new Error('The route is not defined');
  }
};

// The actual router, get the current URL and generate the corresponding template
export const router = (): void => {
  let url = window.location.hash.slice(1) || '/';
  if (z.state.routerPrefix === '') {
    url = window.location.pathname;
  }
  const routeResolved = resolveRoute(url);
  if (routeResolved) {
    z.render(z.state.rootParent, routeResolved);
  } else {
    const error404 = resolveRoute('/404');
    if (error404) {
      z.render(z.state.rootParent, error404);
      return;
    }

    console.log('Route not found');
    z.render(z.state.rootParent, '404 Page not found');
  }
};
