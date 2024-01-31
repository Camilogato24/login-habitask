const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('db_habitask', 'admin', 'passAWSbd', {
  host: 'database-habitask.c1uw4wgcq9bw.us-east-1.rds.amazonaws.com',
  dialect: 'mysql',
});

const Usuario = sequelize.define('Usuario', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  contrasena: {
    type: DataTypes.STRING,
    allowNull: false,
  },
},{
  // Desactivar las marcas de tiempo automáticas
  timestamps: false,
});
exports.handler = async (event, context) => {
  const { email, contrasena } = event;
  // Permite el uso de async/await
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // Buscar usuario por email y contraseña
    const usuario = await Usuario.findOne({ where: { email, contrasena } });

    if (usuario) {
      return {
        statusCode: 200,
        body: JSON.stringify({ mensaje: 'Login exitoso' }),
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Credenciales inválidas' }),
      };
    }
  } catch (error) {
    console.error('Error al autenticar usuario:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' }),
    };
  }
};

