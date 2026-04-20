import { db } from './database';
import { logger } from '../utils/logger';

const PHASES = [
  {
    id: 1,
    slug: 'application',
    name: 'Application',
    description: 'Collecter une candidature structurée et filtrer les projets sérieux dès l\'entrée.',
    typical_duration_days: 14,
    validation_criteria: ['dossier complet', 'équipe identifiée', 'problème/solution clairs', 'présence d\'un deck ou one-pager'],
    deliverables: ['formulaire de candidature', 'profils fondateurs', 'pitch deck v1', 'lien produit ou repo ou démo'],
    kpis: ['taux de complétion', 'temps moyen de soumission', 'nombre de pièces manquantes', 'score initial automatique'],
    order_index: 1
  },
  {
    id: 2,
    slug: 'initial-screening',
    name: 'Initial Screening',
    description: 'Effectuer un premier tri rapide des candidatures.',
    typical_duration_days: 5,
    validation_criteria: ['fit avec le programme', 'qualité de l\'équipe', 'taille du marché', 'faisabilité globale'],
    deliverables: ['fiche de screening', 'note synthétique reviewer'],
    kpis: ['taux acceptation/rejet', 'score moyen screening', 'temps moyen de review'],
    order_index: 2
  },
  {
    id: 3,
    slug: 'deep-review',
    name: 'Deep Review / Due Diligence Lite',
    description: 'Vérifier la crédibilité du projet avant entretien.',
    typical_duration_days: 7,
    validation_criteria: ['cohérence des métriques', 'qualité produit/prototype', 'signaux marché', 'risques majeurs'],
    deliverables: ['data room minimale', 'accès produit', 'KPI sheet initiale'],
    kpis: ['taux de complétude', 'nombre de red flags', 'score de confiance'],
    order_index: 3
  },
  {
    id: 4,
    slug: 'interview',
    name: 'Interview',
    description: 'Évaluer l\'équipe en direct.',
    typical_duration_days: 3,
    validation_criteria: ['clarté vision', 'coachability', 'vitesse d\'exécution', 'capacité commerciale'],
    deliverables: ['notes interview', 'scorecard interview'],
    kpis: ['score moyen interview', 'taux d\'accord entre reviewers', 'taux de no-show'],
    order_index: 4
  },
  {
    id: 5,
    slug: 'committee-decision',
    name: 'Committee Decision',
    description: 'Décider de l\'admission.',
    typical_duration_days: 4,
    validation_criteria: ['score global', 'quorum reviewers', 'vote comité'],
    deliverables: ['decision memo', 'log des votes', 'dossier admission'],
    kpis: ['taux conversion comité', 'temps décision', 'taux unanimité'],
    order_index: 5
  },
  {
    id: 6,
    slug: 'onboarding',
    name: 'Onboarding Incubation',
    description: 'Intégrer le projet dans le programme.',
    typical_duration_days: 10,
    validation_criteria: ['signature', 'accès outils', 'objectifs initiaux validés'],
    deliverables: ['onboarding checklist', 'accès outils', 'roadmap initiale'],
    kpis: ['temps onboarding', 'complétion onboarding', 'satisfaction founders'],
    order_index: 6
  },
  {
    id: 7,
    slug: 'goal-setting',
    name: 'Goal Setting / OKRs Definition',
    description: 'Définir des objectifs clairs.',
    typical_duration_days: 7,
    validation_criteria: ['objectifs mesurables', 'alignement mentor'],
    deliverables: ['OKRs', 'roadmap'],
    kpis: ['qualité OKRs', 'taux validation mentor'],
    order_index: 7
  },
  {
    id: 8,
    slug: 'product-validation',
    name: 'Product Validation',
    description: 'Valider le problème et la solution.',
    typical_duration_days: 21,
    validation_criteria: ['feedback utilisateurs', 'tests terrain'],
    deliverables: ['interviews clients', 'prototype testé'],
    kpis: ['nombre interviews', 'taux validation problème'],
    order_index: 8
  },
  {
    id: 9,
    slug: 'mvp-iteration',
    name: 'MVP Iteration',
    description: 'Construire/améliorer le MVP.',
    typical_duration_days: 28,
    validation_criteria: ['fonctionnalité opérationnelle'],
    deliverables: ['MVP fonctionnel', 'roadmap technique'],
    kpis: ['vitesse dev', 'commits/semaine'],
    order_index: 9
  },
  {
    id: 10,
    slug: 'user-acquisition-testing',
    name: 'User Acquisition Testing',
    description: 'Tester acquisition utilisateurs.',
    typical_duration_days: 21,
    validation_criteria: ['premiers utilisateurs'],
    deliverables: ['campagnes tests', 'funnel acquisition'],
    kpis: ['CAC', 'conversion rate'],
    order_index: 10
  },
  {
    id: 11,
    slug: 'traction-validation',
    name: 'Traction Validation',
    description: 'Prouver l\'intérêt du marché.',
    typical_duration_days: 30,
    validation_criteria: ['croissance utilisateurs/revenus'],
    deliverables: ['KPI traction'],
    kpis: ['croissance hebdo', 'rétention'],
    order_index: 11
  },
  {
    id: 12,
    slug: 'business-model-refinement',
    name: 'Business Model Refinement',
    description: 'Optimiser la monétisation.',
    typical_duration_days: 21,
    validation_criteria: ['modèle viable'],
    deliverables: ['pricing', 'unit economics'],
    kpis: ['LTV', 'marge', 'conversion'],
    order_index: 12
  },
  {
    id: 13,
    slug: 'metrics-tracking-setup',
    name: 'Metrics Tracking Setup',
    description: 'Structurer les KPIs.',
    typical_duration_days: 10,
    validation_criteria: ['tracking en place'],
    deliverables: ['dashboard KPI'],
    kpis: ['fiabilité données', 'fréquence mise à jour'],
    order_index: 13
  },
  {
    id: 14,
    slug: 'weekly-reporting',
    name: 'Weekly Reporting',
    description: 'Suivi régulier.',
    typical_duration_days: 999,
    validation_criteria: ['reporting complet'],
    deliverables: ['rapport hebdomadaire'],
    kpis: ['régularité', 'qualité reporting'],
    order_index: 14
  },
  {
    id: 15,
    slug: 'mentor-assignment',
    name: 'Mentor Assignment',
    description: 'Assigner mentors adaptés.',
    typical_duration_days: 7,
    validation_criteria: ['matching expertise'],
    deliverables: ['assignation mentors'],
    kpis: ['satisfaction founders', 'taux matching réussi'],
    order_index: 15
  },
  {
    id: 16,
    slug: 'mentor-sessions',
    name: 'Mentor Sessions & Feedback Loop',
    description: 'Accompagnement actif.',
    typical_duration_days: 999,
    validation_criteria: ['sessions régulières'],
    deliverables: ['notes sessions'],
    kpis: ['nombre sessions', 'impact perçu'],
    order_index: 16
  },
  {
    id: 17,
    slug: 'milestone-tracking',
    name: 'Milestone Tracking',
    description: 'Suivre progression.',
    typical_duration_days: 999,
    validation_criteria: ['milestones atteints'],
    deliverables: ['roadmap mise à jour'],
    kpis: ['milestone completion rate'],
    order_index: 17
  },
  {
    id: 18,
    slug: 'performance-review-mid',
    name: 'Performance Review (Mid-Program)',
    description: 'Évaluer progression.',
    typical_duration_days: 7,
    validation_criteria: ['KPIs', 'execution'],
    deliverables: ['rapport intermédiaire'],
    kpis: ['score progression'],
    order_index: 18
  },
  {
    id: 19,
    slug: 'growth-acceleration',
    name: 'Growth Acceleration',
    description: 'Accélérer croissance.',
    typical_duration_days: 30,
    validation_criteria: ['scaling'],
    deliverables: ['stratégie croissance'],
    kpis: ['croissance utilisateurs', 'revenus'],
    order_index: 19
  },
  {
    id: 20,
    slug: 'fundraising-preparation',
    name: 'Fundraising Preparation',
    description: 'Préparer levée.',
    typical_duration_days: 21,
    validation_criteria: ['readiness investisseurs'],
    deliverables: ['materials fundraising'],
    kpis: ['readiness score'],
    order_index: 20
  },
  {
    id: 21,
    slug: 'pitch-deck-refinement',
    name: 'Pitch Deck Refinement',
    description: 'Améliorer pitch.',
    typical_duration_days: 10,
    validation_criteria: ['clarté narrative'],
    deliverables: ['deck final'],
    kpis: ['score pitch'],
    order_index: 21
  },
  {
    id: 22,
    slug: 'financial-model',
    name: 'Financial Model Finalization',
    description: 'Solidifier finances.',
    typical_duration_days: 10,
    validation_criteria: ['cohérence projections'],
    deliverables: ['financial model'],
    kpis: ['précision projections'],
    order_index: 22
  },
  {
    id: 23,
    slug: 'data-room',
    name: 'Data Room Completion',
    description: 'Préparer investisseurs.',
    typical_duration_days: 10,
    validation_criteria: ['documents complets'],
    deliverables: ['data room'],
    kpis: ['complétude'],
    order_index: 23
  },
  {
    id: 24,
    slug: 'investor-outreach',
    name: 'Investor Outreach',
    description: 'Contacter investisseurs.',
    typical_duration_days: 28,
    validation_criteria: ['meetings obtenus'],
    deliverables: ['liste investisseurs', 'emails'],
    kpis: ['taux réponse', 'meetings'],
    order_index: 24
  },
  {
    id: 25,
    slug: 'demo-day-preparation',
    name: 'Demo Day Preparation',
    description: 'Préparer présentation finale.',
    typical_duration_days: 17,
    validation_criteria: ['pitch prêt'],
    deliverables: ['pitch final', 'répétitions'],
    kpis: ['readiness score'],
    order_index: 25
  },
  {
    id: 26,
    slug: 'demo-day',
    name: 'Demo Day Execution',
    description: 'Présenter aux investisseurs.',
    typical_duration_days: 1,
    validation_criteria: ['performance pitch'],
    deliverables: ['présentation live'],
    kpis: ['feedback investisseurs'],
    order_index: 26
  },
  {
    id: 27,
    slug: 'graduation',
    name: 'Graduation',
    description: 'Sortie programme.',
    typical_duration_days: 1,
    validation_criteria: ['programme complété'],
    deliverables: ['rapport final'],
    kpis: ['taux graduation'],
    order_index: 27
  },
  {
    id: 28,
    slug: 'alumni-tracking',
    name: 'Alumni / Post-Incubation Tracking',
    description: 'Suivi long terme.',
    typical_duration_days: 999,
    validation_criteria: ['activité post-programme'],
    deliverables: ['profil alumni'],
    kpis: ['funding', 'croissance', 'survie'],
    order_index: 28
  }
];

export function seedPhases() {
  try {
    const insertPhase = db.prepare(`
      INSERT OR REPLACE INTO phases (
        id, slug, name, description, typical_duration_days, 
        validation_criteria, deliverables, kpis, order_index
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertMany = db.transaction((phases) => {
      for (const phase of phases) {
        insertPhase.run(
          phase.id,
          phase.slug,
          phase.name,
          phase.description,
          phase.typical_duration_days,
          JSON.stringify(phase.validation_criteria),
          JSON.stringify(phase.deliverables),
          JSON.stringify(phase.kpis),
          phase.order_index
        );
      }
    });

    insertMany(PHASES);
    logger.info(`Successfully seeded ${PHASES.length} phases`);
  } catch (error) {
    logger.error('Failed to seed phases:', error);
    throw error;
  }
}
