import { Router } from 'express';
import { ProjectService } from '../services/project.service';
import { validateData, projectSchema, projectUpdateSchema, paginationSchema, projectFiltersSchema } from '../utils/validators';
import { authenticateJWT, authorize } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = Router();

// GET /api/projects - Lister les projets
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;
    
    const filters: any = {};
    
    if (req.query.status) {
      filters.status = Array.isArray(req.query.status) ? req.query.status : [req.query.status];
    }
    
    if (req.query.category) {
      filters.category = Array.isArray(req.query.category) ? req.query.category : [req.query.category];
    }
    
    if (req.query.search) {
      filters.search = req.query.search as string;
    }
    
    if (req.query.published !== undefined) {
      filters.published = req.query.published === 'true';
    }
    
    const { projects, total } = ProjectService.list(filters, { page, limit, offset });
    
    res.json({
      success: true,
      data: projects,
      meta: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/projects/statistics - Obtenir les statistiques
router.get('/statistics', (req, res, next) => {
  try {
    const stats = ProjectService.getStatistics();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/projects/:id - Obtenir un projet par ID
router.get('/:id', (req, res, next) => {
  try {
    const project = ProjectService.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found',
      });
    }
    
    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/projects/slug/:slug - Obtenir un projet par slug
router.get('/slug/:slug', (req, res, next) => {
  try {
    const project = ProjectService.findBySlug(req.params.slug);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found',
      });
    }
    
    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/projects - Créer un projet (admin/editor uniquement)
router.post('/', authenticateJWT, authorize('admin', 'editor'), (req, res, next) => {
  try {
    const data = validateData(projectSchema, req.body);
    const project = ProjectService.create(data as any);
    
    res.status(201).json({
      success: true,
      data: project,
      message: 'Project created successfully',
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/projects/:id - Mettre à jour un projet (admin/editor uniquement)
router.patch('/:id', authenticateJWT, authorize('admin', 'editor'), (req, res, next) => {
  try {
    const data = validateData(projectUpdateSchema, req.body);
    const project = ProjectService.update(req.params.id, data);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found',
      });
    }
    
    res.json({
      success: true,
      data: project,
      message: 'Project updated successfully',
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/projects/:id/publish - Publier un projet (admin/editor uniquement)
router.post('/:id/publish', authenticateJWT, authorize('admin', 'editor'), (req, res, next) => {
  try {
    const project = ProjectService.publish(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found',
      });
    }
    
    res.json({
      success: true,
      data: project,
      message: 'Project published successfully',
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/projects/:id/unpublish - Dépublier un projet (admin/editor uniquement)
router.post('/:id/unpublish', authenticateJWT, authorize('admin', 'editor'), (req, res, next) => {
  try {
    const project = ProjectService.unpublish(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found',
      });
    }
    
    res.json({
      success: true,
      data: project,
      message: 'Project unpublished successfully',
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/projects/:id/archive - Archiver un projet (admin uniquement)
router.post('/:id/archive', authenticateJWT, authorize('admin'), (req, res, next) => {
  try {
    const project = ProjectService.archive(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found',
      });
    }
    
    res.json({
      success: true,
      data: project,
      message: 'Project archived successfully',
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/projects/:id - Supprimer un projet (admin uniquement)
router.delete('/:id', authenticateJWT, authorize('admin'), (req, res, next) => {
  try {
    const success = ProjectService.delete(req.params.id);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'Project not found',
      });
    }
    
    res.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/projects/reorder - Réorganiser les projets (admin/editor uniquement)
router.post('/reorder', authenticateJWT, authorize('admin', 'editor'), (req, res, next) => {
  try {
    const { order } = req.body;
    
    if (!Array.isArray(order)) {
      return res.status(400).json({
        success: false,
        error: 'Order must be an array of project IDs',
      });
    }
    
    ProjectService.reorder(order);
    
    res.json({
      success: true,
      message: 'Projects reordered successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
