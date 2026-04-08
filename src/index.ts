// Utils
export { cn } from "./lib/utils";

// Brand Icons
export { MyOperatorChatIcon } from "./components/custom/talk-to-us-modal/icon";
export type { BrandIconProps } from "./components/custom/talk-to-us-modal/icon";

// Avatar
export { Avatar, avatarVariants, getInitials } from "./components/ui/avatar";
export type { AvatarProps } from "./components/ui/avatar";

// Button
export { Button, buttonVariants } from "./components/ui/button";
export type { ButtonProps } from "./components/ui/button";

// Badge
export { Badge, badgeVariants } from "./components/ui/badge";
export type { BadgeProps } from "./components/ui/badge";

// Tag
export { Tag, tagVariants } from "./components/ui/tag";
export type { TagProps } from "./components/ui/tag";

// Table
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  TableSkeleton,
  TableEmpty,
  TableAvatar,
  TableToggle,
  tableVariants,
} from "./components/ui/table";
export type {
  TableProps,
  TableRowProps,
  TableHeadProps,
  TableCellProps,
  TableSkeletonProps,
  TableEmptyProps,
  TableAvatarProps,
  TableToggleProps,
} from "./components/ui/table";

// Tabs
export { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs";
export type { TabsListProps } from "./components/ui/tabs";

// Dropdown Menu
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from "./components/ui/dropdown-menu";

// Switch (renamed from Toggle)
export { Switch, switchVariants } from "./components/ui/switch";
export type { SwitchProps } from "./components/ui/switch";

// Input
export { Input, inputVariants } from "./components/ui/input";
export type { InputProps } from "./components/ui/input";

// TextField
export {
  TextField,
  textFieldContainerVariants,
  textFieldInputVariants,
} from "./components/ui/text-field";
export type { TextFieldProps } from "./components/ui/text-field";

// Textarea
export { Textarea, textareaVariants } from "./components/ui/textarea";
export type { TextareaProps } from "./components/ui/textarea";

// Select
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  selectTriggerVariants,
} from "./components/ui/select";
export type { SelectTriggerProps } from "./components/ui/select";

// CreatableSelect
export {
  CreatableSelect,
  creatableSelectTriggerVariants,
} from "./components/ui/creatable-select";
export type {
  CreatableSelectProps,
  CreatableSelectOption,
} from "./components/ui/creatable-select";

// CreatableMultiSelect
export {
  CreatableMultiSelect,
  creatableMultiSelectTriggerVariants,
} from "./components/ui/creatable-multi-select";
export type {
  CreatableMultiSelectProps,
  CreatableMultiSelectOption,
} from "./components/ui/creatable-multi-select";

// SelectField
export { SelectField } from "./components/ui/select-field";
export type {
  SelectFieldProps,
  SelectOption,
} from "./components/ui/select-field";

// MultiSelect
export {
  MultiSelect,
  multiSelectTriggerVariants,
} from "./components/ui/multi-select";
export type {
  MultiSelectProps,
  MultiSelectOption,
} from "./components/ui/multi-select";

// Checkbox
export { Checkbox, checkboxVariants } from "./components/ui/checkbox";
export type { CheckboxProps, CheckedState } from "./components/ui/checkbox";

// ContactListItem
export { ContactListItem } from "./components/ui/contact-list-item";
export type { ContactListItemProps } from "./components/ui/contact-list-item";

// Panel
export { Panel, panelVariants } from "./components/ui/panel";
export type { PanelProps } from "./components/ui/panel";

// Accordion (renamed from Collapsible)
export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  accordionVariants,
  accordionItemVariants,
  accordionTriggerVariants,
  accordionContentVariants,
} from "./components/ui/accordion";
export type {
  AccordionProps,
  AccordionItemProps,
  AccordionTriggerProps,
  AccordionContentProps,
} from "./components/ui/accordion";

// PageHeader
export { PageHeader, pageHeaderVariants } from "./components/ui/page-header";
export type { PageHeaderProps } from "./components/ui/page-header";

// FormModal
export { FormModal } from "./components/ui/form-modal";
export type { FormModalProps } from "./components/ui/form-modal";

// ReadableField
export { ReadableField } from "./components/ui/readable-field";
export type { ReadableFieldProps } from "./components/ui/readable-field";

// Spinner
export { Spinner, spinnerVariants } from "./components/ui/spinner";
export type { SpinnerProps } from "./components/ui/spinner";

// Skeleton
export { Skeleton, skeletonVariants } from "./components/ui/skeleton";
export type { SkeletonProps } from "./components/ui/skeleton";

// Pagination
export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  PaginationWidget,
} from "./components/ui/pagination";
export type {
  PaginationProps,
  PaginationContentProps,
  PaginationItemProps,
  PaginationLinkProps,
  PaginationPreviousProps,
  PaginationNextProps,
  PaginationEllipsisProps,
  PaginationWidgetProps,
} from "./components/ui/pagination";

// EmptyState
export { EmptyState } from "./components/ui/empty-state";
export type { EmptyStateProps } from "./components/ui/empty-state";

// AddIntegration (Custom)
export { AddIntegration } from "./components/custom/add-integration"
export type {
  AddIntegrationProps,
  ComposioToolkit,
  ComposioConnectedAccount,
  ConnectionStatus,
  ConnectionErrorVariant,
  AddIntegrationStep,
} from "./components/custom/add-integration"

// SetupIntegration (Custom)
export { SetupIntegration, ChatMessageBubble, ChatInput } from "./components/custom/setup-integration"
export type {
  SetupIntegrationProps,
  ChatMessage,
  SetupIntegrationAction,
  ChatMessageProps,
  ChatInputProps,
} from "./components/custom/setup-integration"

// EventSelector (Custom - NOT available via CLI)
export { EventSelector } from "./components/custom/event-selector";
export type {
  EventSelectorProps,
  EventItem,
  EventGroup,
  EventCategory,
} from "./components/custom/event-selector";

// KeyValueInput (Custom - NOT available via CLI)
export { KeyValueInput } from "./components/custom/key-value-input";
export type {
  KeyValueInputProps,
  KeyValuePair,
} from "./components/custom/key-value-input";

// AlertConfiguration (Custom - NOT available via CLI)
export {
  AlertConfiguration,
  AlertValuesModal,
} from "./components/custom/alert-configuration";
export type {
  AlertConfigurationProps,
  AlertValuesModalProps,
} from "./components/custom/alert-configuration";

// WalletTopup (Custom - NOT available via CLI)
export { WalletTopup } from "./components/custom/wallet-topup";
export type {
  WalletTopupProps,
  AmountOption,
} from "./components/custom/wallet-topup";

// PaymentSummary (Custom - NOT available via CLI)
export { PaymentSummary } from "./components/custom/payment-summary";
export type {
  PaymentSummaryProps,
  PaymentSummaryItem,
  PaymentSummaryHeaderInfo,
  BreakdownCardItem,
  PaymentSummaryBreakdownCard,
} from "./components/custom/payment-summary";

// AutoPaySetup (Custom - NOT available via CLI)
export { AutoPaySetup } from "./components/custom/auto-pay-setup";
export type { AutoPaySetupProps } from "./components/custom/auto-pay-setup";

// BankDetails (Custom - NOT available via CLI)
export { BankDetails } from "./components/custom/bank-details";
export type {
  BankDetailsProps,
  BankDetailItem,
} from "./components/custom/bank-details";

// ApiFeatureCard (Custom - NOT available via CLI)
export { ApiFeatureCard } from "./components/custom/api-feature-card";
export type {
  ApiFeatureCardProps,
  Capability,
} from "./components/custom/api-feature-card";

// EndpointDetails (Custom - NOT available via CLI)
export { EndpointDetails } from "./components/custom/endpoint-details";
export type { EndpointDetailsProps } from "./components/custom/endpoint-details";

// PricingCard (Custom)
export { PricingCard, CompactCarIcon, SedanCarIcon, SuvCarIcon } from "./components/custom/pricing-card";
export type { PricingCardProps, PricingCardAddon, PricingCardFeature, UsageDetail } from "./components/custom/pricing-card";

// PaymentOptionCard (Custom)
export { PaymentOptionCard, PaymentOptionCardModal } from "./components/custom/payment-option-card";
export type {
  PaymentOptionCardProps,
  PaymentOptionCardModalProps,
  PaymentOption,
} from "./components/custom/payment-option-card";

// PowerUpCard (Custom)
export { PowerUpCard } from "./components/custom/power-up-card";
export type { PowerUpCardProps } from "./components/custom/power-up-card";

// TalkToUsModal (Custom)
export { TalkToUsModal } from "./components/custom/talk-to-us-modal";
export type { TalkToUsModalProps } from "./components/custom/talk-to-us-modal";

// PlanDetailModal (Custom)
export { PlanDetailModal } from "./components/custom/plan-detail-modal";
export type { PlanDetailModalProps, PlanFeature } from "./components/custom/plan-detail-modal";

// PlanUpgradeModal (Custom)
export { PlanUpgradeModal, billingCycleOptionVariants } from "./components/custom/plan-upgrade-modal";
export type {
  PlanUpgradeModalProps,
  BillingCycleOption,
  BillingCycleOptionIcon,
} from "./components/custom/plan-upgrade-modal";

// PlanUpgradeSummaryModal (Custom)
export {
  PlanUpgradeSummaryModal,
  modalRootVariants as planUpgradeSummaryModalRootVariants,
  summaryPanelVariants as planUpgradeSummaryPanelVariants,
} from "./components/custom/plan-upgrade-summary-modal";
export type {
  PlanUpgradeSummaryModalProps,
  PlanUpgradeSummaryMode,
  PlanUpgradeSummaryRow,
  PlanUpgradeSummaryStatus,
  PlanUpgradeSummaryTone,
} from "./components/custom/plan-upgrade-summary-modal";

// LetUsDriveCard (Custom)
export { LetUsDriveCard } from "./components/custom/let-us-drive-card";
export type { LetUsDriveCardProps } from "./components/custom/let-us-drive-card";

// PricingToggle (Custom)
export { PricingToggle } from "./components/custom/pricing-toggle";
export type { PricingToggleProps, PricingToggleTab } from "./components/custom/pricing-toggle";

// PricingPage (Custom)
export { PricingPage } from "./components/custom/pricing-page";
export type { PricingPageProps } from "./components/custom/pricing-page";

// DateRangeModal (Custom)
export { DateRangeModal } from "./components/custom/date-range-modal/index";
export type { DateRangeModalProps } from "./components/custom/date-range-modal/index";

// ChatListItem (Custom)
export { ChatListItem } from "./components/custom/chat-list-item";
export type { ChatListItemProps, MessageStatus, MessageType } from "./components/custom/chat-list-item";

// ChatTimelineDivider (Custom)
export { ChatTimelineDivider } from "./components/custom/chat-timeline-divider";
export type { ChatTimelineDividerProps, ChatTimelineDividerVariant } from "./components/custom/chat-timeline-divider";

// Bots (Custom)
export {
  BotCard,
  CreateBotModal,
  BotList,
  BotListHeader,
  BotListSearch,
  BotListCreateCard,
  BotListGrid,
  BOT_TYPE,
} from "./components/custom/bots";
export type {
  BotCardProps,
  CreateBotModalProps,
  CreateBotModalTypeOptionsProps,
  BotListProps,
  BotListHeaderProps,
  BotListSearchProps,
  BotListCreateCardProps,
  BotListGridProps,
  Bot,
  BotType,
  BotStatus,
} from "./components/custom/bots";

// IvrBot (Custom)
export {
  BotIdentityCard,
  BotBehaviorCard,
  KnowledgeBaseCard,
  FunctionsCard,
  FrustrationHandoverCard,
  AdvancedSettingsCard,
  IvrBotConfig,
  CreateFunctionModal,
  defaultAdvancedSettingsNumericBounds,
  defaultBotNameIdentityTooltip,
  defaultPrimaryRoleTooltip,
  defaultToneTooltip,
  defaultHowItSoundsTooltip,
  defaultLanguageModeTooltip,
  defaultKnowledgeBaseInfoTooltip,
  defaultFallbackPromptsInfoTooltip,
  defaultEscalateToHumanInfoTooltip,
} from "./components/custom/ivr-bot";
export type {
  BotIdentityCardProps,
  BotIdentityData,
  VoiceOption,
  LanguageOption,
  RoleOption,
  ToneOption,
} from "./components/custom/ivr-bot/bot-identity-card";
export type { BotBehaviorData, BotBehaviorCardProps } from "./components/custom/ivr-bot/bot-behavior-card";
export type { KnowledgeBaseCardProps } from "./components/custom/ivr-bot/knowledge-base-card";
export type { FunctionsCardProps } from "./components/custom/ivr-bot/functions-card";
export type { FrustrationHandoverData, FrustrationHandoverCardProps } from "./components/custom/ivr-bot/frustration-handover-card";
export type { AdvancedSettingsData, AdvancedSettingsCardProps } from "./components/custom/ivr-bot/advanced-settings-card";
export type {
  IvrBotConfigProps,
  IvrBotConfigData,
  CreateFunctionModalProps,
  CreateFunctionData,
  CreateFunctionStep1Data,
  CreateFunctionStep2Data,
  FunctionItem,
  KnowledgeBaseFile,
  KnowledgeFileStatus,
  KeyValuePair as IvrBotKeyValuePair,
  HttpMethod,
  FunctionTabType,
  DefaultAdvancedSettingsNumericBounds,
  AdvancedSettingsNumericBounds,
  AdvancedSettingsNumericFieldBlurDetail,
} from "./components/custom/ivr-bot";

// ReplyQuote
export { ReplyQuote } from "./components/ui/reply-quote";
export type { ReplyQuoteProps } from "./components/ui/reply-quote";

// DateDivider
export { DateDivider } from "./components/ui/date-divider";
export type { DateDividerProps } from "./components/ui/date-divider";

// UnreadSeparator
export { UnreadSeparator } from "./components/ui/unread-separator";
export type { UnreadSeparatorProps } from "./components/ui/unread-separator";

// SystemMessage
export { SystemMessage } from "./components/ui/system-message";
export type { SystemMessageProps } from "./components/ui/system-message";

// PhoneInput
export { PhoneInput } from "./components/ui/phone-input";
export type { PhoneInputProps } from "./components/ui/phone-input";

// ImageMedia
export { ImageMedia } from "./components/ui/image-media";
export type { ImageMediaProps } from "./components/ui/image-media";

// VideoMedia (Custom)
export { VideoMedia } from "./components/custom/video-media";
export type { VideoMediaProps } from "./components/custom/video-media";

// AudioMedia (Custom)
export { AudioMedia } from "./components/custom/audio-media";
export type { AudioMediaProps } from "./components/custom/audio-media";

// DocMedia (Custom)
export { DocMedia } from "./components/custom/doc-media";
export type { DocMediaProps, DocMediaVariant } from "./components/custom/doc-media";

// CarouselMedia (Custom)
export { CarouselMedia } from "./components/custom/carousel-media";
export type { CarouselMediaProps, CarouselCard, CarouselCardButton } from "./components/custom/carousel-media";

// ChatBubble (Custom)
export { ChatBubble } from "./components/custom/chat-bubble";
export type { ChatBubbleProps, ChatBubbleReply, DeliveryStatus } from "./components/custom/chat-bubble";

// ChatComposer (Custom)
export { ChatComposer } from "./components/custom/chat-composer";
export type { ChatComposerProps, ChatComposerReply } from "./components/custom/chat-composer";

// AttachmentPreview (Custom)
export { AttachmentPreview } from "./components/custom/attachment-preview";
export type { AttachmentPreviewProps } from "./components/custom/attachment-preview";

// BotKnowledgeBase (Custom)
export { BotKnowledgeBase } from "./components/custom/bot-knowledge-base";
export type { BotKnowledgeBaseProps, KnowledgeBaseFile as BotKnowledgeBaseFile, KnowledgeFileStatus as BotKnowledgeFileStatus } from "./components/custom/bot-knowledge-base";

// BotInstructions (Custom)
export { BotInstructions } from "./components/custom/bot-instructions";
export type { BotInstructionsProps, InstructionItem } from "./components/custom/bot-instructions";

// BotFunctions (Custom)
export { BotFunctions } from "./components/custom/bot-functions";
export type { BotFunctionsProps, FunctionItem as BotFunctionItem } from "./components/custom/bot-functions";

// BotIntegrations (Custom)
export { BotIntegrations } from "./components/custom/bot-integrations";
export type { BotIntegrationsProps, IntegrationItem } from "./components/custom/bot-integrations";

// BotSettings (Custom)
export { BotSettings } from "./components/custom/bot-settings";
export type { BotSettingsProps } from "./components/custom/bot-settings";

// BotHumanHandover (Custom)
export { BotHumanHandover } from "./components/custom/bot-human-handover";
export type { BotHumanHandoverProps } from "./components/custom/bot-human-handover";

// BotNudges (Custom)
export { BotNudges } from "./components/custom/bot-nudges";
export type { BotNudgesProps, NudgeItem, DelayUnit } from "./components/custom/bot-nudges";

