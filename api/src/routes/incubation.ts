import { Router } from 'express';
import { incubationService } from '../services/incubation.service';
import { ApiResponse } from '../types';
import { logger } from '../utils/logger';

const router = Router();

// ========== PHASES ==========

router.get('/phases', (req, res) => {
  try {
    const phases = incubationService.getAllPhases();
    const response: ApiResponse = {
      success: true,
      data: phases
    };
    res.json(response);
  } catch (error) {
    logger.error('Error in GET /phases:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get phases'
    });
  }
});

router.get('/phases/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const phase = incubationService.getPhaseById(id);
    
    if (!phase) {
      return res.status(404).json({
        success: false,
        error: 'Phase not found'
      });
    }

    res.json({
      success: true,
      data: phase
    });
  } catch (error) {
    logger.error('Error in GET /phases/:id:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get phase'
    });
  }
});

// ========== STARTUPS ==========

router.get('/startups', (req, res) => {
  try {
    const filters = {
      status: req.query.status ? (req.query.status as string).split(',') : undefined,
      cohort: req.query.cohort as string | undefined,
      search: req.query.search as string | undefined
    };

    const startups = incubationService.getAllStartups(filters);
    res.json({
      success: true,
      data: startups
    });
  } catch (error) {
    logger.error('Error in GET /startups:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get startups'
    });
  }
});

router.get('/startups/:id', (req, res) => {
  try {
    const startup = incubationService.getStartupById(req.params.id);
    
    if (!startup) {
      return res.status(404).json({
        success: false,
        error: 'Startup not found'
      });
    }

    res.json({
      success: true,
      data: startup
    });
  } catch (error) {
    logger.error('Error in GET /startups/:id:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get startup'
    });
  }
});

router.post('/startups', (req, res) => {
  try {
    const startup = incubationService.createStartup(req.body);
    
    // Initialize phases for the startup
    incubationService.initializeStartupPhases(startup.id);
    
    res.status(201).json({
      success: true,
      data: startup
    });
  } catch (error) {
    logger.error('Error in POST /startups:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create startup'
    });
  }
});

router.patch('/startups/:id', (req, res) => {
  try {
    const startup = incubationService.updateStartup(req.params.id, req.body);
    res.json({
      success: true,
      data: startup
    });
  } catch (error) {
    logger.error('Error in PATCH /startups/:id:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update startup'
    });
  }
});

router.delete('/startups/:id', (req, res) => {
  try {
    incubationService.deleteStartup(req.params.id);
    res.json({
      success: true,
      message: 'Startup deleted'
    });
  } catch (error) {
    logger.error('Error in DELETE /startups/:id:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete startup'
    });
  }
});

// ========== STARTUP PHASES ==========

router.get('/startups/:id/phases', (req, res) => {
  try {
    const phases = incubationService.getStartupPhases(req.params.id);
    res.json({
      success: true,
      data: phases
    });
  } catch (error) {
    logger.error('Error in GET /startups/:id/phases:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get startup phases'
    });
  }
});

router.patch('/startups/:id/phases/:phaseId', (req, res) => {
  try {
    const phaseId = parseInt(req.params.phaseId);
    const phase = incubationService.updateStartupPhase(req.params.id, phaseId, req.body);
    res.json({
      success: true,
      data: phase
    });
  } catch (error) {
    logger.error('Error in PATCH /startups/:id/phases/:phaseId:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update startup phase'
    });
  }
});

// ========== KPIs ==========

router.post('/startups/:id/kpis', (req, res) => {
  try {
    const { phase_id, kpi_key, kpi_value, week_number } = req.body;
    
    if (!phase_id || !kpi_key || kpi_value === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: phase_id, kpi_key, kpi_value'
      });
    }

    const kpi = incubationService.addKPI(
      req.params.id,
      phase_id,
      kpi_key,
      kpi_value,
      week_number
    );

    res.status(201).json({
      success: true,
      data: kpi
    });
  } catch (error) {
    logger.error('Error in POST /startups/:id/kpis:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add KPI'
    });
  }
});

router.get('/startups/:id/kpis', (req, res) => {
  try {
    const phaseId = req.query.phase_id ? parseInt(req.query.phase_id as string) : undefined;
    const kpis = incubationService.getStartupKPIs(req.params.id, phaseId);
    res.json({
      success: true,
      data: kpis
    });
  } catch (error) {
    logger.error('Error in GET /startups/:id/kpis:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get KPIs'
    });
  }
});

// ========== STATISTICS ==========

router.get('/statistics', (req, res) => {
  try {
    const stats = incubationService.getIncubationStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('Error in GET /statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get statistics'
    });
  }
});

export default router;
