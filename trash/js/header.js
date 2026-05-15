function renderHeader() {
  const icon = state.theme === 'light' ? 'dark_icon.png' : 'icon_btn.png';
  return `
    <header class="header">
      <div class="header-container">
        <h1 class="logo h1"></h1>
        <button class="theme-toggle" onclick="app.toggleTheme()">
          <img src="img/${icon}" style="width:20px;">
        </button>
      </div>
    </header>
  `;
}