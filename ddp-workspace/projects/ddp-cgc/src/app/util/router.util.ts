import { Route } from '../constants/route';
import { FuncType } from 'ddp-sdk';

export const isRoute: FuncType<boolean> = (route: Route) => location.pathname === `/${route}`;
