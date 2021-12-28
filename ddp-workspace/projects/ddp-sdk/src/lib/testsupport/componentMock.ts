import { Component } from '@angular/core';

/**
 * Examples:
 * MockComponent({ selector: 'some-component' });
 * MockComponent({ selector: 'some-component', inputs: ['some-input', 'some-other-input'] });
 */

export function mockComponent(options: Component): Component {

  const metadata: Component = {
    selector: options.selector,
    template: options.template || '',
    inputs: options.inputs || []
  };

  class Mock {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return Component(metadata)(Mock as any);
}
