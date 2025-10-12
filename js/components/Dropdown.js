const CLASS_OPEN = 'dropdown--open';

export class Dropdown {
  constructor(dropdownEl = '.dropdown') {
    document.addEventListener('click', (e) => {
      const isDropdownButton = e.target.matches('.dropdown__toggle');

      if (!isDropdownButton && e.target.closest('.dropdown') != null) return;

      let currentDropdown;
      if (isDropdownButton) {
        currentDropdown = e.target.closest('.dropdown');
        currentDropdown.classList.toggle(CLASS_OPEN);
      }

      // will not execute if node list is empty
      document.querySelectorAll(CLASS_OPEN).forEach((dropdown) => {
        if (dropdown === currentDropdown) return;
        dropdown.classList.remove(CLASS_OPEN);
      });
    });
  }
}
