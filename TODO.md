# Todos

## components

- Toast
- Hero
- ToolTips
- Spinners
- Placeholder / Skeleton loading
- Collapse (für Textreveal)
- accordion input fixed, sodass mein auch mehrere dom objkect üvergeben kann anstatt string
- akkordion open at item level not button
- accordion öffnen lassen beim start
- modal
- highighter machen, anwendbar bei tabs oder filter
- dropdown ausschalten wenn clicked wo anders
- navbalink aria-current markieren mit underline oder sonst was
- Navbar Module Tabber funktioniert nur bei navbar\_\_links, bei Button geht nicht, statt klasse selekten, alle focusable - elemente selekten
- dropdown standalone und in navbar muss funktionieren
- close dropdown when focus left

## utilities

-@supports utilities?

- spacing and font system like on https://utopia.fyi/?

function apply-custom-prop nochmal anschauen wegen custom-prop-prefix

custom variable to pattern @include mq(xsm)
{ .xsm:footer-line {
--\_offset: 35px;
--\_length: 2px;
--\_line-start: calc(var(--\_offset) + var(--\_length));

    background-image: linear-gradient( to bottom, transparent var(--\_offset), var(--clr-primary) var(--\_offset) var(--\_line-start), transparent var(--\_line-start) var(--\_line-start) ); } }

.curve::before {
content: '';
width: 62px;
height: 62px;
display: block;
margin-bottom: 4px;
background-image: url('/src/assets/images/kurve.svg');
}

click and Drag Class

form css

custom select
