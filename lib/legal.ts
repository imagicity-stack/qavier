import {
  DISPATCH_DAYS,
  FREE_SHIPPING_THRESHOLD,
  REFUND_DAYS,
  RETURN_WINDOW_DAYS,
  SHIPPING_METHODS,
} from './shipping';

/**
 * The store's legal pages, written once and rendered in both skins — the
 * flagship at /legal/<slug> and Pops at /pops/legal/<slug>.
 *
 * ⚠️  These are working drafts, not legal advice. Everything in BUSINESS below
 *     is a placeholder that renders literally on the page, so it is obvious
 *     what still has to be filled in. Have a lawyer review before launch; India's
 *     Consumer Protection (E-Commerce) Rules and the DPDP Act 2023 both put
 *     specific obligations on the seller.
 */
export const BUSINESS = {
  brand: 'Qavier',
  /** The registered entity that actually sells — appears on invoices. */
  legalName: '[Registered business name]',
  address: '[Registered address · City · State · PIN]',
  email: '[support@your-domain.com]',
  phone: '[Support phone number]',
  /** Required on Indian e-commerce sites that collect GST. */
  gstin: '[GSTIN]',
  /** IT Rules 2021 require a named grievance officer for Indian sites. */
  grievanceOfficer: '[Grievance officer name]',
  hours: 'Monday to Friday, 10:00–18:00 IST',
  /** Courts named in the governing-law clause. */
  jurisdiction: '[City], India',
} as const;

const money = (n: number) => `₹${n.toLocaleString('en-IN')}`;
const standard = SHIPPING_METHODS[0];
const express = SHIPPING_METHODS[1];

export interface LegalSection {
  heading: string;
  /** Paragraphs, rendered in order. */
  body?: string[];
  /** Bullet list, rendered after the paragraphs. */
  list?: string[];
}

export interface LegalDoc {
  slug: string;
  /** Full page title. */
  title: string;
  /** Short label for footers and nav. */
  nav: string;
  /** One line, used for the page intro and the meta description. */
  summary: string;
  sections: LegalSection[];
}

/** Date shown as "last updated" on every policy. */
export const LEGAL_UPDATED = 'February 2026';

export const LEGAL_DOCS: LegalDoc[] = [
  // ————————————————————————————————————————————————————————————
  {
    slug: 'terms',
    title: 'Terms & Conditions',
    nav: 'Terms',
    summary:
      'The terms you agree to when you browse this site or place an order with us.',
    sections: [
      {
        heading: 'Who you are dealing with',
        body: [
          `This site is operated by ${BUSINESS.legalName} ("${BUSINESS.brand}", "we", "us"), registered at ${BUSINESS.address}. GSTIN ${BUSINESS.gstin}.`,
          'By browsing this site or placing an order you accept these terms. If you do not accept them, please do not use the site.',
        ],
      },
      {
        heading: 'Orders and acceptance',
        body: [
          'Adding an item to your bag does not reserve it. Stock is only committed once payment is confirmed, so an item can sell out while it sits in your bag.',
          'Your order is an offer to buy. We accept it when we send the order confirmation email. Until then we may decline or cancel an order — for example if an item is out of stock, if a price or description was published in error, or if we suspect fraud. Where we cancel after payment, we refund in full.',
        ],
      },
      {
        heading: 'Prices and payment',
        body: [
          'Prices are shown in Indian Rupees and include applicable taxes unless stated otherwise. Shipping is added at checkout.',
          'Payment is taken on a hosted checkout operated by our payment provider. We never see or store your full card details.',
          'We may change prices at any time, but a change never affects an order we have already accepted.',
        ],
      },
      {
        heading: 'Products and how they appear',
        body: [
          'We photograph every piece as faithfully as we can, but screens differ. Slight variation in colour, texture and finish is normal and is not a fault.',
          'Garment measurements on the size chart are of the garment laid flat, not of the body, and may vary by about an inch.',
        ],
      },
      {
        heading: 'Shipping, returns and cancellations',
        body: [
          'Delivery timelines and charges are set out in the Shipping Policy. Your right to return, exchange or cancel, and how refunds are paid, are set out in the Returns & Refunds Policy. Both form part of these terms.',
        ],
      },
      {
        heading: 'Using this site',
        body: ['You agree not to:'],
        list: [
          'copy, resell or systematically extract any part of the site or catalogue;',
          'use the site to break the law, or to infringe anyone else\'s rights;',
          'interfere with the site\'s operation, security or availability;',
          'place orders fraudulently, or on someone else\'s payment method without their consent.',
        ],
      },
      {
        heading: 'Our intellectual property',
        body: [
          `The ${BUSINESS.brand} name, logos, garment designs, prints, photography and site copy belong to us or our licensors. Buying a product does not transfer any rights in the artwork on it.`,
          'You may share our product photography on social media with credit. You may not use it commercially, or reproduce our prints and designs on goods of your own.',
        ],
      },
      {
        heading: 'Third-party services',
        body: [
          'Our catalogue, cart and checkout run on Shopify, payments are handled by our payment provider, and delivery by third-party couriers. Their terms apply to the part they perform. We are not responsible for third-party sites we link to.',
        ],
      },
      {
        heading: 'Liability',
        body: [
          'Nothing here limits liability that cannot be limited by law — including liability for death or personal injury caused by negligence, or for fraud. Your rights under consumer law stand whatever these terms say.',
          'Beyond that, we are not liable for indirect or consequential loss, and our total liability for any order is limited to the amount you paid for it.',
        ],
      },
      {
        heading: 'Governing law',
        body: [
          `These terms are governed by the laws of India, and the courts at ${BUSINESS.jurisdiction} have exclusive jurisdiction over any dispute.`,
        ],
      },
      {
        heading: 'Changes',
        body: [
          'We may update these terms. The version published here when you place an order is the one that applies to it.',
        ],
      },
    ],
  },

  // ————————————————————————————————————————————————————————————
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    nav: 'Privacy',
    summary:
      'What personal data we collect, why we collect it, who we share it with, and the choices you have.',
    sections: [
      {
        heading: 'What we collect',
        body: ['We collect only what an order or a working shop needs:'],
        list: [
          'Contact and delivery details — name, email, phone, shipping address, PIN code.',
          'Order details — what you bought, sizes, amounts and order history.',
          'Payment confirmation — our payment provider tells us an order was paid. We never receive or store your full card number, CVV or UPI PIN.',
          'Technical data — IP address, browser and device type, pages viewed, collected through analytics.',
          'Anything you send us — messages, return requests, newsletter sign-ups.',
        ],
      },
      {
        heading: 'Why we use it',
        list: [
          'To take payment, fulfil, deliver and support your order.',
          'To handle returns, exchanges, refunds and warranty claims.',
          'To prevent fraud and keep the store secure.',
          'To meet tax, accounting and other legal obligations.',
          'To send marketing email, only if you asked for it — every message has an unsubscribe link.',
          'To understand which pages and products people use, so we can improve the shop.',
        ],
      },
      {
        heading: 'Cookies and analytics',
        body: [
          'Your bag is stored in your own browser so it survives a refresh; clearing site data empties it.',
          'We use Google Analytics 4 to count visits and see which pages perform. It sets cookies and records a trimmed IP address. Aggregate reporting is all we look at — we do not use it to identify you.',
          'You can block cookies in your browser. The shop keeps working, but your bag may not persist between visits.',
        ],
      },
      {
        heading: 'Who we share it with',
        body: [
          'We do not sell your personal data. We share it only with the services needed to run the shop, and only as far as they need it:',
        ],
        list: [
          'Shopify — catalogue, cart, checkout and order records.',
          'Our payment provider — to process payment and refunds.',
          'Couriers and logistics partners — to deliver your order and give you tracking.',
          'Google Analytics — site usage measurement.',
          'Our hosting provider, and professional advisers where legally required.',
        ],
      },
      {
        heading: 'How long we keep it',
        body: [
          'Order and invoice records are kept as long as tax and accounting law requires. Marketing contacts are kept until you unsubscribe. Analytics data is retained on the schedule set in our Google Analytics property.',
        ],
      },
      {
        heading: 'Your rights',
        body: [
          'You can ask us to give you a copy of your data, correct it, delete it, or stop using it for marketing. Write to us and we will respond within 30 days.',
          `We may need to keep records tied to a completed order even after a deletion request, where the law requires it. Under India's Digital Personal Data Protection Act 2023 you may also complain to the Data Protection Board. Our grievance officer is ${BUSINESS.grievanceOfficer}, reachable at ${BUSINESS.email}.`,
        ],
      },
      {
        heading: 'Security',
        body: [
          'The site is served over HTTPS and payments run on our provider\'s PCI-compliant hosted checkout. No system is perfectly secure, but we take reasonable technical and organisational measures to protect your data.',
        ],
      },
      {
        heading: 'Children',
        body: [
          'This shop is not directed at children under 18, and we do not knowingly collect their data. If you believe a child has given us personal data, contact us and we will delete it.',
        ],
      },
      {
        heading: 'Changes',
        body: [
          'If we change this policy we will update the date at the top of this page, and tell you directly where the change is significant.',
        ],
      },
    ],
  },

  // ————————————————————————————————————————————————————————————
  {
    slug: 'shipping',
    title: 'Shipping Policy',
    nav: 'Shipping',
    summary: 'What delivery costs, how long it takes, and what happens if it goes wrong.',
    sections: [
      {
        heading: 'Dispatch',
        body: [
          `Orders are packed and handed to the courier within ${DISPATCH_DAYS} of payment clearing. Orders placed on a weekend or public holiday go out on the next working day.`,
          'You get a tracking link by email as soon as the courier scans the parcel.',
        ],
      },
      {
        heading: 'Options and charges',
        list: [
          `${standard.label} — ${standard.detail}, ${money(standard.cost)}.`,
          `${express.label} — ${express.detail}, ${money(express.cost)}.`,
          `${standard.label} delivery is free on orders over ${money(FREE_SHIPPING_THRESHOLD)}.`,
        ],
        body: [
          'Timelines run from dispatch, not from when you order, and exclude weekends and public holidays.',
        ],
      },
      {
        heading: 'Where we ship',
        body: [
          'We deliver across India. Some PIN codes are not serviceable by our courier partners — checkout will tell you at the address step if yours is one of them.',
        ],
      },
      {
        heading: 'Delays',
        body: [
          'Estimates are estimates. Weather, strikes, regional restrictions and courier backlogs during sale periods can add days, and we cannot control them. If your parcel has not moved for five working days, contact us and we will chase it.',
        ],
      },
      {
        heading: 'Addresses',
        body: [
          'Please check your address and phone number before paying — we cannot change them once a parcel is with the courier. Parcels returned to us because of an incorrect or incomplete address can be re-sent, with shipping charged again.',
        ],
      },
      {
        heading: 'Damaged or missing parcels',
        body: [
          'If a parcel arrives damaged or looks tampered with, photograph it before opening and contact us within 48 hours of delivery. If tracking says delivered and you have not received it, tell us within 7 days so we can raise it with the courier.',
        ],
      },
    ],
  },

  // ————————————————————————————————————————————————————————————
  {
    slug: 'returns',
    title: 'Returns & Refunds',
    nav: 'Returns',
    summary:
      'How to return or exchange a piece, when we can accept it, and how refunds are paid.',
    sections: [
      {
        heading: 'The window',
        body: [
          `You have ${RETURN_WINDOW_DAYS} days from delivery to start a return. Tell us within that window — the parcel does not have to be back with us by then.`,
        ],
      },
      {
        heading: 'What we can accept',
        body: ['A piece must come back:'],
        list: [
          'unworn and unwashed, free of marks, scent and pet hair;',
          'with all original tags and packaging intact;',
          'in a condition we could sell again.',
        ],
      },
      {
        heading: 'What we cannot accept',
        list: [
          'Items marked final sale at the time of purchase.',
          'Items returned without tags, or visibly worn, washed or altered.',
          'Innerwear and pierced jewellery, for hygiene reasons.',
          'Requests raised after the return window has closed.',
        ],
      },
      {
        heading: 'How to start one',
        body: [
          `Email ${BUSINESS.email} with your order number, the piece you want to return, and whether you would like a refund or an exchange. We will reply with return instructions.`,
          'Please do not send anything back before we confirm — unannounced returns are hard to trace to an order.',
        ],
      },
      {
        heading: 'Refunds',
        body: [
          `Once we receive and inspect the piece, refunds go back to the original payment method within ${REFUND_DAYS}. How quickly it then appears is up to your bank.`,
          'We refund the price you paid for the item. Original shipping is refunded only where the item was faulty, damaged, or not what you ordered.',
        ],
      },
      {
        heading: 'Exchanges',
        body: [
          'Exchanges depend on stock. If your size or colour is gone by the time your return reaches us, we refund instead and tell you.',
        ],
      },
      {
        heading: 'Faulty, damaged or wrong items',
        body: [
          'If something arrives faulty, damaged or simply is not what you ordered, contact us within 7 days of delivery with photographs. We cover return shipping and replace or refund in full — this is in addition to your rights under consumer law.',
        ],
      },
      {
        heading: 'Cancelling an order',
        body: [
          'You can cancel free of charge any time before dispatch — email us quickly and we will stop it if we can. Once a parcel is with the courier it has to be handled as a return.',
        ],
      },
    ],
  },

  // ————————————————————————————————————————————————————————————
  {
    slug: 'contact',
    title: 'Contact Us',
    nav: 'Contact',
    summary: 'How to reach a person, and how long we take to answer.',
    sections: [
      {
        heading: 'Get in touch',
        list: [
          `Email — ${BUSINESS.email}`,
          `Phone — ${BUSINESS.phone}, ${BUSINESS.hours}`,
          `Registered address — ${BUSINESS.legalName}, ${BUSINESS.address}`,
          `GSTIN — ${BUSINESS.gstin}`,
        ],
      },
      {
        heading: 'Response times',
        body: [
          'We answer email within one working day, and usually the same day. Messages sent over a weekend are picked up on Monday.',
          'Please include your order number — it turns a two-day exchange into a two-minute one.',
        ],
      },
      {
        heading: 'Grievance officer',
        body: [
          `In line with India's Information Technology Rules, complaints can be sent to our grievance officer, ${BUSINESS.grievanceOfficer}, at ${BUSINESS.email}. We acknowledge complaints within 48 hours and aim to resolve them within 30 days.`,
        ],
      },
    ],
  },
];

export function getLegalDoc(slug: string): LegalDoc | undefined {
  return LEGAL_DOCS.find((d) => d.slug === slug);
}

/** Footer links for the flagship (`/legal/...`) or Pops (`/pops/legal/...`). */
export function legalLinks(base: '' | '/pops' = '') {
  return LEGAL_DOCS.map((d) => ({ label: d.nav, href: `${base}/legal/${d.slug}` }));
}
