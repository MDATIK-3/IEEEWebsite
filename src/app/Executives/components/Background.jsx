const Background = () => {
    const appBackgroundStyles = `
    .app-grid-background {
      background-color: #FFFFFF; 
      background-image:
        linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
      background-size: 25px 25px; /* Subtle grid size */
    }

    /* Animations for modals/transitions */
    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes scale-in {
      from { transform: scale(0.9); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
    .animate-scale-in { animation: scale-in 0.3s ease-out forwards; }
  `;
    return <style>{appBackgroundStyles}</style>;
};

export default Background;
