import { db } from '../lib/db';
import { ProjectService } from '../lib/projects';
import type { ProjectStatus } from '../lib/types';

type Seed = {
  name: string;
  status: ProjectStatus;
  category: string;
  description: string;
  order_index: number;
};

const PORTFOLIO: Seed[] = [
  {
    name: 'Hearst AI',
    status: 'live',
    category: 'Data Intelligence & Automation',
    description:
      'Turns complex data into actionable insights. Scalable data intelligence and automation built across multiple verticals, helping teams orchestrate workflows end-to-end.',
    order_index: 0,
  },
  {
    name: 'Hearst Connect',
    status: 'live',
    category: 'Mining Infrastructure / Yield',
    description:
      'Transforms mining infrastructure into secure yield vaults. Mining-backed yield with real-time performance tracking and institutional-grade transparency.',
    order_index: 1,
  },
  {
    name: 'Onyx Pay',
    status: 'live',
    category: 'Crypto Payments',
    description:
      'White-label cryptocurrency payment platform built for luxury retail and hospitality, featuring AI-driven reconciliation and branded acceptance flows.',
    order_index: 2,
  },
  {
    name: 'WeMine',
    status: 'live',
    category: 'Crypto Mining / Passive Income',
    description:
      'NFT-backed access to automated mining contracts. Holders earn passive income from Bitcoin, Dogecoin, and Litecoin rewards with full on-chain transparency.',
    order_index: 3,
  },
  {
    name: 'NetPool',
    status: 'live',
    category: 'Telecommunications',
    description:
      'Next-generation eSIM provider delivering instant mobile connectivity anywhere, designed for peer-to-peer sharing and global travel.',
    order_index: 4,
  },
  {
    name: 'Agora Hub',
    status: 'live',
    category: 'Web3 Community',
    description:
      'Web3 arena combining gamified experiences with structured deal flow — connecting users, investors, and projects for collaborative growth.',
    order_index: 5,
  },
  {
    name: 'Mind',
    status: 'live',
    category: 'Real Estate / Private Membership',
    description:
      'Private real estate club with an intelligence layer. AI-powered development, asset, and capital workflows engineered for member-grade outcomes.',
    order_index: 6,
  },
  {
    name: 'Aigent',
    status: 'live',
    category: 'AI Financial OS',
    description:
      'Financial operating system for AI agents. Manages wallets, transactions, and autonomous operation policies at scale.',
    order_index: 7,
  },
  {
    name: 'Bull21',
    status: 'live',
    category: 'Web3 Growth Agency',
    description:
      'Growth agency combining gamification and community psychology to build durable engagement loops for Web3 projects.',
    order_index: 8,
  },
  {
    name: 'Thynk',
    status: 'coming',
    category: 'Cognitive Intelligence',
    description:
      'Cognitive intelligence platform converting unstructured thinking into structured, queryable knowledge.',
    order_index: 100,
  },
  {
    name: 'Victor',
    status: 'coming',
    category: 'Personal Productivity',
    description:
      'Personal productivity assistant orchestrating tasks, calendar, and execution across the operator stack.',
    order_index: 101,
  },
  {
    name: 'Atlas',
    status: 'future',
    category: 'Data Mapping & Analytics',
    description:
      'Global data mapping and analytics layer turning fragmented signals into a coherent operating picture.',
    order_index: 102,
  },
  {
    name: 'Objection',
    status: 'future',
    category: 'Legal AI',
    description:
      'Legal AI for document analysis and counsel-grade reasoning over contracts, filings, and case work.',
    order_index: 103,
  },
];

function reseed() {
  const existing = db.prepare('SELECT COUNT(*) as n FROM projects').get() as { n: number };
  console.log(`[seed] existing rows: ${existing.n}`);

  db.prepare('DELETE FROM projects').run();
  console.log('[seed] cleared projects table');

  for (const p of PORTFOLIO) {
    const created = ProjectService.create({
      name: p.name,
      status: p.status,
      category: p.category,
      description: p.description,
      tech_stack: [],
      urls: {},
      screenshots: [],
      location: '',
      features: [],
      published: true,
      order_index: p.order_index,
    });
    console.log(`[seed] + ${created.name.padEnd(16)} ${created.status.padEnd(8)} ${created.category}`);
  }

  const total = db.prepare('SELECT COUNT(*) as n FROM projects').get() as { n: number };
  console.log(`[seed] done — ${total.n} rows`);
}

reseed();
