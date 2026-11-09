// Mantém uma categoria aberta e acompanha seu título durante a troca.
document.querySelectorAll('#cardapio-container').forEach((container) => {
  const controllers = [];
  let anchor;
  let frame;
  let previousOverflowAnchor;

  function stopTracking() {
    if (!anchor) return;
    cancelAnimationFrame(frame);
    document.documentElement.style.overflowAnchor = previousOverflowAnchor;
    anchor = undefined;
  }

  function keepTitleVisible() {
    if (!anchor) return;
    const delta = anchor.element.getBoundingClientRect().top - anchor.top;
    if (Math.abs(delta) > 0.5) window.scrollBy({ top: delta, behavior: 'instant' });
    if (controllers.some((controller) => controller.animating())) {
      frame = requestAnimationFrame(keepTitleVisible);
    } else {
      stopTracking();
    }
  }

  // A rolagem manual tem prioridade sobre o acompanhamento da animação.
  window.addEventListener('wheel', stopTracking, { passive: true });
  window.addEventListener('touchmove', stopTracking, { passive: true });
  window.addEventListener('keydown', (event) => {
    if (['PageDown', 'PageUp', 'Home', 'End', 'ArrowDown', 'ArrowUp', ' '].includes(event.key)) stopTracking();
  });

  container.querySelectorAll('.acordeao-item').forEach((details) => {
    const summary = details.querySelector('summary');
    const content = details.querySelector('.acordeao-conteudo');
    let animation;
    let expanded = details.open;

    function setExpanded(next) {
      if (expanded === next) return;
      const startHeight = details.getBoundingClientRect().height;
      if (animation) {
        animation.onfinish = null;
        animation.cancel();
        animation = undefined;
      }
      expanded = next;
      details.toggleAttribute('data-closing', !expanded);

      if (!details.animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        details.open = expanded;
        details.removeAttribute('data-closing');
        return;
      }

      details.open = true;
      const styles = getComputedStyle(details);
      const borders = parseFloat(styles.borderTopWidth) + parseFloat(styles.borderBottomWidth);
      const closedHeight = summary.getBoundingClientRect().height + borders;
      const endHeight = closedHeight + (expanded ? content.getBoundingClientRect().height : 0);

      animation = details.animate(
        [{ height: `${startHeight}px` }, { height: `${endHeight}px` }],
        { duration: 420, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      );
      animation.onfinish = () => {
        details.open = expanded;
        details.removeAttribute('data-closing');
        animation = undefined;
      };
    }

    const controller = { setExpanded, animating: () => Boolean(animation) };
    controllers.push(controller);

    summary.addEventListener('click', (event) => {
      event.preventDefault();
      stopTracking();
      previousOverflowAnchor = document.documentElement.style.overflowAnchor;
      document.documentElement.style.overflowAnchor = 'none';
      anchor = { element: summary, top: summary.getBoundingClientRect().top };
      const next = !expanded;
      if (next) controllers.forEach((other) => {
        if (other !== controller) other.setExpanded(false);
      });
      setExpanded(next);
      keepTitleVisible();
    });
  });
});
