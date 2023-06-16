

type RouterFunction = (value: string) => boolean;

const ROUTES: string[] = [
  "users/authenticate",
];

export const isProtectedRoute: RouterFunction = (value: string) => {
  let response = true;

  for (const route of ROUTES) {
    if (value.includes(route)) {
      response = false;
      break;
    }
  }

  return response;
}
