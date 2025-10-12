# Starter Kit

A structured and reusable SCSS and JavaScript starter kit for front-end development.

This kit provides a robust foundation for building modern web interfaces, with a focus on scalability, maintainability, and efficiency.

Based on Bootstrap's core principles, it extends them with custom utilities and modular components to streamline your workflow and accelerate development.

## Features

- Pre-configured **SCSS** files with common utilities and design patterns.
- Reusable **JavaScript components** for common UI elements (e.g., buttons, modals, navigation).
- Easily customizable to fit your project’s needs.
- Built-in SCSS functions for generating clamp() values — enabling fluid, responsive typography and spacing.
- etc..

## Functions

### function normal

```sh
   (
    function: 'normal', // default
    local-vars: (
      'alpha': 1,
    ),
    state: ':active' ':focus',
    class: gap, // if class is not provided, key fallback
    values: map.merge($sizes-regular, $sizes-irregular),
    responsive: true,
    property: gap,
    important: true,
  ),
```

### function fluid

```sh
    (
      function: 'fluid',
      class: px,
      property: padding-inline,
      values: if(meta.variable-exists(spacing-clamp), $spacing-clamp, null),
      responsive: true,
      important: true,
    )
```

### function appy-custom-prop

```sh
    (
      function: 'custom-property-value',
      class: bg,
      property: background-color,
      custom-property-prefix: if(meta.variable-exists(color-prefix), $color-prefix, null)
      values: if(meta.variable-exists(spacing-clamp), $spacing-clamp, null),
      responsive: true,
      important: true,
    )
```

### apply-responsive-prop

```
 'width-responsive-custom-property': (
      function: 'apply-responsive-prop',
      class: wh,
      property-bindings:(
        width: width,
        height: h
      ),
      responsive: true,
    ),
```

### function set-custom-prop

```
    'border-style-custom-property': (
      function: 'set-custom-prop',
      css-variable-name: border-style,
      class: border,
      values: $border-styles,
    ),
```

### function apply-custom-props-at-breakpoints

```
 'custom-properties': (
      function: 'generate-custom-prop',
      values: if(meta.variable-exists(custom-properties), map.get($custom-properties, xs), ()),
    ),

```

### function multi-prop

```sh
   (
    function: 'multi-prop',
    class: fixed-bottom,
    props: (
      position: fixed,
      bottom: 0,
      right: 0,
      left: 0,
      z-index: var(--z-1, 999),
    ),
    responsive: true,
    important: true,
  ),
```

## pattern functions

### function nested-pattern (default)

```sh
   (
    function: 'nested-pattern', // default
    class: revert-spacing,
    complex-selectors: (
      padding: revert,
      margin: revert,
      '*': (
        padding: revert,
        margin: revert,
      ),
    ),
   )
```
