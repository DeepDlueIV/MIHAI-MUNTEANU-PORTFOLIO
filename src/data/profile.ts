export interface Profile {
  name: string; role: string; specialty: string; location: string; address: string;
  contactEmail: string | null; phone: string | null; linkedInUrl: string | null;
  personalGithubUrl: string | null; siteUrl: string | null;
  hero: { eyebrow: string; line1: string; line2: string; line3: string; description: string; primary: string; secondary: string };
  expertise: { title: string; text: string; tag: string; icon: string }[];
  projects: { title: string; short: string; type: string; text: string; tags: string[] }[];
  about: { title: string; text: string; steps: { title: string; text: string }[] };
  contact: { title: string; sub: string };
}
/** Single content source. Null contacts are not shown as broken UI. */
export const profile: Profile = {
  name: 'Mihai Munteanu',
  role: 'Software consultant',
  specialty: 'Backend & integration architecture',
  location: 'Paris, France',
  address: '47 rue Vivienne, 75002 Paris, France',
  contactEmail: null,
  phone: null,
  linkedInUrl: null,
  personalGithubUrl: null,
  siteUrl: null,
  hero: {
    eyebrow: 'Independent thinking. Connected systems.',
    line1: 'Reliable software.',
    line2: 'Connected',
    line3: 'systems.',
    description: 'I design APIs, connect business tools, and build dependable backends for B2B products.',
    primary: 'Discuss a project',
    secondary: 'Explore the work',
  },
  expertise: [
    {title:'Backend architecture',text:'Clear boundaries, well-defined APIs, and a foundation your team can build on.',tag:'Structure before complexity',icon:'layers'},
    {title:'System integrations',text:'CRM, billing, and product data working together. With retries, not crossed fingers.',tag:'Connected by design',icon:'connect'},
    {title:'Backend modernisation',text:'Make existing software easier to change, without stopping the business to rewrite it.',tag:'Progress, not disruption',icon:'cycle'},
  ],
  projects: [
    {title:'Billing event pipeline',short:'Billing pipeline',type:'EVENT-DRIVEN BACKEND',text:'A payment arrives. The webhook is verified, processed once, and safely handed to the product.',tags:['Webhooks','Idempotency','Event processing']},
    {title:'CRM ↔ product sync',short:'CRM ↔ product',type:'BUSINESS-SYSTEM INTEGRATION',text:'One customer record, two connected systems. Explicit ownership keeps every change moving in the right direction.',tags:['API contracts','Data mapping','Conflict handling']},
    {title:'Operations console',short:'Operations console',type:'OPERATIONAL SOFTWARE',text:'See what ran, find what failed, and retry a job. A small interface that makes background work understandable.',tags:['Job queues','Recovery','Visibility']},
  ],
  about: {
    title:'Clarity is part\nof the code.',
    text:'I work where product software meets everyday operations. My focus is making integrations understandable, backends maintainable, and technical decisions easier to act on. From the first diagram to the final handover, the goal is software your team can own.',
    steps:[{title:'Understand',text:'Map the process. Find the real constraint.'},{title:'Build',text:'Small, tested changes. Clear technical boundaries.'},{title:'Hand over',text:'Useful documentation. No black boxes.'}],
  },
  contact: {title:'Let’s make your\nsystems work together.',sub:'Good software starts with a clear conversation.'},
};
