import { ComponentProps } from '../modules/types';
declare class Component<T> {
    constructor(options?: ComponentProps);
    query?: string;
    className?: string;
    parent?: HTMLElement | JQuery<HTMLElement> | null;
    $element?: JQuery<HTMLElement>;
    element?: HTMLElement | null;
    options?: ComponentProps;
    props?: T;
    getElement(): HTMLElement | JQuery<HTMLElement> | null | undefined;
    renderComponent(): void;
    private isValidQuery;
    init(): void;
}
export default Component;
