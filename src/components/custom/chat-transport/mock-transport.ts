import type {
  Tab,
  TabDef,
  AssigneeItem,
  ChannelItem,
  ChatItem,
  ChatMessage,
  Contact,
  ContactDetails,
  TemplateDef,
  TemplateCategory,
  ChatFilters,
  SendMessagePayload,
  TemplateSendPayload,
  CannedMessage,
} from "../chat-types"
import type { ChatTransport } from "./types"

/* ── Mock Data ── */

const tabs: TabDef[] = [
  { id: "open", label: "Open", count: 10 },
  { id: "assigned", label: "Assigned", count: 2 },
  { id: "resolved", label: "Resolved", count: 5 },
]

const assignees: AssigneeItem[] = [
  { id: "all", label: "All", type: "all" },
  { id: "unassigned", label: "Unassigned", type: "unassigned" },
  { id: "ivr-voice-bot", label: "IVR voice bot", type: "bot" },
  { id: "whatsapp-bot", label: "WhatsApp bot", type: "bot" },
  { id: "support-bot", label: "Support bot", type: "bot" },
  { id: "alex-smith", label: "Alex Smith", type: "agent" },
  { id: "jane-doe", label: "Jane Doe", type: "agent" },
  { id: "sam-lee", label: "Sam Lee", type: "agent" },
  { id: "priya-sharma", label: "Priya Sharma", type: "agent" },
  { id: "rahul-verma", label: "Rahul Verma", type: "agent" },
  { id: "neha-gupta", label: "Neha Gupta", type: "agent" },
  { id: "vikram-singh", label: "Vikram Singh", type: "agent" },
  { id: "anita-desai", label: "Anita Desai", type: "agent" },
  { id: "mohit-kumar", label: "Mohit Kumar", type: "agent" },
  { id: "deepika-patel", label: "Deepika Patel", type: "agent" },
  { id: "arjun-reddy", label: "Arjun Reddy", type: "agent" },
  { id: "kavita-nair", label: "Kavita Nair", type: "agent" },
]

const channels: ChannelItem[] = [
  { id: "my01", name: "MyOperator Sales", phone: "+91 9212992129", badge: "MY01" },
  { id: "my02", name: "MyOperator", phone: "+91 8069200945", badge: "MY02" },
  { id: "my03", name: "MyOperator", phone: "+91 9319358395", badge: "MY03" },
  { id: "my04", name: "MyOperator Support", phone: "+91 9876543210", badge: "MY04" },
  { id: "my05", name: "MyOperator Billing", phone: "+91 8765432109", badge: "MY05" },
  { id: "my06", name: "Partner Channel", phone: "+91 7654321098", badge: "MY06" },
  { id: "my07", name: "Enterprise Sales", phone: "+91 6543210987", badge: "MY07" },
  { id: "my08", name: "APAC Support", phone: "+91 5432109876", badge: "MY08" },
]

const chatItems: ChatItem[] = [
  {
    id: "1",
    tab: "open",
    name: "Aditi Kumar",
    message: "Have a look at this document",
    timestamp: "2:30 PM",
    messageStatus: "sent",
    messageType: "document",
    channel: "MY01",
    agentName: "Alex Smith",
  },
  {
    id: "2",
    tab: "open",
    name: "+91 98765 43210",
    message: "Authentication message sent",
    timestamp: "2:29 PM",
    messageStatus: "read",
    channel: "MY01",
  },
  {
    id: "3",
    tab: "open",
    name: "Arsh Raj",
    message: "Authentication message sent",
    timestamp: "2:29 PM",
    channel: "MY01",
    isFailed: true,
  },
  {
    id: "4",
    tab: "open",
    name: "Nitin Rajput",
    message: "I am super excited",
    timestamp: "Yesterday",
    unreadCount: 1,
    slaTimer: "2h",
    channel: "MY01",
    agentName: "IVR voice bot",
    isBot: true,
  },
  {
    id: "5",
    tab: "open",
    name: "Sushmit",
    message: "Hi",
    timestamp: "Yesterday",
    unreadCount: 1,
    slaTimer: "2h",
    channel: "MY01",
  },
  {
    id: "6",
    tab: "open",
    name: "Rohit Gupta",
    message: "We get many food delivery orders. Can we...",
    timestamp: "Yesterday",
    unreadCount: 1,
    slaTimer: "50m",
    channel: "MY01",
    agentName: "Deleted User",
    isAgentDeleted: true,
  },
  {
    id: "7",
    tab: "open",
    name: "Sushant Arya",
    message: "I am super excited!",
    timestamp: "Saturday",
    unreadCount: 1,
    channel: "MY01",
    isWindowExpired: true,
  },
  {
    id: "8",
    tab: "assigned",
    name: "Priya Sharma",
    message: "When will my order be delivered?",
    timestamp: "1:15 PM",
    messageStatus: "sent",
    channel: "MY02",
    agentName: "Jane Doe",
  },
  {
    id: "9",
    tab: "assigned",
    name: "Vikram Singh",
    message: "Please share the invoice",
    timestamp: "12:40 PM",
    messageStatus: "delivered",
    channel: "MY01",
    agentName: "Alex Smith",
  },
  {
    id: "10",
    tab: "resolved",
    name: "Deepika Patel",
    message: "Thank you for your help!",
    timestamp: "Monday",
    messageStatus: "read",
    channel: "MY01",
    agentName: "Sam Lee",
  },
  {
    id: "11",
    tab: "resolved",
    name: "Mohit Kumar",
    message: "Issue resolved, thanks.",
    timestamp: "Sunday",
    messageStatus: "read",
    channel: "MY03",
    agentName: "Priya Sharma",
  },
  {
    id: "12",
    tab: "resolved",
    name: "Anita Desai",
    message: "Got it, will proceed.",
    timestamp: "Saturday",
    messageStatus: "read",
    channel: "MY02",
  },
  /* Storybook: isolated message-type showcases (Chat Message List) */
  {
    id: "msg-story-referral",
    tab: "open",
    name: "Story: Referral (CTWA)",
    message: "Referral payloads",
    timestamp: "Now",
    channel: "MY01",
  },
  {
    id: "msg-story-location",
    tab: "open",
    name: "Story: Location pin",
    message: "Location payloads",
    timestamp: "Now",
    channel: "MY01",
  },
  {
    id: "msg-story-contact",
    tab: "open",
    name: "Story: Contact card",
    message: "Contact payloads",
    timestamp: "Now",
    channel: "MY01",
  },
  {
    id: "msg-story-list",
    tab: "open",
    name: "Story: List reply",
    message: "List reply payloads",
    timestamp: "Now",
    channel: "MY01",
  },
]

const templateList: TemplateDef[] = [
  {
    id: "book-free-demo",
    name: "Book Free Demo",
    category: "marketing",
    type: "text",
    body: "Hi {{name}}! Book a free demo of our platform today and discover how MyOperator can transform your business.",
    bodyVariables: ["{{name}}"],
  },
  {
    id: "enterprise-plan",
    name: "Enterprise Plan",
    category: "marketing",
    type: "text",
    body: "Hi {{name}}! We have a special enterprise plan tailored for {{company}}. Get in touch today.",
    bodyVariables: ["{{name}}", "{{company}}"],
  },
  {
    id: "suv-plan",
    name: "SUV Plan",
    category: "utility",
    type: "image",
    body: "Hi {{name}}! Have a look at this document.",
    bodyVariables: ["{{name}}"],
    button: "Interested",
  },
  {
    id: "carousel",
    name: "Shopify Order Update",
    category: "marketing",
    type: "carousel",
    body: "Hi {{customer_name}}! Your order {{order_id}} has been confirmed.",
    footer: "MyOperator — Order Notifications",
    bodyVariables: ["{{customer_name}}", "{{order_id}}"],
    cardImages: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=300&h=200&fit=crop",
    ],
    cards: [
      {
        cardIndex: 1,
        bodyVariables: ["{{product_name}}", "{{quantity}}", "{{price}}"],
        buttonVariables: ["{{tracking_url}}"],
      },
      {
        cardIndex: 2,
        bodyVariables: ["{{product_name}}", "{{quantity}}", "{{price}}"],
        buttonVariables: ["{{tracking_url}}"],
      },
      {
        cardIndex: 3,
        bodyVariables: ["{{product_name}}", "{{quantity}}"],
        buttonVariables: [],
      },
    ],
  },
  {
    id: "option-5",
    name: "Option 5",
    category: "authentication",
    type: "text",
    body: "Your verification code is {{code}}. This code is valid for 10 minutes. Do not share it with anyone.",
    bodyVariables: ["{{code}}"],
  },
]

const chatMessages: Record<string, ChatMessage[]> = {
  "1": [
    { id: "m1", text: "Hi, I need help with my account settings", time: "2:15 PM", sender: "customer" },
    { id: "m1b", text: "Assigned to **Alex Smith** by **Alex Smith**", time: "", sender: "agent", type: "system" },
    {
      id: "m2",
      text: "Sure, I'd be happy to help!",
      time: "2:16 PM",
      sender: "agent",
      senderName: "Alex Smith",
      status: "read",
      sentBy: { type: "agent", name: "Alex Smith" },
      replyTo: { sender: "Aditi Kumar", text: "Hi, I need help with my account settings", messageId: "m1" },
    },
    {
      id: "m3",
      text: "",
      time: "2:18 PM",
      sender: "customer",
      type: "image",
      media: {
        url: "https://picsum.photos/seed/chat1/683/546",
        caption: "Here is a screenshot of the issue I'm facing",
      },
    },
    { id: "m4", text: "", time: "2:20 PM", sender: "customer", type: "audio", media: { url: "#", duration: "0:10" } },
    {
      id: "m5",
      text: "",
      time: "2:21 PM",
      sender: "agent",
      senderName: "Alex Smith",
      status: "delivered",
      sentBy: { type: "agent", name: "Alex Smith" },
      type: "audio",
      media: { url: "#", duration: "1:35" },
    },
    {
      id: "m6",
      text: "",
      time: "2:23 PM",
      sender: "agent",
      senderName: "Alex Smith",
      status: "delivered",
      sentBy: { type: "agent", name: "Alex Smith" },
      type: "video",
      media: {
        url: "https://picsum.photos/seed/vid1/683/400",
        thumbnailUrl: "https://picsum.photos/seed/vid1/683/400",
        duration: "3:45",
        caption: "WhatsApp API Setup Tutorial",
      },
    },
    {
      id: "m7",
      text: "Have a look at this document",
      time: "2:30 PM",
      sender: "agent",
      senderName: "Alex Smith",
      status: "failed",
      sentBy: { type: "agent", name: "Alex Smith" },
      type: "docPreview",
      media: {
        url: "https://picsum.photos/seed/doc1/442/308",
        thumbnailUrl: "https://picsum.photos/seed/doc1/442/308",
        filename: "Introduction to Live Chat.pdf",
        fileType: "PDF",
        pageCount: 46,
        fileSize: "5MB",
      },
    },
    {
      id: "m8",
      text: "",
      time: "2:27 PM",
      sender: "customer",
      type: "document",
      media: {
        url: "https://picsum.photos/seed/doc2/442/308",
        thumbnailUrl: "https://picsum.photos/seed/doc2/442/308",
        filename: "Monthly_Report_Feb.pdf",
        fileType: "PDF",
        pageCount: 12,
        fileSize: "3.1MB",
      },
    },
    {
      id: "m9",
      text: "Have a look at this document",
      time: "2:28 PM",
      sender: "customer",
      type: "otherDoc",
      media: { url: "#", filename: "Order_Data_Q4.xlsx", fileType: "XLS", pageCount: 46, fileSize: "2.3MB" },
    },
    {
      id: "m10",
      text: "Check out our latest products!",
      time: "2:29 PM",
      sender: "agent",
      senderName: "Alex Smith",
      status: "delivered",
      sentBy: { type: "campaign" },
      type: "carousel",
      media: {
        url: "#",
        images: [
          {
            url: "https://picsum.photos/seed/c1/300/240",
            mediaType: "image",
            title: "Product Catalog 2025",
            buttons: [
              { label: "View Details", icon: "link" },
              { label: "Share", icon: "reply" },
            ],
          },
          {
            url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            mediaType: "video",
            thumbnailUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
            title: "New Arrivals — Video Tour",
            buttons: [{ label: "Shop Now", icon: "link" }],
          },
          {
            url: "https://picsum.photos/seed/c3/300/240",
            mediaType: "image",
            title: "Special Offers & Deals",
            buttons: [
              { label: "Learn More", icon: "link" },
              { label: "Share", icon: "reply" },
            ],
          },
        ],
      },
    },
    {
      id: "m11",
      text: "",
      time: "2:30 PM",
      sender: "agent",
      senderName: "Alex Smith",
      status: "sent",
      sentBy: { type: "campaign" },
      type: "loading",
      error: "Template message could not be delivered. The message template has been rejected.",
    },
    {
      id: "m12",
      text: "I saw your ad on Instagram!",
      time: "2:32 PM",
      sender: "customer",
      type: "referral",
      referral: {
        headline: "MyOperator — Smart IVR & WhatsApp Business",
        body: "Automate your customer support with cloud telephony and WhatsApp API. Free demo!",
        sourceUrl: "fb.me/myoperator-ad",
        thumbnailUrl: "https://picsum.photos/seed/ad-thumb/120/120",
        sourceType: "ad",
      },
    },
    {
      id: "m13",
      text: "",
      time: "2:34 PM",
      sender: "customer",
      type: "location",
      location: {
        latitude: 28.6139,
        longitude: 77.2090,
        name: "India Gate",
        address: "Rajpath Marg, India Gate, New Delhi, Delhi 110001",
      },
    },
    {
      id: "m14",
      text: "",
      time: "2:35 PM",
      sender: "customer",
      type: "contact",
      contactCard: {
        name: "Priya Sharma",
        phone: "+91 98765 43210",
        email: "priya.sharma@example.com",
        organization: "MyOperator",
      },
    },
    {
      id: "m15",
      text: "",
      time: "2:37 PM",
      sender: "agent",
      senderName: "Alex Smith",
      status: "delivered",
      sentBy: { type: "api", name: "Zapier" },
      type: "listReply",
      listReply: {
        header: "Choose your plan",
        body: "We have multiple plans tailored to your needs. Select an option below to learn more about each plan.",
        footer: "Reply with the option number or tap below",
        buttonText: "See options",
        sections: [
          {
            title: "Plans",
            rows: [
              { id: "1", title: "Starter", description: "Up to 3 agents, 1000 conversations/mo" },
              { id: "2", title: "Growth", description: "Up to 10 agents, 5000 conversations/mo" },
              { id: "3", title: "Enterprise", description: "Unlimited agents & conversations" },
            ],
          },
        ],
      },
    },
  ],
  "2": [
    { id: "m1", text: "Hello, I'd like to know about your enterprise plans", time: "2:10 PM", sender: "customer" },
    {
      id: "m2",
      text: "Welcome! I'll share our enterprise pricing details with you.",
      time: "2:15 PM",
      sender: "agent",
      status: "read",
      sentBy: { type: "agent", name: "Kavita Nair" },
    },
    { id: "m3", text: "", time: "2:20 PM", sender: "customer", type: "audio", media: { url: "#", duration: "0:10" } },
    {
      id: "m4",
      text: "",
      time: "2:22 PM",
      sender: "agent",
      status: "delivered",
      sentBy: { type: "agent", name: "Kavita Nair" },
      type: "audio",
      media: { url: "#", duration: "1:35" },
    },
    {
      id: "m5",
      text: "Authentication message sent",
      time: "2:29 PM",
      sender: "agent",
      status: "read",
      sentBy: { type: "api" },
    },
  ],
  "3": [
    { id: "m1", text: "Can you help me set up the API integration?", time: "1:45 PM", sender: "customer" },
    {
      id: "m2",
      text: "Of course! Here's a quick video tutorial.",
      time: "1:50 PM",
      sender: "agent",
      status: "delivered",
      sentBy: { type: "bot" },
    },
    {
      id: "m3",
      text: "",
      time: "1:52 PM",
      sender: "agent",
      status: "delivered",
      sentBy: { type: "bot" },
      type: "video",
      media: {
        url: "https://picsum.photos/seed/vid1/683/400",
        thumbnailUrl: "https://picsum.photos/seed/vid1/683/400",
        duration: "3:45",
        caption: "WhatsApp API Setup Tutorial",
      },
    },
    { id: "m4", text: "The WhatsApp Business API", time: "2:00 PM", sender: "customer" },
    {
      id: "m5",
      text: "Authentication message sent",
      time: "2:29 PM",
      sender: "agent",
      status: "failed",
      sentBy: { type: "api" },
    },
  ],
  "4": [
    { id: "m1", text: "I am super excited", time: "Yesterday", sender: "customer" },
    {
      id: "m2",
      text: "",
      time: "Yesterday",
      sender: "customer",
      type: "carousel",
      media: {
        url: "#",
        images: [
          {
            url: "https://picsum.photos/seed/c1/300/240",
            mediaType: "image",
            title: "Product Catalog 2025",
            buttons: [
              { label: "View Details", icon: "link" },
              { label: "Share", icon: "reply" },
            ],
          },
          {
            url: "https://picsum.photos/seed/c2/300/240",
            mediaType: "image",
            title: "New Arrivals Collection",
            buttons: [{ label: "Shop Now", icon: "link" }],
          },
          {
            url: "https://picsum.photos/seed/c3/300/240",
            mediaType: "image",
            title: "Special Offers & Deals",
            buttons: [
              { label: "Learn More", icon: "link" },
              { label: "Share", icon: "reply" },
            ],
          },
        ],
      },
    },
  ],
  "5": [
    { id: "m1", text: "Hi, can you share the proposal?", time: "Yesterday", sender: "customer" },
    {
      id: "m2",
      text: "Sure, here's the PDF.",
      time: "Yesterday",
      sender: "agent",
      status: "read",
      sentBy: { type: "agent", name: "Jane Doe" },
    },
    {
      id: "m3",
      text: "",
      time: "Yesterday",
      sender: "agent",
      status: "read",
      sentBy: { type: "agent", name: "Jane Doe" },
      type: "docPreview",
      media: {
        url: "https://picsum.photos/seed/doc1/442/308",
        thumbnailUrl: "https://picsum.photos/seed/doc1/442/308",
        filename: "Project_Proposal_2025.pdf",
        fileType: "PDF",
        pageCount: 46,
        fileSize: "5MB",
      },
    },
  ],
  "6": [
    {
      id: "m1",
      text: "We get many food delivery orders. Can we set up an automated response for those?",
      time: "Yesterday",
      sender: "customer",
    },
    {
      id: "m2",
      text: "Here's the order data from last quarter",
      time: "Yesterday",
      sender: "customer",
      type: "otherDoc",
      media: { url: "#", filename: "Order_Data_Q4.xlsx", fileType: "XLS", pageCount: 12, fileSize: "2.3MB" },
    },
    {
      id: "m3",
      text: "",
      time: "Yesterday",
      sender: "agent",
      status: "sent",
      sentBy: { type: "campaign" },
      type: "loading",
      error: "Template message could not be delivered. The message template has been rejected.",
    },
  ],
  "7": [
    { id: "m1", text: "I am super excited!", time: "Saturday", sender: "customer" },
    {
      id: "m2",
      text: "Here's the report you requested!",
      time: "Saturday",
      sender: "agent",
      status: "delivered",
      sentBy: { type: "agent", name: "Alex Smith" },
    },
    {
      id: "m3",
      text: "",
      time: "Saturday",
      sender: "agent",
      status: "delivered",
      sentBy: { type: "agent", name: "Alex Smith" },
      type: "document",
      media: {
        url: "https://picsum.photos/seed/doc2/442/308",
        thumbnailUrl: "https://picsum.photos/seed/doc2/442/308",
        filename: "Monthly_Report_Feb.pdf",
        fileType: "PDF",
        pageCount: 12,
        fileSize: "3.1MB",
      },
    },
  ],
  /* ReferralPayload — headline (required in UI); body, sourceUrl, thumbnailUrl, sourceType optional */
  "msg-story-referral": [
    {
      id: "sr-full",
      text: "I came from this ad (all optional fields set).",
      time: "10:00 AM",
      sender: "customer",
      type: "referral",
      referral: {
        headline: "MyOperator — Cloud telephony & WhatsApp Business API",
        body: "Automate IVR, live chat, and campaigns. Book a free demo with our solutions team.",
        sourceUrl: "https://fb.me/myoperator-promo",
        thumbnailUrl: "https://picsum.photos/seed/referral-ad/120/120",
        sourceType: "ad",
      },
    },
    {
      id: "sr-post",
      text: "This one is from a social post.",
      time: "10:02 AM",
      sender: "customer",
      type: "referral",
      referral: {
        headline: "Monsoon sale — 40% off annual plans",
        body: "Limited time offer for SMB teams upgrading from legacy PBX.",
        sourceType: "post",
        thumbnailUrl: "https://picsum.photos/seed/referral-post/120/120",
        sourceUrl: "https://instagram.com/p/example",
      },
    },
    {
      id: "sr-unknown",
      text: "Unknown source type — headline only.",
      time: "10:04 AM",
      sender: "customer",
      type: "referral",
      referral: {
        headline: "Partner referral — contact sales",
        sourceType: "unknown",
      },
    },
  ],
  /* LocationPayload — latitude & longitude required; name & address optional */
  "msg-story-location": [
    {
      id: "sl-full",
      text: "Here is our office (name + address + coordinates).",
      time: "11:00 AM",
      sender: "customer",
      type: "location",
      location: {
        latitude: 19.076,
        longitude: 72.8777,
        name: "MyOperator HQ (example)",
        address: "Bandra Kurla Complex, Mumbai, Maharashtra 400051",
      },
    },
    {
      id: "sl-coords",
      text: "Coordinates only (no place name or address).",
      time: "11:05 AM",
      sender: "customer",
      type: "location",
      location: {
        latitude: -33.8688,
        longitude: 151.2093,
      },
    },
  ],
  /* ContactPayload — name & phone required in product flows; email & organization optional */
  "msg-story-contact": [
    {
      id: "sc-full",
      text: "Please use this contact (all fields).",
      time: "12:00 PM",
      sender: "customer",
      type: "contact",
      contactCard: {
        name: "Priya Sharma",
        phone: "+91 98765 43210",
        email: "priya.sharma@example.com",
        organization: "MyOperator Pvt Ltd",
      },
    },
    {
      id: "sc-min",
      text: "Minimal vCard — name and phone only.",
      time: "12:03 PM",
      sender: "customer",
      type: "contact",
      contactCard: {
        name: "Arjun Mehta",
        phone: "+91 91234 56789",
      },
    },
  ],
  /* ListReplyPayload — body & buttonText required; header, footer, sections optional (sections for API parity) */
  "msg-story-list": [
    {
      id: "slr-full",
      text: "",
      time: "1:00 PM",
      sender: "agent",
      senderName: "Alex Smith",
      status: "delivered",
      sentBy: { type: "agent", name: "Alex Smith" },
      type: "listReply",
      listReply: {
        header: "Choose a support tier",
        body: "Pick the option that matches your team size. You can change plans later from billing settings.",
        footer: "Reply with a number or tap the button below.",
        buttonText: "View options",
        sections: [
          {
            title: "Self-serve",
            rows: [
              {
                id: "s1",
                title: "Starter",
                description: "Up to 3 agents · 1k conversations / mo",
              },
              {
                id: "s2",
                title: "Growth",
                description: "Up to 10 agents · 5k conversations / mo",
              },
            ],
          },
          {
            title: "Enterprise",
            rows: [
              {
                id: "e1",
                title: "Custom SLA",
                description: "Dedicated CSM & onboarding",
              },
            ],
          },
        ],
      },
    },
    {
      id: "slr-min",
      text: "",
      time: "1:05 PM",
      sender: "agent",
      senderName: "Alex Smith",
      status: "delivered",
      sentBy: { type: "agent", name: "Alex Smith" },
      type: "listReply",
      listReply: {
        body: "Which integration do you need help with?",
        buttonText: "Show list",
      },
    },
  ],
}

/**
 * Message arrays used by Chat Message List isolated stories — re-export for Chat Bubble
 * stories so both show identical `ChatMessage` payloads (no drift).
 */
export const chatMessageListStoryThreadMessages = {
  /** Chat id \`2\` — minimal back-and-forth + audio + API line */
  minimalConversation: chatMessages["2"],
  /** Chat id \`msg-story-referral\` — ad, post, unknown referral shapes */
  referralAllPayloadShapes: chatMessages["msg-story-referral"],
  /** Chat id \`msg-story-location\` — name + address vs coordinates only */
  locationNameVsCoords: chatMessages["msg-story-location"],
  /** Chat id \`msg-story-contact\` — full vCard vs minimal */
  contactFullVsMinimal: chatMessages["msg-story-contact"],
  /** Chat id \`msg-story-list\` — full list reply vs body + button only */
  listReplyFullVsMinimal: chatMessages["msg-story-list"],
} as const

const contacts: Contact[] = [
  { id: "c1", name: "Aditi Kumar", phone: "+91 98765 43210", channel: "MY01" },
  { id: "c2", name: "Arsh Raj", phone: "+91 91234 56789", channel: "MY01" },
  { id: "c3", name: "Deepika Patel", phone: "+91 87654 32109", channel: "MY01" },
  { id: "c4", name: "Jane Doe", phone: "+91 76543 21098", channel: "MY02" },
  { id: "c5", name: "Kavita Nair", phone: "+91 65432 10987", channel: "MY03" },
  { id: "c6", name: "Mohit Kumar", phone: "+91 99887 76655", channel: "MY01" },
  { id: "c7", name: "Neha Gupta", phone: "+91 88776 65544", channel: "MY02" },
  { id: "c8", name: "Nitin Rajput", phone: "+91 77665 54433", channel: "MY01" },
  { id: "c9", name: "Priya Sharma", phone: "+91 66554 43322", channel: "MY03" },
  { id: "c10", name: "Rahul Verma", phone: "+91 55443 32211", channel: "MY01" },
  { id: "c11", name: "Rohit Gupta", phone: "+91 44332 21100", channel: "MY02" },
  { id: "c12", name: "Sam Lee", phone: "+91 93300 11122", channel: "MY01" },
  { id: "c13", name: "Sushmit", phone: "+91 92200 33344", channel: "MY03" },
  { id: "c14", name: "Sushant Arya", phone: "+91 91100 55566", channel: "MY01" },
  { id: "c15", name: "Vikram Singh", phone: "+91 90000 77788", channel: "MY02" },
]

const cannedMessages: CannedMessage[] = [
  { id: "1", shortcut: "Test", body: "Test" },
  { id: "2", shortcut: "Greeting", body: "Hi, how can I help you today?" },
]

/* ── Helper ── */

const delay = () => new Promise<void>((r) => setTimeout(r, 100))

let messageCounter = 1000

/* ── MockTransport ── */

export class MockTransport implements ChatTransport {
  async fetchTabs(): Promise<TabDef[]> {
    await delay()
    return [...tabs]
  }

  async fetchAssignees(): Promise<AssigneeItem[]> {
    await delay()
    return [...assignees]
  }

  async fetchChannels(): Promise<ChannelItem[]> {
    await delay()
    return [...channels]
  }

  async fetchChats(params: {
    tab: Tab
    search?: string
    filters?: ChatFilters
  }): Promise<ChatItem[]> {
    await delay()
    let items = chatItems.filter((c) => c.tab === params.tab)

    if (params.search) {
      const q = params.search.toLowerCase()
      items = items.filter(
        (c) => c.name.toLowerCase().includes(q) || c.message.toLowerCase().includes(q),
      )
    }

    if (params.filters?.assignees && params.filters.assignees.size > 0) {
      items = items.filter((c) => {
        if (!c.agentName) return params.filters!.assignees!.has("unassigned")
        return params.filters!.assignees!.has(
          c.agentName.toLowerCase().replace(/\s+/g, "-"),
        )
      })
    }

    if (params.filters?.channels && params.filters.channels.size > 0) {
      items = items.filter((c) =>
        params.filters!.channels!.has(c.channel.toLowerCase()),
      )
    }

    return items
  }

  async fetchMessages(chatId: string): Promise<ChatMessage[]> {
    await delay()
    return [...(chatMessages[chatId] || [])]
  }

  async sendMessage(
    chatId: string,
    payload: SendMessagePayload,
  ): Promise<ChatMessage> {
    await delay()
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes().toString().padStart(2, "0")
    const ampm = hours >= 12 ? "PM" : "AM"
    const h12 = hours % 12 || 12
    const timeStr = `${h12}:${minutes} ${ampm}`

    const msg: ChatMessage = {
      id: `m-sent-${++messageCounter}`,
      text: payload.text,
      time: timeStr,
      sender: "agent",
      senderName: "You",
      status: "sent",
      sentBy: { type: "agent", name: "You" },
    }

    if (payload.replyToMessageId) {
      const thread = chatMessages[chatId]
      const original = thread?.find((m) => m.id === payload.replyToMessageId)
      if (original) {
        msg.replyTo = {
          sender: original.senderName || (original.sender === "customer" ? "Customer" : "Agent"),
          text: original.text,
          messageId: original.id,
        }
      }
    }

    // Append to local mock data so subsequent fetchMessages includes it
    if (!chatMessages[chatId]) {
      chatMessages[chatId] = []
    }
    chatMessages[chatId].push(msg)

    return msg
  }

  async sendTemplate(
    _chatId: string,
    _payload: TemplateSendPayload,
  ): Promise<void> {
    await delay()
  }

  async assignChat(_chatId: string, _agentId: string): Promise<void> {
    await delay()
  }

  async resolveChat(_chatId: string): Promise<void> {
    await delay()
  }

  async fetchContacts(query?: string): Promise<Contact[]> {
    await delay()
    if (!query) return [...contacts]
    const q = query.toLowerCase()
    return contacts.filter(
      (c) => c.name.toLowerCase().includes(q) || c.phone.includes(q),
    )
  }

  async createContact(contact: {
    name: string
    phone: string
    channel: string
  }): Promise<Contact> {
    await delay()
    const newContact: Contact = {
      id: `c-new-${Date.now()}`,
      name: contact.name,
      phone: contact.phone,
      channel: contact.channel,
    }
    contacts.push(newContact)
    return newContact
  }

  async fetchTemplates(category?: TemplateCategory): Promise<TemplateDef[]> {
    await delay()
    if (!category || category === "all") return [...templateList]
    return templateList.filter((t) => t.category === category)
  }

  async fetchContactDetails(chatId: string): Promise<ContactDetails> {
    await delay()
    const chat = chatItems.find((c) => c.id === chatId)
    const contact = contacts.find(
      (c) => c.name === chat?.name || c.phone === chat?.name,
    )
    return {
      name: contact?.name || chat?.name || "Unknown",
      phone: contact?.phone || "+91 00000 00000",
      email: "contact@example.com",
      source: "WhatsApp",
      marketingOptIn: true,
      tags: ["Customer"],
      location: "India",
    }
  }

  async updateContactDetails(
    _chatId: string,
    _data: Partial<ContactDetails>,
  ): Promise<void> {
    await delay()
  }

  async fetchCannedMessages(): Promise<CannedMessage[]> {
    await delay()
    return [...cannedMessages]
  }

  onNewMessage(
    _callback: (chatId: string, message: ChatMessage) => void,
  ): () => void {
    // No-op for mock — real transport would set up WebSocket/SSE
    return () => {}
  }
}
