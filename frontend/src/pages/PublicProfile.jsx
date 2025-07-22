import React from 'react';

// Página de perfil público de artesano (estructura básica)
const PublicProfile = () => {
  return (
    <div className="public-profile-container">
      <h2>Perfil público del artesano</h2>
      <div className="profile-photo-placeholder">
        {/* Aquí irá la foto del artesano */}
        <span>Foto</span>
      </div>
      <div className="profile-info">
        <p><strong>Especialidad:</strong> <span>...</span></p>
        <p><strong>Biografía:</strong> <span>...</span></p>
        <p><strong>Historia:</strong> <span>...</span></p>
      </div>
    </div>
  );
};

export default PublicProfile; 