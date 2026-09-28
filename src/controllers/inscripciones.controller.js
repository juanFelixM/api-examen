const prisma = require('../db');

const inscribirse = async (req, res) => {
  const { claseId } = req.body;
  const usuarioId = req.usuario.id;

  try {
    const clase = await prisma.clase.findUnique({
      where: { id: parseInt(claseId, 10) },
      include: {
        inscripciones: {
          where: { estado: 'activa' }
        }
      }
    });

    if (!clase) {
      return res.status(404).json({ error: 'Clase no encontrada' });
    }

    if (!clase.activa) {
      return res.status(400).json({ error: 'No es posible inscribirse en una clase inactiva' });
    }

    if (clase.inscripciones.length >= clase.cupoMaximo) {
      return res.status(400).json({ error: 'La clase ha alcanzado su cupo maximo' });
    }

    const yaInscrito = clase.inscripciones.some((ins) => ins.usuarioId === usuarioId);
    if (yaInscrito) {
      return res.status(400).json({ error: 'Ya posee una inscripcion activa en esta clase' });
    }

    const nuevaInscripcion = await prisma.inscripcion.create({
      data: {
        usuarioId,
        claseId: clase.id,
        estado: 'activa'
      }
    });

    res.status(201).json(nuevaInscripcion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const cancelarInscripcion = async (req, res) => {
  const { id } = req.params;
  const usuarioId = req.usuario.id;

  try {
    const inscripcion = await prisma.inscripcion.findUnique({
      where: { id: parseInt(id, 10) }
    });

    if (!inscripcion) {
      return res.status(404).json({ error: 'Inscripcion no encontrada' });
    }

    if (inscripcion.usuarioId !== usuarioId) {
      return res.status(403).json({ error: 'No tiene permiso para cancelar esta inscripcion' });
    }

    if (inscripcion.estado === 'cancelada') {
      return res.status(400).json({ error: 'La inscripcion ya se encuentra cancelada' });
    }

    const cancelada = await prisma.inscripcion.update({
      where: { id: inscripcion.id },
      data: {
        estado: 'cancelada',
        fechaCancelacion: new Date()
      }
    });

    res.json(cancelada);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verTodas = async (req, res) => {
  try {
    const inscripciones = await prisma.inscripcion.findMany({
      include: {
        usuario: { select: { id: true, nombre: true, email: true } },
        clase: true
      }
    });
    res.json(inscripciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verMisInscripciones = async (req, res) => {
  try {
    const misInscripciones = await prisma.inscripcion.findMany({
      where: { usuarioId: req.usuario.id },
      include: { clase: true }
    });
    res.json(misInscripciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { inscribirse, cancelarInscripcion, verTodas, verMisInscripciones };