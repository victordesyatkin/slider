import { Props } from './types';
declare global {
  interface Window {
    $: JQuery;
  }
  interface JQuery {
    slider(props?: Props): JQuery;
  }
}

declare module '*.scss';
