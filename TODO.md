# function normal

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

# function fluid

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

# function custom-property-values

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

# function properties-advanced

```sh
   (
    function: 'properties-advanced',
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

# function nested-rules

```sh
   (
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

# function css-var

```sh
    (
    function: 'css-var',
    css-variable-name: border-clr,
    class: border-clr,
    custom-property-prefix: if(meta.variable-exists(color-prefix), $color-prefix, null),
    values: if(meta.variable-exists(selected-theme-hex-colors), $selected-theme-hex-colors, null),
    // values: map-loop($selected-theme-rgb-colors, rgba-css-var-advanced, '$key', null, $color-prefix),
    // values: if(meta.variable-exists(selected-theme-hex-colors), $selected-theme-hex-colors, null),
    )
```

https://picsum.photos/id/237/200/300

// am überlegen
custom media query für utilities
remove Utils class
accordion input fixed, sodass mein auch mehrere dom objkect üvergeben kann anstatt string
accordion öffnen lassen beim start
transition überbearbeiten
flow space --custom property responsive / function: 'nested-rules' with breakpoints,

not mandatory:
sticky table
modal
mdn sticky scrollable sidebar

children/direct children arbirtary value
responsive pattern custom properties überarbeiten
@supports

in patterns custom variabbles adden
hover:text-underline in hover:underline ändern
values dashed entfernen wenn man class so was hat   class: hover\:,
      values: (
        underline: underline,
        no-underline: none,
        overline: overline,
        line-through: line-through,
      ),

      children a text inherit
