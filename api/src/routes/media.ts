import { Router } from 'express';
import multer from 'multer';
import { MediaService } from '../services/media.service';
import { authenticateJWT, authorize } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = Router();

// Configuration Multer pour l'upload en mémoire
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB par défaut
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = (process.env.ALLOWED_IMAGE_TYPES || 'image/jpeg,image/png,image/webp,image/svg+xml').split(',');
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`));
    }
  },
});

// GET /api/media?project_id=xxx&type=logo - Lister les médias
router.get('/', (req, res, next) => {
  try {
    const { project_id, type } = req.query;
    
    if (!project_id) {
      return res.status(400).json({
        success: false,
        error: 'project_id is required',
      });
    }
    
    const media = MediaService.listByProject(
      project_id as string,
      type as 'logo' | 'screenshot' | 'banner' | undefined
    );
    
    res.json({
      success: true,
      data: media,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/media/statistics - Obtenir les statistiques
router.get('/statistics', authenticateJWT, (req, res, next) => {
  try {
    const stats = MediaService.getStatistics();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/media/:id - Obtenir un média par ID
router.get('/:id', (req, res, next) => {
  try {
    const media = MediaService.findById(req.params.id);
    
    if (!media) {
      return res.status(404).json({
        success: false,
        error: 'Media not found',
      });
    }
    
    res.json({
      success: true,
      data: media,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/media/upload - Uploader un média (admin/editor uniquement)
router.post(
  '/upload',
  authenticateJWT,
  authorize('admin', 'editor'),
  upload.single('file'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded',
        });
      }
      
      const { project_id, type } = req.body;
      
      if (!project_id || !type) {
        return res.status(400).json({
          success: false,
          error: 'project_id and type are required',
        });
      }
      
      if (!['logo', 'screenshot', 'banner'].includes(type)) {
        return res.status(400).json({
          success: false,
          error: 'type must be one of: logo, screenshot, banner',
        });
      }
      
      const media = await MediaService.upload(req.file, project_id, type);
      
      res.status(201).json({
        success: true,
        data: media,
        message: 'Media uploaded successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/media/:id/set-as-logo - Définir comme logo principal (admin/editor uniquement)
router.post('/:id/set-as-logo', authenticateJWT, authorize('admin', 'editor'), (req, res, next) => {
  try {
    const { project_id } = req.body;
    
    if (!project_id) {
      return res.status(400).json({
        success: false,
        error: 'project_id is required',
      });
    }
    
    const success = MediaService.setAsLogo(req.params.id, project_id);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'Media not found or does not belong to project',
      });
    }
    
    res.json({
      success: true,
      message: 'Logo set successfully',
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/media/:id - Supprimer un média (admin/editor uniquement)
router.delete('/:id', authenticateJWT, authorize('admin', 'editor'), (req, res, next) => {
  try {
    const success = MediaService.delete(req.params.id);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'Media not found',
      });
    }
    
    res.json({
      success: true,
      message: 'Media deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
