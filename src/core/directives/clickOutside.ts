import { DirectiveBinding , VNode } from 'vue';

const clickOutside = {
  beforeMount(el: HTMLElement, binding: DirectiveBinding,vnode:VNode) {
    // Click handler
    const handleClick = (e: Event) => {
      // Check if the clicked element is outside the bound element


      // Check if the clicked element or any of its parents have the excluded class
      let clickedElement = event.target;
      while (clickedElement) {
        if (clickedElement.classList.contains("prevent-outside-click")) {
          // If any parent has the excluded class, do nothing
          return;
        }
        clickedElement = clickedElement.parentElement;
      }
      if (el.querySelector(`.prevent-outside-click`)) {
        // If any child has the excluded class, do nothing
        return;
      }

      if (!(el.contains(e.target as Node) || el === e.target || e.target?.closest(`.el-popper`))) {
        // Call the provided method/expression when a click outside occurs
        binding.value();
      }
    };

    // Add click event listener to the document
    document.addEventListener('click', handleClick);

    // Store the click handler so we can remove it later
    el._clickOutsideHandler = handleClick;
  },
  beforeUnmount(el: HTMLElement) {
    // Remove the click event listener when the component is unmounted
    document.removeEventListener('click', el._clickOutsideHandler);
  },
};

export default clickOutside;
