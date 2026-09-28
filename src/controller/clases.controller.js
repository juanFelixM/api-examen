const prisma = require('../db');

const listarClases = async (req, res) => {
  try {
    const clases = await prisma.clase.findMany({
      where: { activa: true },
      include: {
        inscripciones: {
          where: { estado: 'activa' }
        }
      }
    });

    const resultado = clases.map((clase) => {
      const activas = clase.inscripciones.length;
      return {
        id: clase.id,
        nombre: clase.nombre,
        cupoMaximo: clase.cupoMaximo,
        activa: clase.activa,
        cuposDisponibles: clase.cupoMaximo - activas
      };
    });

    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const crearClase = async (req, res) => {
  const { nombre, cupoMaximo } = req.body;
  try {
    const nuevaClase = await prisma.clase.create({
      data: {
        nombre,
        cupoMaximo: parseInt(cupoMaximo, 10)
      }
    });
    res.status(201).json(nuevaClase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const desactivarClase = async (req, res) => {
  const { id } = req.params;
  try {
    const claseActualizada = await prisma.clase.update({
      where: { id: parseInt(id, 10) },
      data: { activa: false }
    });
    res.json(claseActualizada);
  } catch (error) {
    res.status(404).json({ error: 'Clase no encontrada' });
  }
};

module.exports = { listarClases, crearClase, desactivarClase };