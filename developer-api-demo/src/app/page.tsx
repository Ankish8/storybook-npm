"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/toast";
import {
  Code2,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  MoreVertical,
  ExternalLink,
  Info,
} from "lucide-react";

type APIType = "calling" | "whatsapp";

interface APICredentials {
  isActive: boolean;
  baseUrl: string;
  apiToken: string;
  secretKey: string;
  xApiKey: string;
  companyId: string;
}

const initialCredentials: Record<APIType, APICredentials> = {
  calling: {
    isActive: false,
    baseUrl: "https://api.myoperator.co/v3/voice/gateway",
    apiToken: "0ff081b6abc123def456789xyz68ac",
    secretKey: "664976fb9876543210abcdef9530",
    xApiKey: "tpb0syNDbO4k49ZbyiWeU5k8gFWQ7ODBJ7GYr3UO",
    companyId: "12",
  },
  whatsapp: {
    isActive: false,
    baseUrl: "https://api.myoperator.co/v3/whatsapp/gateway",
    apiToken: "wa081b6abc123def456789xyz68ac",
    secretKey: "wa4976fb9876543210abcdef9530",
    xApiKey: "wab0syNDbO4k49ZbyiWeU5k8gFWQ7ODBJ7GYr3UO",
    companyId: "12",
  },
};

export default function DeveloperAPIPage() {
  const [credentials, setCredentials] = useState(initialCredentials);
  const [expandedAPI, setExpandedAPI] = useState<APIType | null>(null);
  const [isActivating, setIsActivating] = useState<APIType | null>(null);
  const [visibility, setVisibility] = useState({
    callingApiToken: false,
    callingSecretKey: false,
    whatsappApiToken: false,
    whatsappSecretKey: false,
  });
  const [revokeModal, setRevokeModal] = useState<{
    open: boolean;
    apiType: APIType | null;
  }>({ open: false, apiType: null });
  const [regenerateModal, setRegenerateModal] = useState<{
    open: boolean;
    apiType: APIType | null;
    field: string;
  }>({ open: false, apiType: null, field: "" });

  const apiList: { type: APIType; name: string; description: string }[] = [
    {
      type: "calling",
      name: "Calling API",
      description: "Manage real-time call flow, recordings, and intelligent routing.",
    },
    {
      type: "whatsapp",
      name: "WhatsApp API",
      description: "Automated templates and session management for global engagement.",
    },
  ];

  const activateAPI = (apiType: APIType) => {
    setIsActivating(apiType);
    setTimeout(() => {
      setCredentials((prev) => ({
        ...prev,
        [apiType]: { ...prev[apiType], isActive: true },
      }));
      setExpandedAPI(apiType);
      setIsActivating(null);
      toast.success({ title: `${apiType === "calling" ? "Calling" : "WhatsApp"} API activated` });
    }, 800);
  };

  const toggleExpand = (apiType: APIType) => {
    setExpandedAPI(expandedAPI === apiType ? null : apiType);
  };

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    toast.success({ title: `${label} copied` });
  };

  const toggleVisibility = (field: keyof typeof visibility) => {
    setVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const confirmRevoke = () => {
    if (!revokeModal.apiType) return;
    const apiType = revokeModal.apiType;
    setCredentials((prev) => ({
      ...prev,
      [apiType]: { ...initialCredentials[apiType], isActive: false },
    }));
    setExpandedAPI(null);
    setRevokeModal({ open: false, apiType: null });
    toast.success({ title: "API access revoked" });
  };

  const confirmRegenerate = () => {
    if (!regenerateModal.apiType) return;
    setRegenerateModal({ open: false, apiType: null, field: "" });
    toast.success({ title: "Credentials regenerated" });
  };

  const renderCredentialRow = (
    label: string,
    value: string,
    apiType: APIType,
    field?: string,
    isSecret?: boolean
  ) => {
    const visibilityKey = `${apiType}${field}` as keyof typeof visibility;
    const isVisible = visibility[visibilityKey];

    return (
      <div className="flex items-center justify-between py-2 border-b border-semantic-border-layout last:border-b-0">
        <span className="text-sm text-semantic-text-muted w-32">{label}</span>
        <div className="flex items-center gap-2 flex-1">
          <code className="text-sm font-mono text-semantic-text-primary bg-semantic-bg-ui px-2 py-1 rounded flex-1 truncate">
            {isSecret && !isVisible ? "••••••••••••••••••••••" : value}
          </code>
          {isSecret && (
            <button
              onClick={() => toggleVisibility(visibilityKey)}
              className="p-1.5 rounded hover:bg-semantic-bg-ui text-semantic-text-muted"
            >
              {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
          <button
            onClick={() => copyToClipboard(value, label)}
            className="p-1.5 rounded hover:bg-semantic-bg-ui text-semantic-text-muted"
          >
            <Copy className="w-4 h-4" />
          </button>
          {field && (
            <button
              onClick={() => setRegenerateModal({ open: true, apiType, field: label })}
              className="p-1.5 rounded hover:bg-semantic-bg-ui text-semantic-text-muted"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-semantic-bg-primary">
      {/* Page Header */}
      <PageHeader
        icon={<Code2 />}
        title="Developer API"
        description="Configure and manage your API integrations"
        infoIcon={<Info className="w-4 h-4" />}
      />

      {/* Content */}
      <div className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">API</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiList.map((api) => {
              const cred = credentials[api.type];
              const isExpanded = expandedAPI === api.type;

              return (
                <React.Fragment key={api.type}>
                  <TableRow>
                    <TableCell>
                      <div>
                        <div className="font-medium text-semantic-text-primary">
                          {api.name}
                        </div>
                        <div className="text-sm text-semantic-text-muted">
                          {api.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {cred.isActive ? (
                        <Badge variant="active">Active</Badge>
                      ) : (
                        <Badge variant="inactive">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href="#"
                          className="text-sm text-semantic-text-link hover:underline flex items-center gap-1"
                        >
                          View Docs
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        {!cred.isActive ? (
                          <Button
                            onClick={() => activateAPI(api.type)}
                            loading={isActivating === api.type}
                            loadingText="Activating..."
                          >
                            Activate Keys
                          </Button>
                        ) : (
                          <>
                            <Button
                              variant="outline"
                              onClick={() => toggleExpand(api.type)}
                            >
                              {isExpanded ? "Hide Keys" : "View Keys"}
                            </Button>
                            <button
                              onClick={() => setRevokeModal({ open: true, apiType: api.type })}
                              className="p-2 rounded hover:bg-semantic-bg-ui text-semantic-text-muted"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* Expanded Credentials Row */}
                  {isExpanded && cred.isActive && (
                    <TableRow>
                      <TableCell colSpan={3} className="bg-semantic-bg-ui p-0">
                        <div className="p-4 space-y-4">
                          <div className="grid grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-1">
                              {renderCredentialRow("Base URL", cred.baseUrl, api.type)}
                              {renderCredentialRow("API Token", cred.apiToken, api.type, "ApiToken", true)}
                              {renderCredentialRow("Secret Key", cred.secretKey, api.type, "SecretKey", true)}
                            </div>
                            {/* Right Column */}
                            <div className="space-y-1">
                              {renderCredentialRow("x-api-key", cred.xApiKey, api.type)}
                              {renderCredentialRow("Company ID", cred.companyId, api.type)}
                            </div>
                          </div>

                          <Alert variant="warning" showIcon={true}>
                            <AlertDescription>
                              Keep credentials secure. Never share publicly. Regenerating invalidates existing integrations.
                            </AlertDescription>
                          </Alert>

                          <div className="flex justify-end">
                            <Button
                              variant="ghost"
                              className="text-semantic-error-primary hover:text-semantic-error-hover hover:bg-semantic-error-surface"
                              onClick={() => setRevokeModal({ open: true, apiType: api.type })}
                            >
                              Revoke Access
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Revoke Modal */}
      <Dialog
        open={revokeModal.open}
        onOpenChange={(open) => setRevokeModal({ open, apiType: null })}
      >
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Revoke API Access?</DialogTitle>
            <DialogDescription>
              This will permanently delete your API credentials. All applications using
              these credentials will immediately stop working. You can generate new
              credentials later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRevokeModal({ open: false, apiType: null })}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmRevoke}>
              Revoke Access
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Regenerate Modal */}
      <Dialog
        open={regenerateModal.open}
        onOpenChange={(open) => setRegenerateModal({ open, apiType: null, field: "" })}
      >
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Regenerate {regenerateModal.field}?</DialogTitle>
            <DialogDescription>
              This will immediately invalidate your current credentials. Any applications
              using the old credentials will stop working.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRegenerateModal({ open: false, apiType: null, field: "" })}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmRegenerate}>
              Regenerate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
