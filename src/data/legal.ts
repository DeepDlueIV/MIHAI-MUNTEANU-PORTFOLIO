import { profile } from './profile.ts';
import { escape } from '../page.mjs';

export interface LegalDocument {
  title: string;
  path: string;
  description: string;
  intro: string;
  summary: string;
  updated: string;
  sections: { id: string; title: string; body: string }[];
}
// Editorial HTML is authored here, not accepted from visitors. Profile values are escaped.
const name = escape(profile.name);
const address = escape(profile.address);
const email = profile.contactEmail
  ? `<a href="mailto:${encodeURIComponent(profile.contactEmail)}">${escape(profile.contactEmail)}</a>`
  : 'the postal address below';
const contact = `<p><strong>${name}</strong><br>${address}<br>${email}</p>`;

export const privacy: LegalDocument = {
  title: 'Privacy Policy',
  path: '/privacy/',
  description: 'Privacy information for website visitors and software consulting enquiries to Mihai Munteanu.',
  intro: 'How personal information is handled when you visit this website or get in touch.',
  summary: 'This policy covers website visits, project enquiries, and the choices available to you.',
  updated: '2026-10-16',
  sections: [
    {id:'responsibility', title:'Who is responsible', body:`<p>For this website and direct project enquiries, the data controller is:</p>${contact}<p>Where a consulting engagement involves processing personal data on a client’s behalf, the respective responsibilities and any additional data-processing terms are agreed separately.</p>`},
    {id:'information', title:'Information collected', body:'<p><strong>Website visits.</strong> The hosting infrastructure receives technical information such as your IP address, requested page, request time, and browser information to deliver and protect the website.</p><p><strong>Email enquiries.</strong> If you get in touch, I receive your email address, the name or signature you include, your message, and any attachments. Providing this information is voluntary, but I need enough context and contact details to respond.</p><p>You can browse without registering. Contact is by email: an email link opens your own mail application and does not send a message automatically.</p>'},
    {id:'purposes', title:'Why information is used', body:'<p>I use enquiry information to understand your request, respond, and discuss potential work. Steps you request towards a contract rely on Article 6(1)(b) of the GDPR. Other professional correspondence, including enquiries on behalf of an organisation, relies on the legitimate interest in managing business communications under Article 6(1)(f).</p><p>Delivering the website and investigating technical or security incidents also rely on legitimate interests. Records retained to meet a legal obligation are processed under Article 6(1)(c). Enquiry information is not sold or used for automated decisions with legal or similarly significant effects.</p>'},
    {id:'storage', title:'Cookies and your preferences', body:'<p>This website does not use advertising trackers, audience analytics, or social-media embeds. When you select Full, Reduced, or Off in the animation menu, that choice is saved in your browser’s local storage.</p><p>The saved value is an interface preference, not a visitor identifier, and the website does not send it to a server. It remains until you change it, clear the site’s storage, or your browser removes it. Clearing the preference restores Full; you can select Reduced or Off at any time on the homepage.</p><p>Hosting infrastructure may separately use technical measures needed to deliver the website securely. The animation preference is not used to track you across websites.</p>'},
    {id:'providers', title:'Service providers and transfers', body:'<p>Vercel hosts this website. Email providers handle the delivery and storage of messages. Information may be accessed by providers needed to operate these services, or disclosed where required by law or necessary to protect legal rights.</p><p>Vercel operates international infrastructure, so technical information may be processed outside France or the European Economic Area. Its <a href="https://vercel.com/legal/privacy-notice" rel="noopener noreferrer" target="_blank">Privacy Notice</a> describes its processing and applicable transfer safeguards. Email processing also depends on the providers involved in the correspondence. You may request further information about recipients and safeguards relevant to your enquiry using the contact details above.</p>'},
    {id:'retention', title:'Retention', body:'<p>Enquiry correspondence is kept for the period needed to answer the request and manage relevant follow-up. If an enquiry becomes a client engagement, relevant records are kept for that relationship, applicable record-keeping duties, and the establishment, exercise, or defence of legal claims.</p><p>The retention period depends on the purpose and status of the correspondence and any applicable statutory or limitation period. Technical logs follow the hosting service’s operational and security retention arrangements. The animation preference follows the browser-based lifecycle described above. You may ask about the retention criteria applying to your information.</p>'},
    {id:'security', title:'Sharing information securely', body:'<p>Please include only the information needed to explain your enquiry. Do not send passwords, API keys, production credentials, customer databases, or sensitive personal information in an initial email. A suitable exchange method can be agreed where a project requires confidential material.</p><p>No network or email service can guarantee absolute security. External services have their own privacy practices, including the mail application and provider you use to contact me.</p>'},
    {id:'rights', title:'Your rights', body:`<p>Subject to the conditions in applicable law, you can request access, correction, erasure, or restriction of your personal data, and object to processing based on legitimate interests. Data portability applies to eligible automated processing based on consent or a contract. Where processing relies on consent, you may withdraw it without affecting earlier lawful processing.</p><p>Send requests to ${email}, identifying the correspondence or information concerned. Identity checks are limited to what is reasonably necessary. Requests are normally answered within one month. If complexity or the number of requests justifies a legally permitted extension of up to two further months, you will be informed within the initial month.</p><p>You may complain to <a href="https://www.cnil.fr/fr/plaintes" rel="noopener noreferrer" target="_blank">CNIL</a>, the French supervisory authority, or another competent supervisory authority, without contacting me first.</p>`},
    {id:'updates', title:'Changes and contact', body:`<p>Updates to this policy are published here with a revised date. Material changes to how information is used will be communicated as required by law.</p><p>For privacy questions, write to ${email} or ${address}. The <a href="/terms-of-service/">Terms of Service</a> cover use of this website.</p>`},
  ],
};

export const terms: LegalDocument = {
  title: 'Terms of Service',
  path: '/terms-of-service/',
  description: 'Website terms and the basis for software consulting enquiries to Mihai Munteanu.',
  intro: 'Terms for using this website and discussing a software consulting engagement.',
  summary: 'These terms cover website use. Consulting projects are governed by a separate written agreement.',
  updated: '2026-10-16',
  sections: [
    {id:'scope', title:'About this website', body:`<p>This website presents ${name}’s software consulting, backend architecture, and integration services. You may use it to explore these services and make a project enquiry.</p><p>Browsing or sending an enquiry does not place an order, create a paid engagement, or transfer intellectual property. The website is not a binding quotation.</p>`},
    {id:'portfolio', title:'Services and technical diagrams', body:'<p>The architecture diagrams explain integration patterns for payment events, customer records, and background jobs. They are not connected to live customer systems. A suitable implementation depends on the requirements, constraints, and existing systems of each project.</p><p>Descriptions of technical approaches are not guarantees of a particular performance level, availability, or commercial outcome.</p>'},
    {id:'use', title:'Responsible use', body:'<p>You may browse and share links to this website and contact me for legitimate enquiries. Do not disrupt its operation, attempt unauthorised access, introduce malicious material, impersonate others, or misrepresent a professional association.</p><p>Use of the website must respect applicable law and the rights of others.</p>'},
    {id:'engagements', title:'Project agreements', body:'<p>Before work begins, a separate written proposal or service agreement sets out the contracting parties, scope, deliverables, schedule, fees and taxes, payment arrangements, acceptance criteria, and any support commitments.</p><p>Access to systems and data, confidentiality requirements, responsibilities, and changes to scope are addressed in that agreement. The website alone does not authorise access to any system or establish an ongoing support obligation.</p>'},
    {id:'ownership', title:'Intellectual property', body:'<p>Rights in this website’s content, design, and software remain with their respective rights holders. Third-party components are subject to their own licences. Reuse must respect those rights and any permissions available under applicable law.</p><p>Ownership and permitted use of commissioned code, documentation, reusable components, and pre-existing tools are agreed for each project. These website terms do not transfer those rights.</p>'},
    {id:'confidentiality', title:'Confidentiality and personal data', body:'<p>Describe your initial enquiry without including credentials or unnecessary personal data. Confidentiality commitments, secure exchange methods, and any required data-processing agreement are arranged before sensitive project material is shared.</p><p>The <a href="/privacy/">Privacy Policy</a> explains how website visits, email enquiries, and browser preferences are handled.</p>'},
    {id:'fees', title:'Payment and changes', body:'<p>Fees, deposits, invoicing, payment deadlines, scope changes, and rights to suspend or end an engagement are defined in the separate project agreement and applicable law. This website does not collect payments or impose charges through browsing or initial contact.</p>'},
    {id:'availability', title:'Availability and liability', body:'<p>The website and its content may be updated or temporarily unavailable. Continuous access and suitability for a particular purpose are not guaranteed. Commitments for commissioned services are set out in their project agreement.</p><p>Liability is governed by applicable law and any valid project agreement. Nothing in these terms excludes liability where unlawful or limits mandatory consumer rights, statutory guarantees, or other non-excludable protections.</p>'},
    {id:'law', title:'Governing law and changes', body:'<p>French law applies to these website terms, without restricting mandatory protections or jurisdiction rights that apply to you. You may raise a concern by email to seek a practical resolution; this does not restrict access to a competent court or authority.</p><p>Revisions are published with an updated date and do not retrospectively alter a separately agreed project contract.</p>'},
    {id:'contact', title:'Contact', body:`<p>For a project enquiry or a question about this website:</p>${contact}`},
  ],
};
