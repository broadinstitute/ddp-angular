import { Route } from '../constants/route';

export const isRoute = (route: Route) => location.pathname === `/${route}`;
