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
/** Single content source. The projects array describes service patterns, not client history. */
export const profile: Profile = {
  name: 'Mihai Munteanu',
  role: 'Software consultant',
  specialty: 'Backend & integration architecture',
  location: 'Paris, France',
  address: '47 rue Vivienne, 75002 Paris, France',
  // Exact spelling supplied by the owner: muntenau, not munteanu.
  contactEmail: 'mihai.muntenau@inbox.eu',
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
    secondary: 'Explore solutions',
  },
  expertise: [
    {title:'Backend architecture',text:'Clear service boundaries, well-defined APIs, and a data model your team can build on.',tag:'A practical technical foundation',icon:'layers'},
    {title:'System integrations',text:'Connect CRM, billing, and product data with explicit mapping, retries, and error handling.',tag:'Clear rules for every handoff',icon:'connect'},
    {title:'Backend modernisation',text:'Improve existing software through incremental changes that fit day-to-day operations.',tag:'Controlled, incremental delivery',icon:'cycle'},
  ],
  projects: [
    {title:'Billing event pipeline',short:'Billing pipeline',type:'EVENT-DRIVEN BACKEND',text:'Validate payment webhooks, handle repeat deliveries safely, and update product state through a traceable event flow.',tags:['Webhooks','Idempotency','Event processing']},
    {title:'CRM ↔ product sync',short:'CRM ↔ product',type:'BUSINESS-SYSTEM INTEGRATION',text:'Keep customer records aligned across your product and CRM, with explicit field ownership and conflict handling.',tags:['API contracts','Data mapping','Conflict handling']},
    {title:'Operations console',short:'Operations console',type:'OPERATIONAL SOFTWARE',text:'Give your team a clear view of background jobs: what completed, what needs attention, and what can be retried.',tags:['Job queues','Recovery','Visibility']},
  ],
  about: {
    title:'Clarity is part\nof the code.',
    text:'I work where product software meets everyday operations. I start by mapping how data moves, where it fails, and who needs to use it. From API design to implementation and handover, I focus on decisions your team can understand and software it can maintain.',
    steps:[{title:'Understand',text:'Map the process, dependencies, and constraints.'},{title:'Build',text:'Implement and test changes in manageable steps.'},{title:'Hand over',text:'Document the system and its operating procedures.'}],
  },
  contact: {title:'Let’s make your\nsystems work together.',sub:'Tell me what needs to connect and where the current process falls short.'},
};
