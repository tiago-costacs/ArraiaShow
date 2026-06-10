console.log('✅ index.js loaded!');

(async () => {
  try {
    console.log('📦 Importing modules...');
    const reactModule = await import('react');
    const React = reactModule.default;
    const { createRoot } = await import('react-dom/client');
    const { default: App } = await import('./App.js');
    
    console.log('✅ All modules imported');
    
    const root = createRoot(document.getElementById('root'));
    root.render(
      React.createElement(React.StrictMode, null,
        React.createElement(App)
      )
    );
    console.log('✅ App rendered!');
  } catch (err) {
    console.error('❌ Error:', err);
    const root = document.getElementById('root');
    root.innerHTML = `<div style="color: red; padding: 20px; background: #0e0c0a;">
      <h1>❌ Erro ao carregar aplicação</h1>
      <p>${err.message}</p>
      <pre style="background: #1a1a1a; padding: 10px; overflow: auto;">${err.stack}</pre>
    </div>`;
  }
})();
