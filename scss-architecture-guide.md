# SCSS Architecture & Guidelines

Welcome to the SCSS structure of this project.

This project follows a **component-based** and **utility class** approach for styling. The goal is to keep the codebase **modular**, **scalable**, and **easy to maintain**, especially as the project grows.

## Structure Overview

The SCSS files are organized into several key layers:

### 1. Component Styles (`/components`)

Each component (e.g., button, header, card) in `/components` has its own SCSS file.
These styles are tightly scoped to the specific component and do not affect global styles.

We follow the **[BEM (Block Element Modifier)](http://getbem.com/)** naming convention for all components to ensure clarity and consistency.

Example:

```scss
.card {
}
.card__title {
}
.card__image {
}
.card--highlighted {
}

// or

.card {
  &__title {
  }
  &__image {
  }
  &--highlighted {
  }
}
```

### 2. Utility Classes (`/utils`)

Utility classes are single-purpose classes used for quick styling adjustments like margins, paddings, text alignment, etc.
These follow the [utility-first](https://tailwindcss.com/docs/utility-first) design philosophy, inspired by frameworks like Tailwind CSS.

Example:

```html
<button class="btn bg-gray m-2 p-4 text-center">Click me</button>
```

### 3. Layout Grid System (`/layout`)

For the layout of components, you can use either the **Bootstrap grid system** or a **custom grid system** implemented in:

`/layout`

The custom grid offers more control and flexibility if Bootstrap doesn't fit certain design requirements.

## Best Practices

- **One component = one SCSS file in /components**
- **Avoid global styles unless necessary**
- **Use utility classes for layout and spacing**
- **Keep selectors flat and simple**
- **Follow naming conventions (BEM or your team’s standard)**

## Compiling

Each SCSS folder contains an `_index.scss` file that uses `@forward` to expose the folder's partials. These `_index.scss` files act as entry points for their respective modules.

> ⚠️ **Important:** All SCSS files except the main file **must be prefixed with an underscore** (e.g., `_buttons.scss`). This ensures they are treated as partials and **not compiled individually** by the SCSS compiler.

The main `scss/style.scss` file imports all necessary modules using `@use`, typically pointing to each folder's `_index.scss`. This modular structure keeps the codebase organized and makes it easy to scale or maintain.

For details on how SCSS modules are structured and loaded using @use and @forward, check the official Sass documentation here:

[@use](https://sass-lang.com/documentation/at-rules/use/)

[@forward](https://sass-lang.com/documentation/at-rules/forward/)

Every `main SCSS file` is compiled via Webpack. Entry point:

```scss
src/js/index.js
```

```
// index.js

import "../scss/style.scss"
import "../scss/your-scss.scss"

```

You can add additionaly entry points in Webpack by modifying the configuration file.  
For detailed instructions, please refer to the included guide.

## Creating a Utility Class

Utility classes are defined using a centralized `$utilities` Sass map located in `abstracts/_utilities.scss`.  
Each entry in this map describes a group of utility classes based on a specific CSS property.

We use a generator function defined in `utilities/_generator.scss` to automatically create the utility classes from the map entries. This approach ensures consistency, reduces redundancy, and makes it easy to scale.

> ℹ️ Our system is inspired by Bootstrap's utility generator logic and uses Bootstrap's Sass functions and mixins under the hood.  
> See the Bootstrap source for reference: [https://github.com/twbs/bootstrap](https://github.com/twbs/bootstrap/tree/main/scss)

Here’s an example of how to define a custom utility group:

```scss
$utilities: map-merge(
  $utilities,
  (
    'example': (
      class: d,
      property: display,
      values: inline block flex,
      responsive: true // default false,
      important: true // default false,,,,,,,,,,,,,
    ),
  )
);
```

This configuration will generate:

```scss
.d-inline {
  display: inline !important;
}

.d-block {
  display: block !important;
}

.d-flex {
  display: flex !important;
}

@media (min-width: 576px) {
  .d-sm-inline {
    display: inline !important;
  }
  ...
}

@media (min-width: 768px) {
  .d-sm-inline {
    display: inline !important;
  }

  ...
}

@media (min-width: 992px) {
  .d-sm-inline {
    display: inline !important;
  }
  ...
}

...

The media query breakpoints are based on the $grid-breakpoints defined in abstracts/_variables.scss.
```

### Adding Advanced Logic with a Custom Mixin Function

You can also attach a custom function to your utility definition to implement more advanced or dynamic logic:

```
"example": (
      function: "your-function",
      ...
    ),
```

Afterward:

Define your custom mixin in abstracts/\_mixins.scss using the same name as the function:

```
_mixins.scss

@mixin your-function() {
  ....
}

```

Locate the @mixin generate-utility in utilities/\_generator.scss **(around line 270)**.

Inside that mixin, call your defined function and pass all necessary data to it.

🧠 Analyze the existing generate-utility mixin logic to understand how values are passed and how conditions are handled. This will help ensure your custom function integrates smoothly with the utility generation system.

> 🛠 **Debugging Tip:**  
> Use `@debug $data;` inside your mixin or utility generator to inspect values during Sass compilation.  
> This can help you understand what data is passed and how it's structured.  
> 📚 Official Sass docs: [https://sass-lang.com/documentation/at-rules/debug/](https://sass-lang.com/documentation/at-rules/debug/)

## 🧩 Adjusting Grid Breakpoints

The grid system in this project follows a mobile-first approach, based on the `$grid-breakpoints` map defined in `/abstracts/_variables.scss`.

To **add**, **remove**, or **adjust** breakpoints, edit the following map:

```scss
// Line 43 — /abstracts/_variables.scss
$grid-breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
  xxl: 1400px,
);
```

## 📦 Adjusting Container Max Widths

The maximum widths for containers at different breakpoints are defined in the same `/abstracts/_variables.scss` file, around line 67:

```scss
// Line 67 — /abstracts/_variables.scss
$container-max-widths: (
  sm: 540px,
  md: 720px,
  lg: 960px,
  xl: 1140px,
  xxl: 1320px,
);
```

Modify these values to control how wide containers get at each breakpoint.

These max-widths work together with the grid breakpoints to create the responsive layout.

After any changes, make sure to recompile your styles so updates take effect across the project.

> 💡 **Note:** Adjusting container widths affects overall layout and spacing, so test your pages thoroughly after changes.

## 🎨 Adjusting Color Themes

Colors are defined in the `/abstracts/_variables.scss` file, starting around line **96**:

```scss
// Line 96 — /abstracts/_variables.scss
$color-theme: (
  default: (
    color: (
      'primary': #0d6efd,
      'secondary': #6c757d,
    ),
    hover: (
      'primary': #012345,
      'secondary': #dc3545,
    ),
  ),
);
```

The system automatically generates corresponding CSS custom properties:

```
:root {
  --clr-primary: #0d6efd;
  --clr-secondary: #6c757d;

  --hover-primary: #012345,
  --hover-secondary: #dc3545,
  ...
}
```

These maps define the main colors and their hover states for the default theme.

You can customize the color values or add new keys to extend the theme.

Make sure to update both the color and hover maps for consistent UI behavior.

> 💡 **Note**: Changing colors here affects all components using the theme variables. Test thoroughly to ensure good contrast and accessibility.
