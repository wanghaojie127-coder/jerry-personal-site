(() => {
  const toolbar = document.querySelector('.work-toolbar');
  if (!toolbar) return;
  const buttons = [...toolbar.querySelectorAll('[data-filter]')];
  const projects = [...document.querySelectorAll('.project[data-category]')];
  const status = document.getElementById('filter-status');
  toolbar.hidden = false;
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      let visible = 0;
      projects.forEach(project => {
        const matches = filter === 'all' || project.dataset.category === filter;
        project.hidden = !matches;
        if (matches) visible += 1;
      });
      status.textContent = `${visible} 项探索`;
    });
  });
})();
